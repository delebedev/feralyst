import { describe, expect, test } from "bun:test";
import assert from "node:assert/strict";
import { BattleHarness } from "./battle-harness";
import { demoPosition, playDemo } from "./battle-demo";
import { applyCommand, createBattle } from "./engine";
import type { CardInstance, MatchState } from "./model";

function duel(sourceLife = 10, targetLife = 10): MatchState {
  return createBattle({
    players: ["north", "south"],
    activePlayer: "north",
    definitions: [
      {
        id: "source",
        name: "Striker",
        movementAllowance: 2,
        lifeAllowance: sourceLife,
        simpleStrike: [3, 4, 5],
      },
      {
        id: "target",
        name: "Responder",
        movementAllowance: 2,
        lifeAllowance: targetLife,
        simpleStrike: [2, 3, 4],
      },
    ],
    cards: [
      {
        id: "source",
        definition: "source",
        owner: "north",
        controller: "north",
        location: { zone: "battlefield", cell: "B1" },
        status: "open",
        movementMarkers: 0,
        wounds: 0,
      },
      {
        id: "target",
        definition: "target",
        owner: "south",
        controller: "south",
        location: { zone: "battlefield", cell: "C1" },
        status: "open",
        movementMarkers: 0,
        wounds: 0,
      },
    ],
  });
}

function patchCard(state: MatchState, id: string, patch: Partial<CardInstance>): MatchState {
  return {
    ...state,
    cards: state.cards.map((card) => (card.id === id ? { ...card, ...patch } : card)),
  };
}

const strike = { type: "strike", player: "north", card: "source", target: "target" } as const;

