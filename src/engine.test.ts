import { describe, expect, test } from "bun:test";
import { applyCommand, createBattle } from "./engine";
import type { Command, CardInstance, MatchState, MoveCommand, Rejection } from "./model";

function freeze<T>(value: T): T {
  if (value !== null && typeof value === "object") {
    Object.freeze(value);
    for (const child of Object.values(value)) freeze(child);
  }
  return value;
}

function position(): MatchState {
  return freeze(createBattle({
    players: ["north", "south"],
    definitions: [{ id: "walker", name: "Walker", movementAllowance: 2, lifeAllowance: 4, simpleStrike: [1, 2, 3] }],
    cards: [
      {
        id: "north-1", definition: "walker", owner: "north", controller: "north",
        location: { zone: "battlefield", cell: "B2" }, status: "open", movementMarkers: 0, wounds: 0,
      },
      {
        id: "north-2", definition: "walker", owner: "north", controller: "north",
        location: { zone: "battlefield", cell: "D2" }, status: "open", movementMarkers: 0, wounds: 0,
      },
      {
        id: "south-1", definition: "walker", owner: "south", controller: "south",
        location: { zone: "battlefield", cell: "C3" }, status: "open", movementMarkers: 0, wounds: 0,
      },
    ],
    activePlayer: "north",
  }));
}

const command: MoveCommand = { type: "move", player: "north", card: "north-1", to: "C2" };

function changeCard(state: MatchState, patch: Partial<CardInstance>): MatchState {
  return freeze({
    ...state,
    cards: state.cards.map((card) => card.id === "north-1" ? { ...card, ...patch } : card),
  });
}

function accepted(state: MatchState, request: Command = command): MatchState {
  const result = applyCommand(state, request);
  if (!result.ok) throw new Error(`Unexpected rejection: ${result.reason}`);
  return freeze(result.state);
}

function passOnce(state: MatchState): MatchState {
  if (state.priorityPlayer === null) throw new Error("Missing priority player");
  return accepted(state, { type: "pass", player: state.priorityPlayer });
}

function passPair(state: MatchState): MatchState {
  return passOnce(passOnce(state));
}

function completedMove(state: MatchState, request = command): MatchState {
  let next = accepted(state, request);
  for (let object = 0; object < 6; object++) next = passPair(next);
  expect(next.stack).toEqual([]);
  return next;
}

