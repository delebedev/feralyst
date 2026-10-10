import { expect, mock, test } from "bun:test";
import type Phaser from "phaser";
import { cellPosition } from "./board-layout";
import { abilityPosition, skirmishPosition } from "../battle/positions";
await mock.module("phaser", () => ({ default: { Textures: { FilterMode: { NEAREST: 0 } } } }));
const { CombatFeedback } = await import("./combat-feedback");

function renderer(reduced = false) {
  const labels: { text: string; destroyed: boolean }[] = [];
  const timers: { delay: number; callback: () => void; removed: boolean; remove: () => void }[] =
    [];
  const tweens: { y?: number; duration: number }[] = [];
  const object = (text: string) => {
    const item = {
      text,
      destroyed: false,
      setOrigin: () => item,
      setDepth: () => item,
      setRotation: () => item,
      setPosition: () => item,
      setStrokeStyle: () => item,
      destroy: () => {
        item.destroyed = true;
      },
    };
    labels.push(item);
    return item;
  };
  const scene = {
    add: {
      text: (_x: number, _y: number, text: string) => object(text),
      rectangle: () => object(""),
      ellipse: () => object(""),
    },
    time: {
      delayedCall: (delay: number, callback: () => void) => {
        const timer = {
          delay,
          callback,
          removed: false,
          remove: () => {
            timer.removed = true;
          },
        };
        timers.push(timer);
        return timer;
      },
    },
    tweens: {
      add: (config: { y?: number; duration: number }) => tweens.push(config),
      killTweensOf: () => {},
    },
  } as unknown as Phaser.Scene;
  return { feedback: new CombatFeedback(scene, () => reduced), labels, timers, tweens };
}

test("dice stay for 500ms and cancellation destroys labels and settles the wait", async () => {
  const { feedback, labels, timers } = renderer();
  const playing = feedback.play(
    { animation: "result", actors: [{ card: "north-fighter", roll: 6 }] },
    skirmishPosition,
    2,
  );
  expect(labels[0]?.text).toBe("Roll 6");
  expect(timers[0]?.delay).toBe(500);
  feedback.clear();
  await playing;
  expect(timers[0]?.removed).toBe(true);
  expect(labels[0]?.destroyed).toBe(true);
});

test("damage and Miss fade while reduced motion removes the float", async () => {
  for (const reduced of [false, true]) {
    const { feedback, labels, timers, tweens } = renderer(reduced);
    const playing = feedback.play(
      {
        animation: "hit",
        actors: [
          { card: "north-fighter", amount: 2 },
          { card: "south-fighter", amount: 0 },
        ],
      },
      skirmishPosition,
      1,
    );
    expect(labels.map((label) => label.text)).toEqual(["−2", "Miss"]);
    expect(tweens[0]?.y).toBe(cellPosition("B1").y - 9 - (reduced ? 0 : 12));
    expect(timers[0]?.delay).toBe(650);
    timers[0]!.callback();
    await playing;
    expect(labels.every((label) => label.destroyed)).toBe(true);
  }
});

test("combat replaces turn emphasis and clear removes all remaining feedback", async () => {
  const { feedback, labels, timers } = renderer();
  feedback.yourTurn(skirmishPosition);
  expect(labels).toHaveLength(3);
  const playing = feedback.play(
    { animation: "result", actors: [{ card: "north-fighter", roll: 1 }] },
    skirmishPosition,
    1,
  );
  expect(labels.slice(0, 3).every((label) => label.destroyed)).toBe(true);
  expect(timers[0]?.removed).toBe(true);
  feedback.clear();
  await playing;
  expect(labels.every((label) => label.destroyed)).toBe(true);
});

test("healing shows positive actual restoration and armor absorption is not a miss", async () => {
  const { feedback, labels, timers } = renderer();
  const healing = feedback.play(
    { animation: "heal", actors: [{ card: "north-guard", amount: 1 }] },
    skirmishPosition,
    1,
  );
  expect(labels[0]?.text).toBe("+1");
  timers[0]!.callback();
  await healing;
  const armor = feedback.play(
    { animation: "hit", actors: [{ card: "north-guard", amount: 0, prevented: 1 }] },
    skirmishPosition,
    1,
  );
  expect(labels[1]?.text).toBe("Armor");
  feedback.clear();
  await armor;
});

test("shot projectile respects reduced motion and cancellation settles playback", async () => {
  for (const reduced of [false, true]) {
    const { feedback, labels, timers, tweens } = renderer(reduced);
    const playing = feedback.play(
      { animation: "shot", actors: [{ card: "north-fighter", target: "south-fighter" }] },
      skirmishPosition,
      1,
    );
    expect(labels).toHaveLength(1);
    expect(tweens).toHaveLength(reduced ? 0 : 1);
    expect(timers[0]?.delay).toBe(180);
    feedback.clear();
    await playing;
    expect(labels[0]?.destroyed).toBe(true);
    expect(timers[0]?.removed).toBe(true);
  }
});

test("air-zone dice, damage and shot feedback settle on the same lifecycle as ground combat", async () => {
  for (const step of [
    { animation: "result", actors: [{ card: "south-gryphon", roll: 4 }] },
    { animation: "hit", actors: [{ card: "south-gryphon", amount: 2 }] },
    { animation: "shot", actors: [{ card: "north-archer", target: "south-gryphon" }] },
  ] as const) {
    const { feedback, labels, timers } = renderer();
    const playing = feedback.play(step, abilityPosition, 1);
    expect(labels).toHaveLength(1);
    timers[0]!.callback();
    await playing;
    expect(labels[0]!.destroyed).toBe(true);
  }
});
