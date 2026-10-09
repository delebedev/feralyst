import { demoPosition } from "./battle-demo";
import { applyCommand, createBattle } from "./engine";
import type { Cell, Command, DiceSource, EngineEvent, MatchState } from "./model";

export const cells: readonly Cell[] = ["3", "2", "1", "1′", "2′", "3′"].flatMap((row) =>
  ["A", "B", "C", "D", "E"].map((column) => `${column}${row}` as Cell),
);

export const skirmishPosition = createBattle({
  players: ["north", "south"],
  activePlayer: "north",
  definitions: demoPosition.definitions,
  cards: (["north", "south"] as const).flatMap((player) =>
    ["fighter", "guard", "ward"].map((definition, index) => ({
      id: `${player}-${definition}`,
      definition,
      owner: player,
      controller: player,
      location: {
        zone: "battlefield" as const,
        cell: `${"BCD"[index]}${player === "north" ? "1" : "1′"}` as Cell,
      },
      status: "open" as const,
      movementMarkers: 0,
      wounds: 0,
    })),
  ),
});

// Declaration commands do not roll dice; the engine also decides the UI's legal targets.
export function legalCommands(state: MatchState, card: string): Command[] {
  if (state.priorityPlayer === null) return [];
  const player = state.priorityPlayer;
  const candidates: Command[] = [
    { type: "defend", player, card },
    ...cells.map((to): Command => ({ type: "move", player, card, to })),
    ...state.cards
      .filter((target) => target.controller !== player)
      .map((target): Command => ({ type: "strike", player, card, target: target.id })),
  ];
  return candidates.filter((command) => applyCommand(state, command).ok);
}

export class BattleSession {
  state: MatchState;
  events: EngineEvent[] = [];
  error: string | null = null;

  constructor(
    private readonly initial = skirmishPosition,
    private readonly dice: DiceSource = () => 1 + Math.floor(Math.random() * 6),
  ) {
    this.state = initial;
  }

  get defenders(): string[] {
    const player = this.state.priorityPlayer;
    if (player === null) return [];
    return this.state.cards
      .filter((card) => applyCommand(this.state, { type: "defend", player, card: card.id }).ok)
      .map((card) => card.id);
  }

  command(command: Command): void {
    if (this.execute(command)) this.advance();
  }

  takeAttack(): void {
    if (this.defenders.length && this.pass()) this.advance();
  }

  endTurn(): void {
    if (this.state.outcome || this.state.stack.length || this.state.phase !== "main") return;
    if (this.pass() && this.pass()) this.advance();
  }

  restart(): void {
    this.state = this.initial;
    this.events = [];
    this.error = null;
  }

  private execute(command: Command): boolean {
    const result = applyCommand(this.state, command, this.dice);
    if (!result.ok) {
      this.error = result.reason.replaceAll("-", " ");
      return false;
    }
    this.state = result.state;
    this.events.push(...result.events);
    this.error = null;
    return true;
  }

  private pass(): boolean {
    const player = this.state.priorityPlayer;
    return player !== null && this.execute({ type: "pass", player });
  }

  private advance(): void {
    // This slice has one reaction: stop only when the opponent can assign a defender.
    for (let passes = 0; passes < 200; passes++) {
      if (this.state.outcome || this.defenders.length) return;
      if (!this.state.stack.length && this.state.phase === "main") return;
      if (!this.pass()) return;
    }
    throw new Error("Battle did not reach a player decision within 200 passes");
  }
}
