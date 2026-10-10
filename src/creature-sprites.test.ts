import { expect, mock, test } from "bun:test";
import { EventEmitter } from "node:events";
import type Phaser from "phaser";
import { boardLayout, cardPosition, cellPosition } from "./board-layout";
import { abilityPosition, skirmishPosition } from "./battle-session";

await mock.module("phaser", () => ({ default: { Textures: { FilterMode: { NEAREST: 0 } } } }));
const { CreatureSprites } = await import("./creature-sprites");

class Sprite extends EventEmitter {
  texture = { key: "" };
  animation = "";
  x = 0;
  y = 0;
  flip = false;
  alpha = 1;
  destroyed = false;
  plays = 0;
  setDepth() {
    return this;
  }
  setInteractive() {
    return this;
  }
  setOrigin() {
    return this;
  }
  setDisplaySize() {
    return this;
  }
  play(key: string) {
    this.animation = key;
    this.plays++;
    return this;
  }
  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }
  setFlipX(flip: boolean) {
    this.flip = flip;
    return this;
  }
  setAlpha(alpha: number) {
    this.alpha = alpha;
    return this;
  }
  destroy() {
    this.destroyed = true;
    this.emit("destroy");
  }
}

type MovementTween = {
  targets: Sprite[];
  x: string;
  y: string;
  duration: number;
  onUpdate: () => void;
  onComplete: () => void;
};
function renderer(select?: (id: string) => void, reduced = false) {
  const sprites: Sprite[] = [];
  const tweens: MovementTween[] = [];
  const killed: Sprite[][] = [];
  const scene = {
    textures: {
      get: (asset: string) => ({
        setFilter: () => {},
        getFrameNames: () =>
          ["idle", "run", "attack", "hit", "death"].flatMap((animation) => [
            `${asset}_${animation}_001.png`,
            `${asset}_${animation}_000.png`,
          ]),
      }),
    },
    anims: { create: () => {} },
    tweens: {
      add: (tween: MovementTween) => tweens.push(tween),
      killTweensOf: (targets: Sprite[]) => killed.push(targets),
    },
    add: {
      sprite: (_x: number, _y: number, asset: string) => {
        const sprite = new Sprite();
        sprite.texture.key = asset;
        sprites.push(sprite);
        return sprite;
      },
    },
  };
  return {
    creatures: new CreatureSprites(scene as unknown as Phaser.Scene, select, () => reduced),
    sprites,
    tweens,
    killed,
  };
}

test("human cells are below their opposing cells", () => {
  expect(cellPosition("B1").y).toBeGreaterThan(cellPosition("B1′").y);
});

test("redraws and moves retain idle playback while closing changes presentation", () => {
  const { creatures, sprites } = renderer();
  creatures.sync(skirmishPosition);
  expect(sprites).toHaveLength(6);
  const fighter = sprites[0]!;
  expect(fighter.plays).toBe(1);
  expect(fighter.flip).toBe(false);
  expect(sprites[3]!.flip).toBe(true);
  creatures.sync(skirmishPosition);
  const moved = {
    ...skirmishPosition,
    cards: skirmishPosition.cards.map((card) =>
      card.id === "north-fighter"
        ? {
            ...card,
            status: "closed" as const,
            location: { zone: "battlefield" as const, cell: "B2" as const },
          }
        : card,
    ),
  };
  creatures.sync(moved);
  expect(sprites).toHaveLength(6);
  expect(fighter.plays).toBe(1);
  expect(fighter.y).toBe(cellPosition("B2").y + 6);
  expect(fighter.alpha).toBe(0.65);
});

test("death removes a creature and restart replaces sprites", () => {
  const { creatures, sprites } = renderer();
  creatures.sync(skirmishPosition);
  creatures.sync({
    ...skirmishPosition,
    cards: skirmishPosition.cards.map((card) =>
      card.id === "north-fighter" ? { ...card, location: { zone: "graveyard" as const } } : card,
    ),
  });
  expect(sprites[0]!.destroyed).toBe(true);
  expect(sprites[1]!.destroyed).toBe(false);
  creatures.clear();
  expect(sprites.every((sprite) => sprite.destroyed)).toBe(true);
  creatures.sync(skirmishPosition);
  expect(sprites).toHaveLength(12);
  expect(sprites.slice(6).every((sprite) => !sprite.destroyed && sprite.plays === 1)).toBe(true);
});

test("combat completion restores idle, death removes sprites, and clear settles pending playback", async () => {
  const { creatures, sprites } = renderer();
  creatures.sync(skirmishPosition);
  const fighter = sprites[0]!;
  const attack = creatures.play({
    animation: "attack",
    actors: [{ card: "north-fighter", target: "south-ward" }],
  });
  expect(fighter.animation).toEndWith(":attack");
  fighter.emit("animationcomplete");
  await attack;
  expect(fighter.animation).toEndWith(":idle");
  const death = creatures.play({ animation: "death", actors: [{ card: "north-fighter" }] });
  fighter.emit("animationcomplete");
  await death;
  expect(fighter.destroyed).toBe(true);
  const hit = creatures.play({ animation: "hit", actors: [{ card: "north-guard" }] });
  creatures.clear();
  await hit;
  expect(sprites.every((sprite) => sprite.destroyed)).toBe(true);
});

