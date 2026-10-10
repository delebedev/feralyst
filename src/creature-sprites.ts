import Phaser from "phaser";
import { boardLayout, cardPosition, cellPosition } from "./board-layout";
import type { CombatStep } from "./combat-playback";
import { creatureArt } from "./creature-art";
import type { MatchState } from "./model";

export class CreatureSprites {
  private readonly sprites = new Map<string, Phaser.GameObjects.Sprite>();

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly select?: (id: string) => void,
    private readonly reducedMotion: () => boolean = () => false,
  ) {
    for (const { asset } of Object.values(creatureArt)) {
      scene.textures.get(asset).setFilter(Phaser.Textures.FilterMode.NEAREST);
      for (const animation of ["idle", "run", "attack", "hit", "death"]) {
        const frames = scene.textures
          .get(asset)
          .getFrameNames()
          .filter((frame) => frame.startsWith(`${asset}_${animation}_`))
          .sort();
        if (!frames.length) throw new Error(`Missing ${animation} frames: ${asset}`);
        scene.anims.create({
          key: `${asset}:${animation}`,
          frames: frames.map((frame) => ({ key: asset, frame })),
          frameRate:
            animation === "idle" ? 8 : animation === "attack" || animation === "run" ? 12 : 16,
          repeat: animation === "idle" || animation === "run" ? -1 : 0,
        });
      }
    }
  }

  sync(state: MatchState): void {
    for (const [id, sprite] of this.sprites) {
      if (!state.cards.some((card) => card.id === id && cardPosition(card))) {
        sprite.destroy();
        this.sprites.delete(id);
      }
    }
    for (const card of state.cards) {
      const position = cardPosition(card);
      if (!position) continue;
      const art = creatureArt[card.definition];
      if (!art) throw new Error(`Missing creature art: ${card.definition}`);
      let sprite = this.sprites.get(card.id);
      if (!sprite) {
        sprite = this.scene.add
          .sprite(0, 0, art.asset)
          .setDepth(1)
          .setOrigin(...art.origin);
        sprite.play(`${art.asset}:idle`);
        if (this.select)
          sprite
            .setInteractive({ useHandCursor: true, pixelPerfect: true })
            .on("pointerup", () => this.select?.(card.id));
        this.sprites.set(card.id, sprite);
      }
      const { x, y } = position;
      sprite
        .setDisplaySize(art.size * boardLayout.spriteScale, art.size * boardLayout.spriteScale)
        .setPosition(x, y + 6)
        .setDepth(1 + y / 1000)
        .setFlipX(card.controller === "south")
        .setAlpha(card.status === "closed" ? 0.65 : 1);
    }
  }

  async play(
    step: CombatStep,
    followers: (id: string) => readonly Phaser.GameObjects.Container[] = () => [],
  ): Promise<void> {
    if (step.animation === "result" || step.animation === "heal" || step.animation === "shot")
      return;
    await Promise.all(
      step.actors.map((actor) => {
        const { card, target } = actor;
        const sprite = this.sprites.get(card);
        if (!sprite || (step.animation === "hit" && actor.amount === 0)) return Promise.resolve();
        if (step.animation === "move") {
          if (!actor.to) throw new Error(`Missing movement destination: ${card}`);
          const to = cellPosition(actor.to),
            dx = to.x - sprite.x,
            dy = to.y + 6 - sprite.y;
          const targets = [sprite, ...followers(card)];
          if (dx !== 0) sprite.setFlipX(dx < 0);
          if (this.reducedMotion()) {
            for (const target of targets) target.setPosition(target.x + dx, target.y + dy);
            return Promise.resolve();
          }
          sprite.play(`${sprite.texture.key}:run`);
          return new Promise<void>((resolve) => {
            const cancelled = () => {
              this.scene.tweens.killTweensOf(targets);
              resolve();
            };
            sprite.once("destroy", cancelled);
            this.scene.tweens.add({
              targets,
              x: `+=${dx}`,
              y: `+=${dy}`,
              duration: 280,
              ease: "Linear",
              onUpdate: () => sprite.setDepth(1 + (sprite.y - 6) / 1000),
              onComplete: () => {
                sprite.off("destroy", cancelled);
                sprite.play(`${sprite.texture.key}:idle`);
                resolve();
              },
            });
          });
        }
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