describe("battle scenarios", () => {
  test("two open creatures exchange wounds, but only the initiator closes", () => {
    const initial = duel();
    const saved = JSON.stringify(initial);
    const battle = new BattleHarness(initial, [5, 1]);
    battle.command(strike).resolveStack();
    expect(battle.state.cards[0]).toMatchObject({ wounds: 2, status: "closed" });
    expect(battle.state.cards[1]).toMatchObject({ wounds: 5, status: "open" });
    expect(battle.state.actions).toEqual({});
    expect(battle.state.outcome).toBeNull();
    expect(JSON.stringify(initial)).toBe(saved);
    expect(
      battle.trace.flatMap((entry) => entry.events).filter((event) => event.type === "rolled"),
    ).toEqual([
      { type: "rolled", action: 1, card: "source", value: 5 },
      { type: "rolled", action: 1, card: "target", value: 1 },
    ]);
    battle.assertDiceConsumed();
  });

  test("a closed target does not roll or counterstrike", () => {
    const battle = new BattleHarness(patchCard(duel(), "target", { status: "closed" }), [6]);
    battle.command(strike).resolveStack();
    expect(battle.state.cards[0]).toMatchObject({ wounds: 0 });
    expect(battle.state.cards[1]).toMatchObject({ wounds: 5 });
    battle.assertDiceConsumed();
  });

  test("a double miss still pays for the initiating attack", () => {
    const battle = new BattleHarness(duel(), [1, 3]);
    battle.command(strike).resolveStack();
    expect(battle.state.cards[0]).toMatchObject({ wounds: 0, status: "closed" });
    expect(battle.state.cards[1]).toMatchObject({ wounds: 0, status: "open" });
    expect(battle.state.outcome).toBeNull();
    battle.assertDiceConsumed();
  });

  test("an open allied target cannot fight back", () => {
    const initial = patchCard(demoPosition, "ward", { controller: "north" });
    const battle = new BattleHarness(initial, [6]);
    battle
      .command({ type: "strike", player: "north", card: "fighter", target: "ward" })
      .resolveStack();
    expect(battle.state.cards[0]).toMatchObject({ wounds: 0 });
    expect(battle.state.cards[2]).toMatchObject({ location: { zone: "graveyard" } });
    expect(battle.state.cards[2]).toMatchObject({ controller: "south" });
    expect(battle.state.cards[2]).toMatchObject({ owner: "south" });
    expect(battle.state.outcome).toBeNull();
    battle.assertDiceConsumed();
  });

  test("lethal damage waits for destruction, and victory waits for the attack to finish", () => {
    const battle = new BattleHarness(duel(10, 2), [6, 1]);
    battle.command(strike);
    for (let stage = 0; stage < 7; stage++) battle.pass().pass();
    expect(battle.state.cards[1]).toMatchObject({ wounds: 5, location: { zone: "battlefield" } });
    expect(battle.state.pendingDestructions).toEqual(["target"]);
    expect(battle.state.outcome).toBeNull();
    battle.pass();
    const top = battle.state.stack[battle.state.stack.length - 1];
    assert(top);
    expect(battle.state.actions[top.action]).toMatchObject({ kind: "destruction" });
    expect(battle.state.priorityPlayer).toBe("north");
    for (let stage = 0; stage < 4; stage++) battle.pass().pass();
    expect(battle.state.cards[1]).toMatchObject({ location: { zone: "graveyard" } });
    expect(battle.state.outcome).toBeNull();
    battle.resolveStack();
    expect(battle.state.outcome).toEqual({ kind: "win", winner: "north" });
    expect(battle.state.priorityPlayer).toBeNull();
    expect(battle.state.actions).toEqual({});
    expect(battle.state.pendingDestructions).toEqual([]);
    expect(applyCommand(battle.state, { type: "pass", player: "north" })).toEqual({
      ok: false,
      reason: "battle-ended",
      state: battle.state,
    });
    battle.assertDiceConsumed();
  });

  test("a counterstrike can kill the initiating creature without closing the responder", () => {
    const battle = new BattleHarness(duel(1, 10), [1, 4]);
    battle.command(strike).resolveStack();
    expect(battle.state.outcome).toEqual({ kind: "win", winner: "south" });
    expect(battle.state.cards[0]).toMatchObject({ wounds: 2, location: { zone: "graveyard" } });
    expect(battle.state.cards[1]).toMatchObject({ wounds: 0, status: "open" });
    expect(battle.state.actions).toEqual({});
    battle.assertDiceConsumed();
  });

  test("mutual lethal damage declares active-player destruction first and resolves inactive-player destruction first", () => {
    const battle = new BattleHarness(duel(2, 2), [5, 1]);
    battle.command(strike).resolveStack();
    const events = battle.trace.flatMap((entry) => entry.events);
    const declared = events.filter(
      (event) => event.type === "declared" && event.action.kind === "destruction",
    );
    expect(declared.map((event) => (event.type === "declared" ? event.action.source : ""))).toEqual(
      ["source", "target"],
    );
    expect(events.filter((event) => event.type === "destroyed")).toEqual([
      { type: "destroyed", card: "target", owner: "south" },
      { type: "destroyed", card: "source", owner: "north" },
    ]);
    expect(battle.state.outcome).toEqual({ kind: "draw" });
    expect(battle.state.cards.every((card) => card.location.zone === "graveyard")).toBe(true);
    expect(battle.state.actions).toEqual({});
    battle.assertDiceConsumed();
  });

  test("defender redirection interrupts Target and defers closing until the strike's Payment", () => {
    const initial = {
      ...demoPosition,
      definitions: demoPosition.definitions.map((definition) =>
        definition.id === "guard" ? { ...definition, lifeAllowance: 10 } : definition,
      ),
    };
    const battle = new BattleHarness(initial, [4, 2]);
    battle.command({ type: "strike", player: "north", card: "fighter", target: "ward" });
    battle.pass().pass().pass();
    battle.command({ type: "defend", player: "south", card: "guard" });
    expect(battle.state.stack.slice(-2).map((object) => object.stage)).toEqual([
      "payment",
      "wound",
    ]);
    const attack = battle.state.actions[1];
    expect(attack).toMatchObject({ kind: "strike", target: "ward" });
    battle.pass().pass();
    expect(battle.state.actions[1]).toMatchObject({ target: "guard", closeOnPayment: ["fighter"] });
    expect(battle.state.cards[1]).toMatchObject({ status: "open" });
    battle.pass().pass();
    expect(battle.state.actions[1]).toMatchObject({ closeOnPayment: ["fighter", "guard"] });
    expect(battle.state.cards[1]).toMatchObject({ status: "open" });
    battle.pass();
    const redirected = battle.state;
    expect(applyCommand(redirected, { type: "defend", player: "south", card: "guard" })).toEqual({
      ok: false,
      reason: "already-redirected",
      state: redirected,
    });
    battle.pass();
    for (let stage = 0; stage < 5; stage++) battle.pass().pass();
    expect(battle.state.cards[1]).toMatchObject({ status: "open", wounds: 3 });
    expect(battle.state.cards[0]).toMatchObject({ status: "open" });
    expect(battle.state.cards[2]).toMatchObject({ wounds: 0 });
    battle.resolveStack();
    expect(battle.state.cards[0]).toMatchObject({ status: "closed" });
    expect(battle.state.cards[1]).toMatchObject({ status: "closed" });
    expect(battle.state.outcome).toBeNull();
    battle.assertDiceConsumed();
  });

  test("the complete demo is replayable from its commands and recorded dice", () => {
    const battle = playDemo();
    expect(battle.state.outcome).toEqual({ kind: "win", winner: "north" });
    expect(battle.state.cards[0]).toMatchObject({
      wounds: 3,
      movementMarkers: 0,
      status: "closed",
    });
    const events = battle.trace.flatMap((entry) => entry.events);
    expect(events.some((event) => event.type === "redirected")).toBe(true);
    expect(events.some((event) => event.type === "refreshed")).toBe(true);
    const dice = events.flatMap((event) => (event.type === "rolled" ? [event.value] : []));
    const replay = new BattleHarness(demoPosition, dice);
    for (const entry of battle.trace) replay.command(entry.command);
    expect(replay.state).toEqual(battle.state);
    expect(replay.trace).toEqual(battle.trace);
    replay.assertDiceConsumed();
  });

  test("a healed destruction target cancels its chain and gives priority to its controller", () => {
    const battle = new BattleHarness(duel(10, 2), [6, 1]);
    battle.command(strike);
    for (let stage = 0; stage < 7; stage++) battle.pass().pass();
    battle.pass();
    // A post-healing fixture checks 402.3.c without implementing a healing ability.
    const healed = patchCard(battle.state, "target", { wounds: 0 });
    const resumed = new BattleHarness(healed, []);
    resumed.pass().pass();
    expect(resumed.state.stack.map((object) => object.stage)).toEqual(["ending", "payment"]);
    expect(resumed.state.priorityPlayer).toBe("south");
    expect(resumed.state.cards[1]).toMatchObject({ location: { zone: "battlefield" } });
    resumed.resolveStack();
    expect(resumed.state.cards[0]).toMatchObject({ status: "closed" });
    expect(resumed.state.outcome).toBeNull();
  });
});

