import { expect, test } from "bun:test";
import { abilityPosition } from "../battle/positions";
import { BattleSession, legalCommands } from "../battle/battle-session";
import { applyCommand, createBattle } from "./engine";
import { chooseAction } from "../battle/opponent";
import type { MatchState } from "./model";

const card = (state: MatchState, id: string) => state.cards.find((card) => card.id === id)!;
const strike = (source: string, target: string) => ({
  type: "strike" as const,
  player: "north",
  card: source,
  target,
});
function onlyFlyers(): MatchState {
  return createBattle({
    ...abilityPosition,
    cards: abilityPosition.cards.filter((card) =>
      ["north-fighter", "south-gryphon"].includes(card.id),
    ),
  });
}

test("revealed flyers leave their deployment cells, have no movement and keep the squad alive", () => {
  const state = createBattle({
    ...onlyFlyers(),
    cards: onlyFlyers().cards.map((card) =>
      card.id === "south-gryphon"
        ? { ...card, location: { zone: "battlefield", cell: "B1" } }
        : card,
    ),
  });
  expect(card(state, "south-gryphon").location).toEqual({ zone: "additional" });
  expect(state.outcome).toBeNull();
  const south = createBattle({ ...state, activePlayer: "south" });
  expect(
    applyCommand(south, { type: "move", player: "south", card: "south-gryphon", to: "C1" }),
  ).toMatchObject({ ok: false, reason: "flying-no-movement" });
  expect(() =>
    createBattle({
      ...state,
      definitions: state.definitions.map((def) =>
        def.flight ? { ...def, movementAllowance: 1 } : def,
      ),
    }),
  ).toThrow("Flying creature has movement");
});

test("flyers strike distant ground and air targets, while unprepared ground cannot strike air", () => {
  for (const target of ["south-gryphon", "south-guard", "south-archer"])
    expect(applyCommand(abilityPosition, strike("north-gryphon", target)).ok).toBe(true);
  expect(applyCommand(abilityPosition, strike("north-fighter", "south-gryphon"))).toMatchObject({
    ok: false,
    reason: "cannot-strike-flyer",
  });
  const distant = createBattle({
    ...abilityPosition,
    cards: abilityPosition.cards.map((card) =>
      card.id === "south-archer"
        ? { ...card, location: { zone: "battlefield", cell: "A3′" } }
        : card,
    ),
  });
  expect(applyCommand(distant, strike("north-gryphon", "south-archer")).ok).toBe(true);
});

test("Range does not block shots into the air zone, but healing never treats flyers as adjacent", () => {
  const state = createBattle({
    ...abilityPosition,
    cards: abilityPosition.cards.map((card) =>
      card.id === "north-gryphon"
        ? { ...card, wounds: 2 }
        : card.id === "north-archer"
          ? { ...card, location: { zone: "battlefield", cell: "A3" } }
          : card,
    ),
  });
  const battle = new BattleSession(state, () => 4);
  battle.command({ type: "shot", player: "north", card: "north-archer", target: "south-gryphon" });
  expect(battle.error).toBeNull();
  expect(battle.defenders).toEqual([]);
  expect(card(battle.state, "south-gryphon").wounds).toBe(2);
  expect(battle.events.filter((event) => event.type === "rolled")).toHaveLength(1);
  expect(
    applyCommand(state, {
      type: "heal",
      player: "north",
      card: "north-ward",
      target: "north-gryphon",
    }),
  ).toMatchObject({ ok: false, reason: "invalid-heal-target" });
});

test.each([
  ["north-gryphon", "south-guard", ["south-fighter", "south-ward", "south-gryphon"]],
  ["north-fighter", "south-guard", ["south-fighter"]],
  ["north-gryphon", "south-gryphon", []],
] as const)("defender candidates for %s attacking %s follow 211.6", (source, target, expected) => {
  const battle = new BattleSession(abilityPosition, () => 4);
  battle.command(strike(source, target));
  expect(battle.error).toBeNull();
  expect(battle.defenders.sort()).toEqual([...expected].sort());
});

