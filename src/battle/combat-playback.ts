import type { BattleSession } from "./battle-session";
import type { Cell, EngineEvent, MatchState } from "../rules/model";

export type CombatStep = Readonly<{
  animation: "attack" | "result" | "hit" | "death" | "heal" | "shot" | "move";
  actors: readonly Readonly<{
    card: string;
    target?: string;
    roll?: number;
    amount?: number;
    prevented?: number;
    shot?: boolean;
    from?: Cell;
    to?: Cell;
  }>[];
}>;

export function combatSteps(
  history: readonly EngineEvent[],
  events: readonly EngineEvent[],
): CombatStep[] {
  const movement = events.filter((event) => event.type === "moved");
  if (movement.length)
    return movement.map((event) => ({
      animation: "move",
      actors: [{ card: event.card, from: event.from, to: event.to }],
    }));
  const attacks = events
    .filter((event) => event.type === "rolled")
    .map((roll) => {
      const declaration = history.find(
        (event) => event.type === "declared" && event.action.id === roll.action,
      );
      if (
        declaration?.type !== "declared" ||
        (declaration.action.kind !== "strike" && declaration.action.kind !== "shot")
      )
        throw new Error(`Missing strike declaration: ${roll.action}`);
      const strike = declaration.action;
      const redirect = history.find(
        (event) => event.type === "redirected" && event.attack === strike.id,
      );
      const target = redirect?.type === "redirected" ? redirect.to : strike.target;
      return {
        card: roll.card,
        target: roll.card === strike.source ? target : strike.source,
        roll: roll.value,
        ...(strike.kind === "shot" ? { shot: true } : {}),
      };
    });
  if (!attacks.length)
    return events
      .filter((event) => event.type === "healed")
      .map((event) => ({
        animation: "heal",
        actors: [{ card: event.card, target: event.source, amount: event.amount }],
      }));
  // shortcut: stages group one strike per decision; split by action if chained strikes are added.
  return [
    {
      animation: "attack" as const,
      actors: attacks.map(({ card, target, shot }) => ({
        card,
        target,
        ...(shot ? { shot } : {}),
      })),
    },
    { animation: "result" as const, actors: attacks },
    { animation: "shot" as const, actors: attacks.filter((actor) => actor.shot) },
    {
      animation: "hit" as const,
      actors: attacks.map(({ target }) => ({
        card: target,
        ...(events.some((event) => event.type === "prevented" && event.card === target)
          ? {
              prevented: events
                .filter((event) => event.type === "prevented" && event.card === target)
                .reduce((sum, event) => sum + (event.type === "prevented" ? event.amount : 0), 0),
            }
          : {}),
        amount: events
          .filter((event) => event.type === "wounded" && event.card === target)
          .reduce((amount, event) => amount + (event.type === "wounded" ? event.amount : 0), 0),
      })),
    },
    {
      animation: "death" as const,
      actors: events
        .filter((event) => event.type === "destroyed")
        .map((event) => ({ card: event.card })),
    },
  ].filter((step) => step.actors.length);
}

export class CombatPlayback {
  state: MatchState;
  eventCount = 0;
  busy = false;
  step: CombatStep | null = null;
  private fighting: { source: string; target: string } | null = null;
  private consumed = 0;
  private revision = 0;

  constructor(
    private readonly battle: BattleSession,
    private readonly play: (step: CombatStep) => Promise<void>,
    private readonly changed: () => void,
  ) {
    this.state = battle.state;
  }

  get exchange(): { source: string; target: string } | null {
    if (this.fighting) return this.fighting;
    for (const item of this.state.stack) {
      const action = this.state.actions[item.action];
      if (action?.kind === "strike" || action?.kind === "shot")
        return { source: action.source, target: action.target };
    }
    return null;
  }

  async update(): Promise<void> {
    if (this.busy) return;
    const steps = combatSteps(this.battle.events, this.battle.events.slice(this.consumed));
    this.consumed = this.battle.events.length;
    const revision = this.revision;
    this.busy = steps.length > 0;
    const attacker = steps[0]?.actors[0];
    if (attacker?.target)
      this.fighting =
        steps[0]?.animation === "heal"
          ? { source: attacker.target, target: attacker.card }
          : { source: attacker.card, target: attacker.target };
    try {
      for (const step of steps) {
        this.step = step;
        if (step.animation === "hit" || step.animation === "heal") {
          this.state = {
            ...this.state,
            cards: this.state.cards.map((card) => ({
              ...card,
              ...(step.actors.some((actor) => actor.card === card.id && actor.prevented)
                ? {
                    armorSpent: this.battle.state.cards.find((final) => final.id === card.id)
                      ?.armorSpent,
                  }
                : {}),
              wounds:
                card.wounds +
                (step.animation === "heal" ? -1 : 1) *
                  (step.actors.find((actor) => actor.card === card.id)?.amount ?? 0),
            })),
          };
        }
        this.changed();
        await this.play(step);
        if (revision !== this.revision) return;
      }
    } finally {
      if (revision === this.revision) {
        this.busy = false;
        this.step = null;
        this.fighting = null;
        this.state = this.battle.state;
        this.eventCount = this.consumed;
        this.changed();
      }
    }
  }

  reset(): void {
    this.revision++;
    this.consumed = 0;
    this.busy = false;
    this.step = null;
    this.fighting = null;
    this.state = this.battle.state;
    this.eventCount = 0;
    this.changed();
  }
}
