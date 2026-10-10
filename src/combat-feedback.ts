import type Phaser from "phaser";
import type { CombatStep } from "./combat-playback";
import { cardPosition } from "./board-layout";
import type { MatchState } from "./model";

export class CombatFeedback {
  private objects: (
    | Phaser.GameObjects.Text
    | Phaser.GameObjects.Rectangle
    | Phaser.GameObjects.Ellipse
  )[] = [];
  private timer: Phaser.Time.TimerEvent | null = null;
  private settle: (() => void) | null = null;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly reducedMotion: () => boolean,
  ) {}

  play(step: CombatStep, state: MatchState, resolution: number): Promise<void> {
    this.clear();
    if (step.animation === "shot") {
      for (const actor of step.actors) {
        const source = state.cards.find((card) => card.id === actor.card);
        const target = state.cards.find((card) => card.id === actor.target);
        const from = source && cardPosition(source),
          to = target && cardPosition(target);
        if (!from || !to) continue;
        const bolt = this.scene.add
          .rectangle(from.x, from.y, 18, 3, 0xffd166)
          .setRotation(Math.atan2(to.y - from.y, to.x - from.x))
          .setDepth(4);
        this.objects.push(bolt);
        if (this.reducedMotion()) bolt.setPosition(to.x, to.y);
        else this.scene.tweens.add({ targets: bolt, x: to.x, y: to.y, duration: 180 });
      }
      return new Promise((resolve) => {
        this.settle = resolve;
        this.timer = this.scene.time.delayedCall(180, () => this.clear());
      });
    }
    if (step.animation !== "result" && step.animation !== "hit" && step.animation !== "heal")
      return Promise.resolve();
    for (const actor of step.actors) {
      const card = state.cards.find((card) => card.id === actor.card);
      const position = card && cardPosition(card);
      if (!position) continue;
      const { x, y } = position;
      const result = step.animation === "result";
      const label = this.scene.add
        .text(
          x + 27,
          result ? y - 22 : y - 9,
          step.animation === "heal"
            ? `+${actor.amount}`
            : result
              ? `Roll ${actor.roll}`
              : actor.amount
                ? `−${actor.amount}${actor.prevented ? " A" : ""}`
                : actor.prevented
                  ? "Armor"
                  : "Miss",
          {
            fontFamily: "sans-serif",
            fontSize: result ? "12px" : "14px",
            fontStyle: "bold",
            color:
              step.animation === "heal"
                ? "#95d5b2"
                : result
                  ? "#f5f1e8"
                  : actor.amount
                    ? "#ff8b75"
                    : "#b7c5ce",
            backgroundColor: "#18212b",
            padding: { x: 4, y: 3 },
            resolution,
          },
        )
        .setOrigin(1, 0.5)
        .setDepth(4);
      this.objects.push(label);
      if (!result)
        this.scene.tweens.add({
          targets: label,
          y: y - 9 - (this.reducedMotion() ? 0 : 12),
          alpha: { value: 0, ease: "Expo.easeIn" },
          duration: 650,
          ease: "Expo.easeOut",
        });
    }
    return new Promise((resolve) => {
      this.settle = resolve;
      this.timer = this.scene.time.delayedCall(step.animation === "result" ? 500 : 650, () =>
        this.clear(),
      );
    });
  }

  yourTurn(state: MatchState): void {
    this.clear();
    for (const card of state.cards) {
      const position = cardPosition(card);
      if (card.controller !== "north" || !position) continue;
      const { x, y } = position;
      const outline = this.scene.add
        .ellipse(x, y + 6, 44, 18)
        .setStrokeStyle(3, 0x95d5b2)
        .setDepth(0.5);
      this.objects.push(outline);
      this.scene.tweens.add({ targets: outline, alpha: 0, duration: 400, ease: "Expo.easeOut" });
    }
    this.timer = this.scene.time.delayedCall(400, () => this.clear());
  }

  clear(): void {
    this.timer?.remove();
    this.timer = null;
    for (const object of this.objects) {
      this.scene.tweens.killTweensOf(object);
      object.destroy();
    }
    this.objects = [];
    const settle = this.settle;
    this.settle = null;
    settle?.();
  }
}