describe("ordinary movement", () => {
  test("moves one copy, spends a marker, stays open and preserves its input", () => {
    const before = position();
    const after = completedMove(before);
    expect(after).toEqual({ ...changeCard(before, { location: { zone: "battlefield", cell: "C2" }, movementMarkers: 1 }), nextActionId: 2 });
    expect(before).toEqual(position());
    expect(after.cards[1]).toBe(before.cards[1]);
    expect(after.cards[2]).toBe(before.cards[2]);
    expect(after.definitions).toBe(before.definitions);
  });

  test("spends the allowance over successive moves and rejects a third", () => {
    const first = completedMove(position());
    const second = completedMove(first, { ...command, to: "C1" });
    expect(second.cards[0].movementMarkers).toBe(2);
    expect(applyCommand(second, { ...command, to: "B1" })).toEqual({ ok: false, reason: "movement-exhausted", state: second });
  });

  test("uses control rather than ownership to permit movement", () => {
    const state = changeCard(position(), { owner: "south" });
    expect(completedMove(state).cards[0].owner).toBe("south");
  });

  test.each(["A2", "C2", "B1", "B3"])("moves from B2 to orthogonal neighbor %s", (to) => {
    expect(completedMove(position(), { ...command, to }).cards[0].location).toEqual({ zone: "battlefield", cell: to });
  });

  test.each(["north", "south"])("%s can cross the centre line on its turn", (player) => {
    const before = changeCard(position(), { controller: player, location: { zone: "battlefield", cell: "B1" } });
    const state = freeze({ ...before, activePlayer: player, priorityPlayer: player });
    expect(completedMove(state, { ...command, player, to: "B1′" }).cards[0].location).toEqual({ zone: "battlefield", cell: "B1′" });
  });

  const invalid: {
    name: string;
    reason: Rejection;
    state?: Partial<MatchState>;
    card?: Partial<CardInstance>;
    request?: Partial<MoveCommand>;
  }[] = [
    { name: "unknown player", reason: "unknown-player", request: { player: "outsider" } },
    { name: "unknown card", reason: "unknown-card", request: { card: "missing" } },
    { name: "another player's card", reason: "not-controller", request: { card: "south-1" } },
    { name: "opponent's turn", reason: "not-active-player", state: { activePlayer: "south" } },
    { name: "initial phase", reason: "not-main-phase", state: { phase: "initial" } },
    { name: "preliminary phase", reason: "not-main-phase", state: { phase: "preliminary" } },
    { name: "final phase", reason: "not-main-phase", state: { phase: "final" } },
    { name: "opponent has priority", reason: "no-priority", state: { priorityPlayer: "south" } },
    { name: "neither player has priority", reason: "no-priority", state: { priorityPlayer: null } },
    { name: "nonempty stack", reason: "stack-not-empty", state: { stack: [{ stage: "payment", action: 0 }], actions: { 0: { id: 0, kind: "movement", source: "north-1", target: "C2", controller: "north", effectsProduced: false } } } },
    { name: "card in graveyard", reason: "not-on-battlefield", card: { location: { zone: "graveyard" } } },
    { name: "closed card", reason: "card-closed", card: { status: "closed" } },
    { name: "spent allowance", reason: "movement-exhausted", card: { movementMarkers: 2 } },
    { name: "diagonal", reason: "not-orthogonal-neighbor", request: { to: "C1" } },
    { name: "two cells away", reason: "not-orthogonal-neighbor", request: { to: "B1′" } },
    { name: "same cell", reason: "not-orthogonal-neighbor", request: { to: "B2" } },
    { name: "occupied by ally", reason: "cell-occupied", card: { location: { zone: "battlefield", cell: "C2" } }, request: { to: "D2" } },
    { name: "occupied by opponent", reason: "cell-occupied", card: { location: { zone: "battlefield", cell: "C2" } }, request: { to: "C3" } },
  ];

  test.each(invalid)("rejects $name without payment or changes", ({ reason, state, card, request }) => {
    const before = freeze({ ...changeCard(position(), card ?? {}), ...state });
    const saved = JSON.stringify(before);
    const result = applyCommand(before, { ...command, ...request });
    expect(result).toEqual({ ok: false, reason, state: before });
    expect(result.state).toBe(before);
    expect(JSON.stringify(before)).toBe(saved);
  });

  test.each(["", "F2", "A0", "A4", "A4′", "B2′′", "B1'", "B2 "])("rejects invalid cell %j unchanged", (to) => {
    const before = position();
    expect(applyCommand(before, { ...command, to })).toEqual({ ok: false, reason: "invalid-cell", state: before });
  });

  test("reports a broken definition reference as an invalid model", () => {
    expect(() => applyCommand(changeCard(position(), { definition: "missing" }), command)).toThrow("Missing card definition: missing");
  });
});

