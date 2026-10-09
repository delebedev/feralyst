import { cells, type BattleDecision, type BattleSession } from "./battle-session";
import type { MatchState, PlayerId } from "./model";

function distance(a: string, b: string): number {
  const first = cells.findIndex((cell) => cell === a);
  const second = cells.findIndex((cell) => cell === b);
  return (
    Math.abs((first % 5) - (second % 5)) + Math.abs(Math.floor(first / 5) - Math.floor(second / 5))
  );
}

export function chooseAction(
  state: MatchState,
  actions: readonly BattleDecision[],
): BattleDecision | null {
  const card = (id: string) => state.cards.find((candidate) => candidate.id === id)!;
  const life = (id: string) => {
    const target = card(id);
    return (
      state.definitions.find((definition) => definition.id === target.definition)!.lifeAllowance -
      target.wounds
    );
  };
  const defender = actions.find((action) => action.type === "defend");
  if (defender) return defender;
  const strikes = actions.filter((action) => action.type === "strike");
  strikes.sort((a, b) => life(a.target) - life(b.target));
  if (strikes[0]) return strikes[0];

  const enemies = state.cards.flatMap((target) =>
    target.controller !== state.priorityPlayer && target.location.zone === "battlefield"
      ? [target.location.cell]
      : [],
  );
  const nearest = (cell: string) => Math.min(...enemies.map((enemy) => distance(cell, enemy)));
  const moves = actions
    .filter((action) => action.type === "move")
    .filter((action) => {
      const source = card(action.card);
      return (
        source.location.zone === "battlefield" && nearest(action.to) < nearest(source.location.cell)
      );
    });
  moves.sort((a, b) => nearest(a.to) - nearest(b.to));
  // shortcut: occupied paths can stall this greedy bot; add pathfinding when scenarios need it.
  return (
    moves[0] ??
    actions.find((action) => action.type === "take-attack" || action.type === "end-turn") ??
    null
  );
}

export class OpponentTurn {
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly battle: BattleSession,
    private readonly player: PlayerId,
    private readonly changed: () => void,
    private readonly delay = 400,
  ) {}

  update(): void {
    if (this.timer !== null || this.battle.state.priorityPlayer !== this.player) return;
    const state = this.battle.state;
    const action = chooseAction(state, this.battle.decisions);
    if (!action) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      if (this.battle.state === state) {
        this.battle.decide(action);
        this.changed();
      }
      this.update();
    }, this.delay);
  }

  cancel(): void {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  }
}
