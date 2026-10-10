import { expect, test } from "bun:test";
import { abilityPosition, skirmishPosition } from "./positions";
import { BattleSession } from "./battle-session";
import { combatSteps, CombatPlayback, type CombatStep } from "./combat-playback";
import { createBattle } from "../rules/engine";

function strike(battle: BattleSession): void {
  battle.command({
    type: "strike",
    player: "north",
    card: "north-fighter",
    target: "south-fighter",
  });
}

test("defender choice precedes combat and redirects both attack and counterattack", () => {
  const battle = new BattleSession(skirmishPosition, () => 4);
  strike(battle);
  expect(combatSteps(battle.events, battle.events)).toEqual([]);
  const cursor = battle.events.length;
  battle.command({ type: "defend", player: "south", card: "south-guard" });
  const steps = combatSteps(battle.events, battle.events.slice(cursor));
  expect(steps[0]).toEqual({
    animation: "attack",
    actors: [
      { card: "north-fighter", target: "south-guard" },
      { card: "south-guard", target: "north-fighter" },
    ],
  });
  expect(steps.map((step) => step.animation)).toEqual(["attack", "result", "hit"]);
  expect(steps[2]?.actors.some((actor) => actor.card === "south-fighter")).toBe(false);
  expect(steps[1]?.actors.every((actor) => actor.roll === 4)).toBe(true);
});

test("mutual lethal combat plays attacks, hits, then deaths", () => {
  let roll = 0;
  const battle = new BattleSession(
    createBattle({
      ...skirmishPosition,
      cards: skirmishPosition.cards
        .filter((card) => card.definition === "fighter")
        .map((card) => ({ ...card, wounds: 4 })),
    }),
    () => (++roll % 2 ? 6 : 4),
  );
  strike(battle);
  expect(battle.state.outcome).toEqual({ kind: "draw" });
  const steps = combatSteps(battle.events, battle.events);
  expect(steps.map((step) => step.animation)).toEqual(["attack", "result", "hit", "death"]);
  expect(steps[3]?.actors).toHaveLength(2);
});

test("dice precede wounds, HP updates at hit, and log waits for completion", async () => {
  const battle = new BattleSession(skirmishPosition, () => 4);
  const seen: CombatStep[] = [];
  let release: (() => void) | undefined;
  const playback = new CombatPlayback(
    battle,
    (step) => {
      seen.push(step);
      return new Promise<void>((resolve) => {
        release = resolve;
      });
    },
    () => {},
  );
  strike(battle);
  await playback.update();
  const before = playback.state;
  const eventCount = playback.eventCount;
  expect(playback.busy).toBe(false);
  expect(playback.exchange).toEqual({ source: "north-fighter", target: "south-fighter" });
  battle.takeAttack();
  const running = playback.update();
  expect(playback.busy).toBe(true);
  expect(playback.state).toBe(before);
  expect(playback.eventCount).toBe(eventCount);
  expect(seen[0]?.animation).toBe("attack");
  release!();
  await Promise.resolve();
  expect(seen[1]?.animation).toBe("result");
  expect(playback.state).toBe(before);
  release!();
  await Promise.resolve();
  expect(seen[2]?.animation).toBe("hit");
  expect(playback.state.cards.find((card) => card.id === "south-fighter")?.wounds).toBeGreaterThan(
    0,
  );
  expect(before.cards.find((card) => card.id === "south-fighter")?.wounds).toBe(0);
  expect(playback.state.cards.every((card) => card.location.zone === "battlefield")).toBe(true);
  expect(playback.eventCount).toBe(eventCount);
  release!();
  await running;
  expect(playback.busy).toBe(false);
  expect(playback.state).toBe(battle.state);
  expect(playback.eventCount).toBe(battle.events.length);
});

test("restart cancels the old sequence without advancing it or replacing the new view", async () => {
  const battle = new BattleSession(skirmishPosition, () => 4);
  let release: (() => void) | undefined;
  let steps = 0;
  const playback = new CombatPlayback(
    battle,
    () => {
      steps++;
      return new Promise<void>((resolve) => {
        release = resolve;
      });
    },
    () => {},
  );
  strike(battle);
  await playback.update();
  battle.takeAttack();
  const running = playback.update();
  battle.restart();
  playback.reset();
  release!();
  await running;
  expect(steps).toBe(1);
  expect(playback.busy).toBe(false);
  expect(playback.state).toBe(skirmishPosition);
  expect(playback.eventCount).toBe(0);
  expect(playback.exchange).toBeNull();
  expect(playback.step).toBeNull();
});

