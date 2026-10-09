import Phaser from "phaser";
import { cells } from "./battle-session";
import { creatureArt } from "./creature-art";
import type { Cell, MatchState } from "./model";

export function cellPosition(cell: Cell): { x: number; y: number } {
  const index = cells.indexOf(cell);
  return { x: (index % 5) * 72 + 36, y: (5 - Math.floor(index / 5)) * 72 + 36 };
}

export class CreatureSprites {
  private readonly sprites = new Map<string, Phaser.GameObjects.Sprite>();

  constructor(private readonly scene: Phaser.Scene) {
    for (const { asset } of Object.values(creatureArt)) {
      scene.textures.get(asset).setFilter(Phaser.Textures.FilterMode.NEAREST);
      const frames = scene.textures
        .get(asset)
        .getFrameNames()
        .filter((frame) => frame.startsWith(`${asset}_idle_`))
        .sort();
      scene.anims.create({
        key: `${asset}:idle`,
        frames: frames.map((frame) => ({ key: asset, frame })),
        frameRate: 8,
        repeat: -1,
      });
    }
  }

  sync(state: MatchState): void {
    for (const [id, sprite] of this.sprites) {
      if (!state.cards.some((card) => card.id === id && card.location.zone === "battlefield")) {
        sprite.destroy();
        this.sprites.delete(id);
      }
    }
    for (const card of state.cards) {
      if (card.location.zone !== "battlefield") continue;
      const art = creatureArt[card.definition];
      if (!art) throw new Error(`Missing creature art: ${card.definition}`);
      let sprite = this.sprites.get(card.id);
      if (!sprite) {
        sprite = this.scene.add
          .sprite(0, 0, art.asset)
          .setDepth(1)
          .setDisplaySize(art.size, art.size)
          .setOrigin(...art.origin);
        sprite.play(`${art.asset}:idle`);
        this.sprites.set(card.id, sprite);
      }
      const { x, y } = cellPosition(card.location.cell);
      sprite
        .setPosition(x, y + 18)
        .setFlipX(card.controller === "south")
        .setAlpha(card.status === "closed" ? 0.45 : 1);
    }
  }

  clear(): void {
    for (const sprite of this.sprites.values()) sprite.destroy();
    this.sprites.clear();
  }
}
