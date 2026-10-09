import { expect, test } from "bun:test";
import { abilityPosition, BattleSession } from "./battle-session";
import { applyCommand, createBattle } from "./engine";
import type { MatchState } from "./model";

const card = (battle: BattleSession, id: string) =>
  battle.state.cards.find((card) => card.id === id)!;
function attack(battle: BattleSession, source: string, target: string) {
  battle.command({ type: "strike", player: "north", card: source, target });
  if (battle.defenders.length) battle.takeAttack();
  expect(battle.error).toBeNull();
}

test("armor is shared across hits and resets for both squads each player turn", () => {
  const battle = new BattleSession(abilityPosition, () => 4);
  attack(battle, "north-fighter", "south-guard");
  expect(card(battle, "south-guard").wounds).toBe(1);
  expect(card(battle, "south-guard").armorSpent).toBe(1);
  attack(battle, "north-ward", "south-guard");
  expect(card(battle, "south-guard").wounds).toBe(2);
  battle.endTurn();
  expect(card(battle, "south-guard").armorSpent).toBe(0);
  // North's guard consumes armor on south's turn, then resets on north's turn.
  battle.command({ type: "strike", player: "south", card: "south-fighter", target: "north-guard" });
  battle.takeAttack();
  expect(card(battle, "north-guard").armorSpent).toBe(1);
  battle.endTurn();
  expect(card(battle, "north-guard").armorSpent).toBe(0);
  expect(
    abilityPosition.cards.every((card) => card.armorSpent === undefined && card.wounds === 0),
  ).toBe(true);
});

test("armor belongs to the redirected defender and protects against counterstrikes", () => {
  const battle = new BattleSession(abilityPosition, () => 4);
  battle.command({
    type: "strike",
    player: "north",
    card: "north-fighter",
    target: "south-fighter",
  });
  battle.command({ type: "defend", player: "south", card: "south-guard" });
  expect(battle.events).toContainEqual({
    type: "prevented",
    card: "south-guard",
    source: "north-fighter",
    amount: 1,
  });
  expect(card(battle, "south-fighter").wounds).toBe(0);
  let roll = 0;
  const response = new BattleSession(abilityPosition, () => (++roll % 2 ? 2 : 6));
  attack(response, "north-guard", "south-fighter");
  expect(card(response, "north-guard").armorSpent).toBe(1);
  expect(card(response, "north-guard").wounds).toBe(2);
});

test("misses preserve armor and a fully absorbed lethal hit causes no wounds or destruction", () => {
  const miss = new BattleSession(abilityPosition, () => 6);
  attack(miss, "north-fighter", "south-guard");
  expect(card(miss, "south-guard").armorSpent ?? 0).toBe(0);
  const lethal = new BattleSession(
    createBattle({
      ...abilityPosition,
      cards: abilityPosition.cards.map((card) =>
        card.id === "south-guard" ? { ...card, wounds: 2, status: "closed" } : card,
      ),
    }),
    () => 4,
  );
  attack(lethal, "north-ward", "south-guard");
  expect(card(lethal, "south-guard").location.zone).toBe("battlefield");
  expect(card(lethal, "south-guard").wounds).toBe(2);
  expect(
    lethal.events.some((event) => event.type === "wounded" || event.type === "destroyed"),
  ).toBe(false);
});

test("ability values and armor markers are validated", () => {
  for (const amount of [0, -1, 1.5, NaN])
    expect(() =>
      createBattle({
        ...abilityPosition,
        definitions: abilityPosition.definitions.map((def) => ({
          ...def,
          abilities: { armor: amount },
        })),
      }),
    ).toThrow("Invalid creature ability");
  expect(() =>
    createBattle({
      ...abilityPosition,
      cards: abilityPosition.cards.map((card) => ({ ...card, armorSpent: -1 })),
    }),
  ).toThrow("Invalid card markers");
});

function wounded() {
  return createBattle({
    ...abilityPosition,
    cards: abilityPosition.cards.map((card) =>
      card.id === "north-guard" ? { ...card, wounds: 2 } : card,
    ),
  });
}
const heal = { type: "heal", player: "north", card: "north-ward", target: "north-guard" } as const;

