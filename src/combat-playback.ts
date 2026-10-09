import type { BattleSession } from "./battle-session";
import type { EngineEvent, MatchState } from "./model";

export type CombatStep = Readonly<{
  animation: "attack" | "hit" | "death";
  actors: readonly Readonly<{ card: string; target?: string }>[];
}>;

export function combatSteps(
  history: readonly EngineEvent[],
  events: readonly EngineEvent[],
): CombatStep[] {
  const attacks = events
    .filter((event) => event.type === "rolled")
    .map((roll) => {
      const declaration = history.find(
        (event) => event.type === "declared" && event.action.id === roll.action,
      );
      if (declaration?.type !== "declared" || declaration.action.kind !== "strike")
        throw new Error(`Missing strike declaration: ${roll.action}`);
      const strike = declaration.action;
      const redirect = history.find(
        (event) => event.type === "redirected" && event.attack === strike.id,
      );
      const target = redirect?.type === "redirected" ? redirect.to : strike.target;
      return { card: roll.card, target: roll.card === strike.source ? target : strike.source };
    });
  if (!attacks.length) return [];
  // shortcut: stages group one strike per decision; split by action if chained strikes are added.
  return [
    { animation: "attack" as const, actors: attacks },
    {
      animation: "hit" as const,
      actors: events
        .filter((event) => event.type === "wounded")
        .map((event) => ({ card: event.card })),
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
  private consumed = 0;
  private revision = 0;

  constructor(
    private readonly battle: BattleSession,
    private readonly play: (step: CombatStep) => Promise<void>,
    private readonly changed: () => void,
  ) {
    this.state = battle.state;
  }

  async update(): Promise<void> {
    if (this.busy) return;
    const steps = combatSteps(this.battle.events, this.battle.events.slice(this.consumed));
    this.consumed = this.battle.events.length;
    const revision = this.revision;
    this.busy = steps.length > 0;
    if (this.busy) this.changed();
    try {
      for (const step of steps) {
        await this.play(step);
        if (revision !== this.revision) return;
      }
    } finally {
      if (revision === this.revision) {
        this.busy = false;
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
    this.state = this.battle.state;
    this.eventCount = 0;
    this.changed();
  }
}