describe("movement declaration and passing", () => {
  test("records a chain without moving or paying at declaration", () => {
    const before = position();
    const declared = accepted(before);
    expect(declared.cards).toBe(before.cards);
    expect(declared.stack.map((object) => object.stage)).toEqual([
      "ending", "payment", "wound", "protection", "target", "declaration",
    ]);
    for (const object of declared.stack) {
      expect(declared.actions[object.action]).toMatchObject({ kind: "movement", source: "north-1", target: "C2", controller: "north" });
    }
    expect(declared.priorityPlayer).toBe("north");
    expect(declared.consecutivePasses).toBe(0);
    expect(before).toEqual(position());
  });

  test("each pair of passes resolves exactly one object, then restores active-player priority", () => {
    let state = accepted(position());
    const stages = [
      { stage: "declaration", cell: "B2", markers: 0 },
      { stage: "target", cell: "B2", markers: 0 },
      { stage: "protection", cell: "B2", markers: 0 },
      { stage: "wound", cell: "C2", markers: 0 },
      { stage: "payment", cell: "C2", markers: 1 },
      { stage: "ending", cell: "C2", markers: 1 },
    ] as const;
    for (const expected of stages) {
      expect(state.stack[state.stack.length - 1].stage).toBe(expected.stage);
      const firstPass = passOnce(state);
      expect(firstPass.priorityPlayer).toBe("south");
      expect(firstPass.consecutivePasses).toBe(1);
      expect(firstPass.stack).toBe(state.stack);
      expect(firstPass.cards).toBe(state.cards);
      const resolved = passOnce(firstPass);
      expect(resolved.priorityPlayer).toBe("north");
      expect(resolved.consecutivePasses).toBe(0);
      expect(resolved.stack.length).toBe(state.stack.length - 1);
      expect(resolved.cards[0].location).toEqual({ zone: "battlefield", cell: expected.cell });
      expect(resolved.cards[0].movementMarkers).toBe(expected.markers);
      expect(resolved.cards[0].status).toBe("open");
      expect(resolved.phase).toBe("main");
      state = resolved;
    }
    expect(state.stack).toEqual([]);
    expect(passPair(state).phase).toBe("final");
  });

  test("a blocked chain's remaining Payment object spends a marker without relocation", () => {
    const declared = accepted(position());
    // Blocking retains only Payment (410.1); no blocking ability is in this slice.
    const blocked = freeze({ ...declared, stack: declared.stack.filter((object) => object.stage === "payment") });
    const paid = passPair(blocked);
    expect(paid.stack).toEqual([]);
    expect(paid.cards[0].location).toEqual({ zone: "battlefield", cell: "B2" });
    expect(paid.cards[0].movementMarkers).toBe(1);
    expect(paid.cards[0].status).toBe("open");
    expect(blocked.cards[0].movementMarkers).toBe(0);
    expect(paid.phase).toBe("main");
  });

  test("rejects an out-of-priority or repeated pass unchanged", () => {
    const declared = accepted(position());
    expect(applyCommand(declared, { type: "pass", player: "south" })).toEqual({
      ok: false, reason: "no-priority", state: declared,
    });
    const firstPass = passOnce(declared);
    expect(applyCommand(firstPass, { type: "pass", player: "north" })).toEqual({
      ok: false, reason: "no-priority", state: firstPass,
    });
  });

  test("an unknown player cannot pass", () => {
    const before = position();
    expect(applyCommand(before, { type: "pass", player: "outsider" })).toEqual({
      ok: false, reason: "unknown-player", state: before,
    });
  });

  test("passing with no priority holder changes nothing", () => {
    const before = freeze({ ...position(), priorityPlayer: null });
    expect(applyCommand(before, { type: "pass", player: "north" })).toEqual({
      ok: false, reason: "no-priority", state: before,
    });
  });

  test("does not apply battle-phase passing to preliminary setup", () => {
    const before = freeze({ ...position(), phase: "preliminary" as const });
    expect(applyCommand(before, { type: "pass", player: "north" })).toEqual({
      ok: false, reason: "preliminary-phase-unsupported", state: before,
    });
  });

  test("resolving the last object restores the active player even when the inactive player passed first", () => {
    const declared = accepted(position());
    const pending = freeze({
      ...declared, priorityPlayer: "south",
      stack: declared.stack.filter((object) => object.stage === "payment"),
    });
    const firstPass = passOnce(pending);
    expect(firstPass.priorityPlayer).toBe("north");
    const paid = passOnce(firstPass);
    expect(paid.stack).toEqual([]);
    expect(paid.priorityPlayer).toBe("north");
  });

  test("resets the pass sequence when the active player declares movement", () => {
    const inactivePriority = freeze({ ...position(), priorityPlayer: "south" });
    const passed = passOnce(inactivePriority);
    expect(passed.consecutivePasses).toBe(1);
    const declared = accepted(passed);
    expect(declared.consecutivePasses).toBe(0);
    expect(passOnce(declared).stack).toBe(declared.stack);
  });
});

describe("ability-free turn phases", () => {
  test("empty-stack passing moves through Final and Initial, opening the next player's cards", () => {
    const before = changeCard(position(), { status: "closed", movementMarkers: 2 });
    const state = freeze({
      ...before,
      cards: before.cards.map((card) => card.id === "north-2"
        ? { ...card, controller: "south", status: "closed" as const, movementMarkers: 2 }
        : card),
    });
    const firstPass = passOnce(state);
    expect(firstPass.phase).toBe("main");
    const final = passOnce(firstPass);
    expect(final.phase).toBe("final");
    expect(final.activePlayer).toBe("north");
    expect(final.priorityPlayer).toBe("north");
    const initial = passPair(final);
    expect(initial.phase).toBe("initial");
    expect(initial.activePlayer).toBe("south");
    expect(initial.priorityPlayer).toBe("south");
    expect(initial.cards[1]).toMatchObject({ owner: "north", controller: "south", status: "open", movementMarkers: 0 });
    expect(initial.cards[0]).toBe(state.cards[0]);
    const main = passPair(initial);
    expect(main.phase).toBe("main");
    expect(main.activePlayer).toBe("south");
    const moved = completedMove(main, { type: "move", player: "south", card: "north-2", to: "E2" });
    expect(moved.cards[1].location).toEqual({ zone: "battlefield", cell: "E2" });
    expect(moved.cards[1].movementMarkers).toBe(1);
    const northInitial = passPair(passPair(moved));
    expect(northInitial.phase).toBe("initial");
    expect(northInitial.activePlayer).toBe("north");
    expect(northInitial.priorityPlayer).toBe("north");
    expect(northInitial.cards[0]).toMatchObject({ status: "open", movementMarkers: 0 });
    expect(northInitial.cards[1].movementMarkers).toBe(1);
  });
});