describe("scenario failures", () => {
  test("script exhaustion stops combat without changing the pending position", () => {
    const battle = new BattleHarness(duel(), [6]);
    battle.command(strike);
    for (let stage = 0; stage < 2; stage++) battle.pass().pass();
    battle.pass();
    const before = battle.state;
    expect(() => battle.pass()).toThrow("Scripted dice exhausted at roll 2");
    expect(battle.state).toBe(before);
  });

  test.each([0, 7, -1, 1.5, NaN, Infinity])("rejects invalid die value %s", (value) => {
    const battle = new BattleHarness(duel(), [value]);
    battle.command(strike).pass().pass().pass().pass().pass();
    const before = battle.state;
    expect(() => battle.pass()).toThrow("Invalid die result");
    expect(battle.state).toBe(before);
  });

  test("unused dice expose a mistaken scenario script", () => {
    const battle = new BattleHarness(duel(), [1]);
    expect(() => battle.assertDiceConsumed()).toThrow("Unused scripted dice: 1");
  });

  test("the harness detects action records disconnected from the stack", () => {
    const initial = duel();
    expect(
      () =>
        new BattleHarness(
          {
            ...initial,
            actions: {
              1: {
                id: 1,
                kind: "movement",
                source: "source",
                target: "B2",
                controller: "north",
                effectsProduced: false,
              },
            },
          },
          [],
        ),
    ).toThrow("Orphan action: 1");
  });
});
