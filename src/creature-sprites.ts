import Phaser from "phaser";
import { cells } from "./battle-session";
import type { CombatStep } from "./combat-playback";
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
      for (const animation of ["idle", "attack", "hit", "death"]) {
        const frames = scene.textures
          .get(asset)
          .getFrameNames()
          .filter((frame) => frame.startsWith(`${asset}_${animation}_`))
          .sort();
        if (!frames.length) throw new Error(`Missing ${animation} frames: ${asset}`);
        scene.anims.create({
          key: `${asset}:${animation}`,
          frames: frames.map((frame) => ({ key: asset, frame })),
          frameRate: animation === "idle" ? 8 : animation === "attack" ? 12 : 16,
          repeat: animation === "idle" ? -1 : 0,
        });
      }
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

  async play(step: CombatStep): Promise<void> {
    if (step.animation === "result" || step.animation === "heal") return;
    await Promise.all(
      step.actors.map((actor) => {
        const { card, target } = actor;
        const sprite = this.sprites.get(card);
        if (!sprite || (step.animation === "hit" && actor.amount === 0)) return Promise.resolve();
        const opponent = target ? this.sprites.get(target) : undefined;
        if (opponent && opponent.x !== sprite.x) sprite.setFlipX(opponent.x < sprite.x);
        const asset = sprite.texture.key;
        return new Promise<void>((resolve) => {
          const cancelled = () => {
            sprite.off("animationcomplete", complete);
            resolve();
          };
          const complete = () => {
            sprite.off("destroy", cancelled);
            if (step.animation === "death") {
              sprite.destroy();
              this.sprites.delete(card);
            } else sprite.play(`${asset}:idle`);
            resolve();
          };
          sprite.once("animationcomplete", complete);
          sprite.once("destroy", cancelled);
          sprite.play(`${asset}:${step.animation}`);
        });
      }),
    );
  }

  clear(): void {
    for (const sprite of this.sprites.values()) sprite.destroy();
    this.sprites.clear();
  }
}