test("healing restores actual wounds without dice and spends Ward's action until refreshed", () => {
  const battle = new BattleSession(wounded(), () => {
    throw new Error("Healing must not roll");
  });
  battle.command(heal);
  expect(battle.error).toBeNull();
  expect(card(battle, "north-guard").wounds).toBe(0);
  expect(card(battle, "north-ward").status).toBe("closed");
  expect(battle.events).toContainEqual({
    type: "healed",
    card: "north-guard",
    source: "north-ward",
    amount: 2,
  });
  expect(
    battle.events.some((event) => event.type === "rolled" || event.type === "redirected"),
  ).toBe(false);
  for (const command of [
    heal,
    { type: "move", player: "north", card: "north-ward", to: "D2" },
    { type: "strike", player: "north", card: "north-ward", target: "south-ward" },
  ] as const) {
    battle.command(command);
    expect(battle.error).toBe("card closed");
  }
  battle.endTurn();
  battle.endTurn();
  expect(card(battle, "north-ward").status).toBe("open");
  expect(card(battle, "north-guard").wounds).toBe(0);
});

test("healing accepts diagonals, caps to wounds and leaves armor spent unchanged", () => {
  const initial = createBattle({
    ...wounded(),
    cards: wounded().cards.map((card) =>
      card.id === "north-guard"
        ? { ...card, wounds: 1, armorSpent: 1 }
        : card.id === "north-ward"
          ? { ...card, location: { zone: "battlefield", cell: "D2" } }
          : card,
    ),
  });
  const battle = new BattleSession(initial);
  battle.command(heal);
  expect(battle.error).toBeNull();
  expect(card(battle, "north-guard").wounds).toBe(0);
  expect(card(battle, "north-guard").armorSpent).toBe(1);
  expect(battle.events).toContainEqual({
    type: "healed",
    card: "north-guard",
    source: "north-ward",
    amount: 1,
  });
  expect(initial.cards.find((card) => card.id === "north-guard")?.wounds).toBe(1);
});

test("healing rejects enemies, self, distant, full-life and dead targets and sources without the ability", () => {
  for (const target of ["south-guard", "north-ward", "north-fighter", "missing"]) {
    const initial = wounded();
    const battle = new BattleSession(initial);
    battle.command({ ...heal, target });
    expect(battle.error).not.toBeNull();
    expect(battle.state).toBe(initial);
    expect(battle.events).toEqual([]);
  }
  for (const initial of [
    abilityPosition,
    createBattle({
      ...wounded(),
      cards: wounded().cards.map((card) =>
        card.id === "north-guard" ? { ...card, location: { zone: "graveyard" } } : card,
      ),
    }),
  ]) {
    const battle = new BattleSession(initial);
    battle.command(heal);
    expect(battle.error).not.toBeNull();
    expect(battle.state).toBe(initial);
  }
  const ordinary = new BattleSession(wounded());
  ordinary.command({ ...heal, card: "north-fighter" });
  expect(ordinary.error).toBe("no heal ability");
});

test("healing rechecks its target and cancels before payment when it becomes ineligible", () => {
  const result = applyCommand(wounded(), heal);
  if (!result.ok) throw new Error(result.reason);
  let state: MatchState = {
    ...result.state,
    cards: result.state.cards.map((card) =>
      card.id === "north-guard" ? { ...card, wounds: 0 } : card,
    ),
  };
  const events = [];
  while (state.stack.length) {
    const next = applyCommand(state, { type: "pass", player: state.priorityPlayer! });
    if (!next.ok) throw new Error(next.reason);
    state = next.state;
    events.push(...next.events);
  }
  expect(events).toContainEqual({ type: "cancelled", action: 1 });
  expect(state.cards.find((card) => card.id === "north-ward")?.status).toBe("open");
  for (const phase of ["initial", "final"] as const)
    expect(applyCommand({ ...wounded(), phase }, heal).ok).toBe(false);
  expect(applyCommand({ ...wounded(), priorityPlayer: "south" }, heal).ok).toBe(false);
});