test("dice and misses do not play hit animations", async () => {
  const { creatures, sprites } = renderer();
  creatures.sync(skirmishPosition);
  const plays = sprites.map((sprite) => sprite.plays);
  await creatures.play({ animation: "result", actors: [{ card: "north-fighter", roll: 4 }] });
  await creatures.play({ animation: "hit", actors: [{ card: "north-fighter", amount: 0 }] });
  expect(sprites.map((sprite) => sprite.plays)).toEqual(plays);
});

test("flyers use the air margins without occupying or moving between ground cells", () => {
  const { creatures, sprites } = renderer();
  creatures.sync(abilityPosition);
  const gryphons = sprites.filter((sprite) => sprite.texture.key === "f1_gryphinox");
  expect(gryphons).toHaveLength(2);
  expect(gryphons.map((sprite) => [sprite.x, sprite.y])).toEqual([
    [120, boardLayout.groundTop + boardLayout.cellHeight * 6 + 54],
    [180, boardLayout.groundTop - 38],
  ]);
  const flyer = abilityPosition.cards.find((card) => card.id === "north-gryphon")!;
  expect(cardPosition({ ...flyer, location: { zone: "graveyard" } })).toBeNull();
  creatures.sync({
    ...abilityPosition,
    cards: abilityPosition.cards.map((card) =>
      card.id === flyer.id ? { ...card, location: { zone: "graveyard" } } : card,
    ),
  });
  expect(gryphons[0]!.destroyed).toBe(true);
  expect(gryphons[1]!.destroyed).toBe(false);
});

test("sprite taps select their own card even when figures extend beyond cell footprints", () => {
  const selected: string[] = [];
  const { creatures, sprites } = renderer((id) => selected.push(id));
  creatures.sync(abilityPosition);
  sprites[0]!.emit("pointerup");
  sprites.find((sprite) => sprite.texture.key === "f1_gryphinox")!.emit("pointerup");
  expect(selected).toEqual(["north-fighter", "north-gryphon"]);
});

test.each(["A1", "B2"] as const)(
  "run to %s carries decoration layers and returns to idle only on arrival",
  async (to) => {
    const { creatures, sprites, tweens } = renderer();
    creatures.sync(skirmishPosition);
    const sprite = sprites[0]!;
    const ground = new Sprite(),
      details = new Sprite();
    const playing = creatures.play(
      { animation: "move", actors: [{ card: "north-fighter", from: "B1", to }] },
      () => [ground, details] as unknown as Phaser.GameObjects.Container[],
    );
    expect(sprite.animation).toEndWith(":run");
    expect(sprite.flip).toBe(to === "A1");
    expect(sprite.x).toBe(cellPosition("B1").x);
    const tween = tweens[0]!;
    expect(tween.duration).toBe(280);
    expect(tween.targets).toEqual([sprite, ground, details]);
    const dx = Number(tween.x.slice(2)),
      dy = Number(tween.y.slice(2));
    for (const target of tween.targets) target.setPosition(target.x + dx, target.y + dy);
    tween.onUpdate();
    tween.onComplete();
    await playing;
    expect(sprite.animation).toEndWith(":idle");
    expect([sprite.x, sprite.y]).toEqual([cellPosition(to).x, cellPosition(to).y + 6]);
    expect([ground.x, ground.y, details.x, details.y]).toEqual([dx, dy, dx, dy]);
    expect(sprite.listenerCount("destroy")).toBe(0);
  },
);

test("reduced motion snaps sprite and followers without run frames or a tween", async () => {
  const { creatures, sprites, tweens } = renderer(undefined, true);
  creatures.sync(skirmishPosition);
  const follower = new Sprite();
  await creatures.play(
    { animation: "move", actors: [{ card: "north-fighter", from: "B1", to: "A1" }] },
    () => [follower] as unknown as Phaser.GameObjects.Container[],
  );
  expect(tweens).toHaveLength(0);
  expect(sprites[0]!.animation).toEndWith(":idle");
  expect(sprites[0]!.x).toBe(cellPosition("A1").x);
  expect(follower.x).toBe(-boardLayout.cellWidth);
});

test("restart destroys the moving sprite, kills its follower tween and settles playback", async () => {
  const { creatures, sprites, tweens, killed } = renderer();
  creatures.sync(skirmishPosition);
  const playing = creatures.play({
    animation: "move",
    actors: [{ card: "north-fighter", from: "B1", to: "B2" }],
  });
  creatures.clear();
  await playing;
  expect(killed).toEqual([tweens[0]!.targets]);
  expect(sprites.every((sprite) => sprite.destroyed)).toBe(true);
  creatures.sync(skirmishPosition);
  expect(sprites.slice(6).every((sprite) => sprite.animation.endsWith(":idle"))).toBe(true);
});
