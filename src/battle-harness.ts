import { applyCommand } from "./engine";
import type { Command, EngineEvent, MatchState, PlayerId } from "./model";

type TraceEntry = Readonly<{
  command: Command;
  events: readonly EngineEvent[];
  priority: PlayerId | null;
}>;

function freeze<T>(value: T): T {
  if (value !== null && typeof value === "object") {
    Object.freeze(value);
    for (const child of Object.values(value)) freeze(child);
  }
  return value;
}

function assertPosition(state: MatchState): void {
  const ids = new Set(state.cards.map((card) => card.id));
  if (ids.size !== state.cards.length) throw new Error("Duplicate card identity");
  const cells = state.cards.flatMap((card) =>
    card.location.zone === "battlefield" ? [card.location.cell] : [],
  );
  if (new Set(cells).size !== cells.length)
    throw new Error("Two ordinary creatures occupy one cell");
  for (const object of state.stack) {
    if (!state.actions[object.action]) throw new Error(`Orphan stack object: ${object.action}`);
  }
  for (const action of Object.values(state.actions)) {
    if (!ids.has(action.source) || !state.stack.some((object) => object.action === action.id)) {
      throw new Error(`Orphan action: ${action.id}`);
    }
  }
  if (state.outcome && (state.stack.length || state.priorityPlayer !== null)) {
    throw new Error("Finished battle still has pending play");
  }
}

export class BattleHarness {
  private position: MatchState;
  private cursor = 0;
  private entries: TraceEntry[] = [];

  constructor(
    initial: MatchState,
    private readonly dice: readonly number[],
  ) {
    assertPosition(initial);
    this.position = freeze(initial);
  }

  get state(): MatchState {
    return this.position;
  }
  get trace(): readonly TraceEntry[] {
    return this.entries.slice();
  }

  command(command: Command): this {
    const result = applyCommand(this.position, command, () => {
      if (this.cursor === this.dice.length)
        throw new Error(`Scripted dice exhausted at roll ${this.cursor + 1}`);
      return this.dice[this.cursor++];
    });
    if (!result.ok) throw new Error(`Rejected ${JSON.stringify(command)}: ${result.reason}`);
    assertPosition(result.state);
    this.position = freeze(result.state);
    this.entries.push(
      freeze({ command, events: result.events, priority: result.state.priorityPlayer }),
    );
    return this;
  }

  pass(): this {
    if (this.position.priorityPlayer === null) throw new Error("No player has priority");
    return this.command({ type: "pass", player: this.position.priorityPlayer });
  }

  resolveStack(): this {
    let passes = 0;
    while (this.position.stack.length) {
      if (++passes > 100) throw new Error("Stack did not resolve within 100 passes");
      this.pass();
    }
    return this;
  }

  assertDiceConsumed(): void {
    if (this.cursor !== this.dice.length)
      throw new Error(`Unused scripted dice: ${this.dice.length - this.cursor}`);
  }
}
