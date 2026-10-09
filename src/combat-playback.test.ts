import { expect, test } from "bun:test";
import { BattleSession, skirmishPosition } from "./battle-session";
import { combatSteps, CombatPlayback, type CombatStep } from "./combat-playback";
import { createBattle } from "./engine";

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
  expect(steps.map((step) => step.animation)).toEqual(["attack", "hit"]);
  expect(steps[1]?.actors).not.toContainEqual({ card: "south-fighter" });
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
  expect(steps.map((step) => step.animation)).toEqual(["attack", "hit", "death"]);
  expect(steps[2]?.actors).toHaveLength(2);
});

test("visual state and log wait for animation completion", async () => {
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
  battle.takeAttack();
  const running = playback.update();
  expect(playback.busy).toBe(true);
  expect(playback.state).toBe(before);
  expect(playback.eventCount).toBe(eventCount);
  expect(seen[0]?.animation).toBe("attack");
  release!();
  await Promise.resolve();
  expect(seen[1]?.animation).toBe("hit");
  expect(playback.state).toBe(before);
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
});
