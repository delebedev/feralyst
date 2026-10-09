import { expect, mock, test } from "bun:test";
import { EventEmitter } from "node:events";
import type Phaser from "phaser";
import { skirmishPosition } from "./battle-session";

await mock.module("phaser", () => ({ default: { Textures: { FilterMode: { NEAREST: 0 } } } }));
const { CreatureSprites, cellPosition } = await import("./creature-sprites");

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

function renderer(): { creatures: InstanceType<typeof CreatureSprites>; sprites: Sprite[] } {
  const sprites: Sprite[] = [];
  const scene = {
    textures: {
      get: (asset: string) => ({
        setFilter: () => {},
        getFrameNames: () =>
          ["idle", "attack", "hit", "death"].flatMap((animation) => [
            `${asset}_${animation}_001.png`,
            `${asset}_${animation}_000.png`,
          ]),
      }),
    },
    anims: { create: () => {} },
    add: {
      sprite: (_x: number, _y: number, asset: string) => {
        const sprite = new Sprite();
        sprite.texture.key = asset;
        sprites.push(sprite);
        return sprite;
      },
    },
  };
  return { creatures: new CreatureSprites(scene as unknown as Phaser.Scene), sprites };
}

test("human cells are below their opposing cells", () => {
  expect(cellPosition("B1")).toEqual({ x: 108, y: 252 });
  expect(cellPosition("B1′")).toEqual({ x: 108, y: 180 });
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
  expect(fighter.y).toBe(cellPosition("B2").y + 18);
  expect(fighter.alpha).toBe(0.45);
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