test("a flyer defends another flyer against a prepared ground strike and redirects the full exchange", () => {
  const state = createBattle({
    ...abilityPosition,
    cards: abilityPosition.cards
      .filter((card) => card.id === "north-fighter" || card.definition === "gryphon")
      .map((card) => (card.id === "north-fighter" ? { ...card, flightStrike: "ready" } : card)),
  });
  const extra = { ...card(state, "south-gryphon"), id: "south-second-gryphon" };
  const battle = new BattleSession(
    createBattle({ ...state, cards: [...state.cards, extra] }),
    () => 4,
  );
  battle.command(strike("north-fighter", "south-gryphon"));
  expect(battle.defenders).toEqual(["south-second-gryphon"]);
  battle.command({ type: "defend", player: "south", card: "south-second-gryphon" });
  expect(battle.error).toBeNull();
  expect(card(battle.state, "south-gryphon").wounds).toBe(0);
  expect(card(battle.state, "south-second-gryphon").wounds).toBeGreaterThan(0);
  expect(card(battle.state, "north-fighter").flightStrike).toBeUndefined();
});

test("ground adjacent only to the target can defend a distant flying attacker and pay by closing", () => {
  const battle = new BattleSession(abilityPosition, () => 4);
  battle.command(strike("north-gryphon", "south-guard"));
  battle.command({ type: "defend", player: "south", card: "south-fighter" });
  expect(battle.error).toBeNull();
  expect(card(battle.state, "south-guard").wounds).toBe(0);
  expect(card(battle.state, "south-fighter").status).toBe("closed");
  expect(card(battle.state, "north-gryphon").status).toBe("closed");
});

test("preparation is available only against an all-flyer squad, closes now, and buys one next-turn strike", () => {
  expect(
    applyCommand(abilityPosition, {
      type: "prepare-flight",
      player: "north",
      card: "north-fighter",
    }),
  ).toMatchObject({ ok: false, reason: "cannot-prepare-flight" });
  expect(
    applyCommand(abilityPosition, {
      type: "prepare-flight",
      player: "north",
      card: "north-gryphon",
    }),
  ).toMatchObject({ ok: false, reason: "cannot-prepare-flight" });
  const battle = new BattleSession(onlyFlyers(), () => 4);
  expect(chooseAction(battle.state, battle.decisions)?.type).toBe("prepare-flight");
  battle.command({ type: "prepare-flight", player: "north", card: "north-fighter" });
  expect(card(battle.state, "north-fighter")).toMatchObject({
    status: "closed",
    flightStrike: "pending",
  });
  battle.endTurn();
  expect(card(battle.state, "north-fighter").flightStrike).toBe("pending");
  battle.endTurn();
  expect(card(battle.state, "north-fighter")).toMatchObject({
    status: "open",
    flightStrike: "ready",
  });
  expect(legalCommands(battle.state, "north-fighter")).toContainEqual(
    strike("north-fighter", "south-gryphon"),
  );
  battle.command(strike("north-fighter", "south-gryphon"));
  expect(battle.error).toBeNull();
  expect(card(battle.state, "north-fighter").flightStrike).toBeUndefined();
  expect(card(battle.state, "south-gryphon").wounds).toBeGreaterThan(0);
});

test("an unused prepared strike expires after its next own turn", () => {
  const battle = new BattleSession(onlyFlyers());
  battle.command({ type: "prepare-flight", player: "north", card: "north-fighter" });
  for (let turn = 0; turn < 4; turn++) battle.endTurn();
  expect(card(battle.state, "north-fighter").flightStrike).toBeUndefined();
  expect(applyCommand(battle.state, strike("north-fighter", "south-gryphon"))).toMatchObject({
    ok: false,
    reason: "cannot-strike-flyer",
  });
});

test("killing the last ground creature leaves the opposing flyer alive and the battle unfinished", () => {
  const state = createBattle({
    ...abilityPosition,
    cards: abilityPosition.cards
      .filter((card) => ["north-gryphon", "south-gryphon", "south-ward"].includes(card.id))
      .map((card) => (card.id === "south-ward" ? { ...card, wounds: 1, status: "closed" } : card)),
  });
  const battle = new BattleSession(state, () => 6);
  battle.command(strike("north-gryphon", "south-ward"));
  if (battle.defenders.length) battle.takeAttack();
  expect(card(battle.state, "south-ward").location.zone).toBe("graveyard");
  expect(battle.state.outcome).toBeNull();
});
