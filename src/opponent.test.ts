import { expect, test } from "bun:test";
import { BattleSession, skirmishPosition } from "./battle-session";
import { createBattle } from "./engine";
import { chooseAction, OpponentTurn } from "./opponent";
import type { Cell } from "./model";

function separated(): BattleSession {
  return new BattleSession(
    createBattle({
      ...skirmishPosition,
      activePlayer: "south",
      cards: skirmishPosition.cards
        .filter((card) => card.definition === "fighter")
        .map((card) => ({
          ...card,
          location: {
            zone: "battlefield",
            cell: (card.controller === "north" ? "B3" : "B3′") as Cell,
          },
        })),
    }),
    () => 4,
  );
}

test("chooses the weakest legal target without mutating state or actions", () => {
  const battle = new BattleSession();
  battle.endTurn();
  const state = battle.state;
  const actions = battle.decisions;
  const before = JSON.stringify({ state, actions });
  expect(chooseAction(state, actions)).toEqual({
    type: "strike",
    player: "south",
    card: "south-guard",
    target: "north-ward",
  });
  expect(JSON.stringify({ state, actions })).toBe(before);
  expect(chooseAction(state, actions)).toEqual(chooseAction(state, actions));
});

test("approaches an enemy but ends the turn instead of moving sideways", () => {
  const battle = separated();
  expect(chooseAction(battle.state, battle.decisions)).toEqual({
    type: "move",
    player: "south",
    card: "south-fighter",
    to: "B2′",
  });
  const blocked = new BattleSession(
    createBattle({
      ...battle.state,
      cards: [
        ...battle.state.cards,
        {
          ...skirmishPosition.cards.find((card) => card.id === "south-guard")!,
          status: "closed",
          location: { zone: "battlefield", cell: "B2′" },
        },
      ],
    }),
  );
  expect(blocked.decisions.some((action) => action.type === "move")).toBe(true);
  expect(chooseAction(blocked.state, blocked.decisions)).toEqual({ type: "end-turn" });
});

test("south reacts during north's turn and north's defender decision remains available", () => {
  const battle = new BattleSession(skirmishPosition, () => 4);
  battle.command({
    type: "strike",
    player: "north",
    card: "north-fighter",
    target: "south-fighter",
  });
  expect(battle.state.activePlayer).toBe("north");
  expect(battle.state.priorityPlayer).toBe("south");
  const defender = chooseAction(battle.state, battle.decisions)!;
  expect(defender.type).toBe("defend");
  expect(chooseAction(battle.state, [{ type: "take-attack" }])).toEqual({ type: "take-attack" });
  battle.decide(defender);
  expect(battle.state.priorityPlayer).toBe("north");
  battle.endTurn();
  battle.decide(chooseAction(battle.state, battle.decisions)!);
  expect(battle.state.priorityPlayer).toBe("north");
  expect(battle.defenders.length).toBeGreaterThan(0);
  expect(battle.decisions).toContainEqual({ type: "take-attack" });
});

test("greedy decisions stay legal through a complete battle", () => {
  let roll = 0;
  const battle = new BattleSession(skirmishPosition, () => (++roll % 2 ? 6 : 1));
  for (let step = 0; step < 200 && !battle.state.outcome; step++) {
    const action = chooseAction(battle.state, battle.decisions);
    if (!action) throw new Error("Opponent did not choose a decision");
    expect(battle.decisions).toContainEqual(action);
    battle.decide(action);
    expect(battle.error).toBeNull();
  }
  expect(battle.state.outcome).not.toBeNull();
  expect(battle.decisions).toEqual([]);
  expect(chooseAction(battle.state, battle.decisions)).toBeNull();
});

async function waitFor(done: () => boolean): Promise<void> {
  for (let attempt = 0; attempt < 100 && !done(); attempt++) await Bun.sleep(5);
  expect(done()).toBe(true);
}

test("paced opponent pauses for the human, resumes, and hands back the turn", async () => {
  const battle = new BattleSession(skirmishPosition, () => 4);
  let changes = 0;
  const opponent = new OpponentTurn(
    battle,
    "south",
    () => {
      changes++;
    },
    1,
  );
  try {
    battle.endTurn();
    opponent.update();
    opponent.update();
    expect(changes).toBe(0);
    await waitFor(() => changes > 0);
    expect(battle.state.priorityPlayer).toBe("north");
    expect(battle.defenders.length).toBeGreaterThan(0);
    const paused = battle.state;
    await Bun.sleep(10);
    expect(battle.state).toBe(paused);
    expect(changes).toBe(1);
    battle.takeAttack();
    opponent.update();
    await waitFor(() => {
      if (battle.state.priorityPlayer === "north" && battle.defenders.length) {
        battle.takeAttack();
        opponent.update();
      }
      return battle.state.activePlayer === "north" && battle.state.stack.length === 0;
    });
    expect(changes).toBeGreaterThan(1);
  } finally {
    opponent.cancel();
  }
});

test("restart cancels a pending decision and stale states are never applied", async () => {
  const battle = new BattleSession();
  let changes = 0;
  const opponent = new OpponentTurn(
    battle,
    "south",
    () => {
      changes++;
    },
    10,
  );
  battle.endTurn();
  opponent.update();
  opponent.cancel();
  battle.restart();
  await Bun.sleep(25);
  expect(battle.state).toBe(skirmishPosition);
  expect(changes).toBe(0);
  battle.endTurn();
  opponent.update();
  battle.restart();
  await Bun.sleep(25);
  expect(battle.state).toBe(skirmishPosition);
  expect(changes).toBe(0);
});

test("playback readiness blocks scheduling and a pending decision until resumed", async () => {
  const battle = new BattleSession();
  let ready = false;
  let changes = 0;
  const opponent = new OpponentTurn(
    battle,
    "south",
    () => changes++,
    10,
    () => ready,
  );
  try {
    battle.endTurn();
    const before = battle.state;
    opponent.update();
    await Bun.sleep(25);
    expect(battle.state).toBe(before);
    ready = true;
    opponent.update();
    ready = false;
    await Bun.sleep(25);
    expect(battle.state).toBe(before);
    expect(changes).toBe(0);
    ready = true;
    opponent.update();
    await waitFor(() => changes > 0);
    expect(changes).toBe(1);
  } finally {
    opponent.cancel();
  }
});