test("mutual misses still reveal dice and results without wounds or death", () => {
  let roll = 0;
  const battle = new BattleSession(skirmishPosition, () => (++roll % 2 ? 2 : 4));
  strike(battle);
  battle.takeAttack();
  const steps = combatSteps(battle.events, battle.events);
  expect(steps.map((step) => step.animation)).toEqual(["attack", "result", "hit"]);
  expect(steps[2]?.actors).toEqual([
    { card: "south-fighter", amount: 0 },
    { card: "north-fighter", amount: 0 },
  ]);
});

test("heal feedback reveals restored HP while input stays locked until completion", async () => {
  const initial = createBattle({
    ...abilityPosition,
    cards: abilityPosition.cards.map((card) =>
      card.id === "north-guard" ? { ...card, wounds: 2 } : card,
    ),
  });
  const battle = new BattleSession(initial);
  let release: (() => void) | undefined;
  const playback = new CombatPlayback(
    battle,
    () =>
      new Promise((resolve) => {
        release = resolve;
      }),
    () => {},
  );
  battle.command({ type: "heal", player: "north", card: "north-ward", target: "north-guard" });
  const playing = playback.update();
  expect(playback.step).toEqual({
    animation: "heal",
    actors: [{ card: "north-guard", target: "north-ward", amount: 2 }],
  });
  expect(playback.busy).toBe(true);
  expect(playback.state.cards.find((card) => card.id === "north-guard")?.wounds).toBe(0);
  expect(playback.exchange).toEqual({ source: "north-ward", target: "north-guard" });
  expect(playback.eventCount).toBe(0);
  release!();
  await playing;
  expect(playback.state.cards.find((card) => card.id === "north-ward")?.status).toBe("closed");
  expect(playback.busy).toBe(false);
});

test("shot has one attacker, a projectile before wounds, and no response", async () => {
  const battle = new BattleSession(abilityPosition, () => 4);
  const seen: string[] = [];
  const shotPlayback = new CombatPlayback(
    battle,
    async (step) => {
      seen.push(step.animation);
      expect(shotPlayback.busy).toBe(true);
      expect(shotPlayback.state.cards.find((card) => card.id === "south-guard")?.wounds).toBe(
        step.animation === "hit" ? 1 : 0,
      );
    },
    () => {},
  );
  battle.command({ type: "shot", player: "north", card: "north-archer", target: "south-guard" });
  const steps = combatSteps(battle.events, battle.events);
  expect(steps.map((step) => step.animation)).toEqual(["attack", "result", "shot", "hit"]);
  expect(steps[0]?.actors).toEqual([{ card: "north-archer", target: "south-guard", shot: true }]);
  await shotPlayback.update();
  expect(seen).toEqual(["attack", "result", "shot", "hit"]);
  expect(shotPlayback.busy).toBe(false);
});

test("movement holds the old location and log until arrival, then commits the engine state", async () => {
  const battle = new BattleSession(skirmishPosition);
  let release: (() => void) | undefined;
  const seen: CombatStep[] = [];
  const playback = new CombatPlayback(
    battle,
    (step) => {
      seen.push(step);
      return new Promise((resolve) => {
        release = resolve;
      });
    },
    () => {},
  );
  battle.command({ type: "move", player: "north", card: "north-fighter", to: "B2" });
  const running = playback.update();
  expect(seen).toEqual([
    { animation: "move", actors: [{ card: "north-fighter", from: "B1", to: "B2" }] },
  ]);
  expect(playback.busy).toBe(true);
  expect(playback.exchange).toBeNull();
  expect(playback.state.cards[0]!.location).toEqual({ zone: "battlefield", cell: "B1" });
  expect(playback.eventCount).toBe(0);
  release!();
  await running;
  expect(playback.busy).toBe(false);
  expect(playback.state).toBe(battle.state);
  expect(playback.state.cards[0]!.location).toEqual({ zone: "battlefield", cell: "B2" });
  expect(playback.eventCount).toBe(battle.events.length);
});

test("restart during movement preserves the reset view when the cancelled tween settles", async () => {
  const battle = new BattleSession(skirmishPosition);
  let release: (() => void) | undefined;
  const playback = new CombatPlayback(
    battle,
    () =>
      new Promise((resolve) => {
        release = resolve;
      }),
    () => {},
  );
  battle.command({ type: "move", player: "north", card: "north-fighter", to: "B2" });
  const running = playback.update();
  battle.restart();
  playback.reset();
  release!();
  await running;
  expect(playback.state).toBe(skirmishPosition);
  expect(playback.busy).toBe(false);
  expect(playback.eventCount).toBe(0);
});
