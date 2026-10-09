import { expect, test } from "bun:test";
import { BattleSession, legalCommands, skirmishPosition } from "./battle-session";
import { demoPosition } from "./battle-demo";

function attack(): BattleSession {
  const battle = new BattleSession(skirmishPosition, () => 4);
  battle.command({
    type: "strike",
    player: "north",
    card: "north-fighter",
    target: "south-fighter",
  });
  return battle;
}

test("movement resolves, invalid commands preserve state, and turns refresh", () => {
  const battle = new BattleSession();
  battle.command({ type: "move", player: "north", card: "north-fighter", to: "B2" });
  expect(battle.state.cards[0]?.location).toEqual({ zone: "battlefield", cell: "B2" });
  expect(battle.state.stack).toHaveLength(0);
  const state = battle.state;
  battle.command({ type: "move", player: "north", card: "north-fighter", to: "E3" });
  expect(battle.state).toBe(state);
  expect(battle.error).toBe("not orthogonal neighbor");
  battle.endTurn();
  expect(battle.state.activePlayer).toBe("south");
  expect(battle.state.phase).toBe("main");
  battle.endTurn();
  expect(battle.state.cards[0]?.movementMarkers).toBe(0);
  battle.restart();
  expect(battle.state).toBe(skirmishPosition);
  expect(battle.events).toEqual([]);
  expect(battle.error).toBeNull();
});

test("attack pauses before rolls and defender assignment resolves without another pause", () => {
  const battle = attack();
  expect(battle.defenders).toContain("south-guard");
  expect(battle.events.some((event) => event.type === "rolled")).toBe(false);
  const state = battle.state;
  battle.endTurn();
  expect(battle.state).toBe(state);
  battle.command({ type: "defend", player: "south", card: "south-guard" });
  expect(battle.state.stack).toHaveLength(0);
  expect(battle.defenders).toEqual([]);
  expect(battle.events).toContainEqual({
    type: "redirected",
    attack: 1,
    from: "south-fighter",
    to: "south-guard",
  });
  expect(battle.state.cards.find((card) => card.id === "south-fighter")?.wounds).toBe(0);
});

test("taking the attack preserves the original target and closes the attacker", () => {
  const battle = attack();
  battle.takeAttack();
  expect(battle.state.stack).toHaveLength(0);
  expect(battle.state.cards.find((card) => card.id === "south-fighter")?.wounds).toBeGreaterThan(0);
  expect(battle.state.cards.find((card) => card.id === "north-fighter")?.status).toBe("closed");
  expect(legalCommands(battle.state, "north-fighter")).toEqual([]);
});

test("scripted battle reaches a winner through the UI adapter and restarts", () => {
  const dice = [4, 2, 6, 6];
  const battle = new BattleSession(demoPosition, () => {
    const die = dice.shift();
    if (die === undefined) throw new Error("Unexpected roll");
    return die;
  });
  battle.command({ type: "move", player: "north", card: "fighter", to: "B1" });
  battle.command({ type: "strike", player: "north", card: "fighter", target: "ward" });
  battle.command({ type: "defend", player: "south", card: "guard" });
  battle.endTurn();
  battle.command({ type: "strike", player: "south", card: "ward", target: "fighter" });
  battle.endTurn();
  battle.command({ type: "strike", player: "north", card: "fighter", target: "ward" });
  expect(battle.state.outcome).toEqual({ kind: "win", winner: "north" });
  expect(dice).toEqual([]);
  const final = battle.state;
  battle.command({ type: "move", player: "north", card: "fighter", to: "A1" });
  expect(battle.state).toBe(final);
  expect(battle.error).toBe("battle ended");
  battle.restart();
  expect(battle.state).toBe(demoPosition);
});

test("UI targets opponents while friendly creatures remain inspectable", () => {
  const commands = legalCommands(skirmishPosition, "north-fighter");
  expect(
    commands.some((command) => command.type === "strike" && command.target === "south-fighter"),
  ).toBe(true);
  expect(
    commands.some((command) => command.type === "strike" && command.target.startsWith("north-")),
  ).toBe(false);
});