describe("strike requests", () => {
  const strike = { type: "strike", player: "north", card: "north-1", target: "south-1" } as const;
  test.each([
    { target: "missing", reason: "unknown-target" },
    { target: "north-1", reason: "not-adjacent" },
  ] as const)("rejects target $target unchanged", ({ target, reason }) => {
    const before = position();
    expect(applyCommand(before, { ...strike, target })).toEqual({ ok: false, reason, state: before });
  });

  test("rejects a target that is outside the battlefield", () => {
    const before = freeze({ ...position(), cards: position().cards.map((card) => card.id === "south-1"
      ? { ...card, location: { zone: "graveyard" as const } } : card) });
    expect(applyCommand(before, strike)).toEqual({ ok: false, reason: "target-not-on-battlefield", state: before });
  });

  test("rejects a target more than one cell away", () => {
    const before = changeCard(position(), { location: { zone: "battlefield", cell: "A1" } });
    expect(applyCommand(before, strike)).toEqual({ ok: false, reason: "not-adjacent", state: before });
  });

  test("diagonally neighboring creatures can fight", () => {
    const before = position();
    const result = applyCommand(before, strike);
    expect(result.ok).toBe(true);
    expect(result.state.cards).toBe(before.cards);
    expect(result.state.stack.length).toBe(9);
  });

  test("combat resolution requires an explicit dice source", () => {
    let pending = accepted(position(), strike);
    pending = passPair(passPair(pending));
    pending = passOnce(pending);
    expect(() => passOnce(pending)).toThrow("A dice source is required");
  });
});

describe("defender requests", () => {
  function window(patch: Partial<CardInstance> = {}): MatchState {
    const before = changeCard(position(), patch);
    let state = accepted(before, { type: "strike", player: "north", card: "north-2", target: "south-1" });
    state = passPair(state);
    return passOnce(state);
  }

  test("defending is restricted to the inactive player", () => {
    const before = window();
    const activePriority = freeze({ ...before, priorityPlayer: "north" });
    expect(applyCommand(activePriority, { type: "defend", player: "north", card: "north-1" })).toEqual({
      ok: false, reason: "not-inactive-player", state: activePriority,
    });
  });

  test("a creature cannot defend itself", () => {
    const before = window();
    expect(applyCommand(before, { type: "defend", player: "south", card: "south-1" })).toEqual({
      ok: false, reason: "defender-not-adjacent", state: before,
    });
  });

  test("defenders cannot respond before Target is on top", () => {
    const before = passOnce(accepted(position(), {
      type: "strike", player: "north", card: "north-2", target: "south-1",
    }));
    expect(applyCommand(before, { type: "defend", player: "south", card: "south-1" })).toEqual({
      ok: false, reason: "no-defender-window", state: before,
    });
  });
});

describe("battle construction", () => {
  test("validates identity, ownership, markers, definitions and occupancy", () => {
    const before = position();
    const input = { players: before.players, definitions: before.definitions, cards: before.cards, activePlayer: before.activePlayer };
    expect(() => createBattle({ ...input, players: ["north", "north"] })).toThrow("Invalid battle players");
    expect(() => createBattle({ ...input, activePlayer: "outsider" })).toThrow("Invalid battle players");
    expect(() => createBattle({ ...input, cards: [...input.cards, input.cards[0]] })).toThrow("Duplicate card:");
    expect(() => createBattle({ ...input, definitions: [...input.definitions, input.definitions[0]] })).toThrow("Duplicate card definition");
    expect(() => createBattle({ ...input, cards: changeCard(before, { definition: "missing" }).cards })).toThrow("Missing card definition:");
    expect(() => createBattle({ ...input, cards: changeCard(before, { owner: "outsider" }).cards })).toThrow("Invalid card player:");
    expect(() => createBattle({ ...input, cards: changeCard(before, { movementMarkers: -1 }).cards })).toThrow("Invalid card markers:");
    expect(() => createBattle({ ...input, cards: changeCard(before, { location: { zone: "battlefield", cell: "D2" } }).cards })).toThrow("Invalid occupied cell:");
    expect(() => createBattle({ ...input, cards: changeCard(before, { wounds: 4 }).cards })).toThrow("Deployed creature has no life:");
    expect(() => createBattle({ ...input, definitions: [{ ...input.definitions[0], lifeAllowance: 0 }] })).toThrow("Invalid card definition:");
    expect(() => createBattle({ ...input, definitions: [{ ...input.definitions[0], simpleStrike: [1, -1, 3] }] })).toThrow("Invalid card definition:");
  });

  test("checks defeat or a draw in an already empty squad", () => {
    const before = position();
    const input = { players: before.players, definitions: before.definitions, activePlayer: before.activePlayer };
    expect(createBattle({ ...input, cards: before.cards.filter((card) => card.controller === "north") }).outcome)
      .toEqual({ kind: "win", winner: "north" });
    expect(createBattle({ ...input, cards: [] }).outcome).toEqual({ kind: "draw" });
  });
});
