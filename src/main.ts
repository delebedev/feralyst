import Phaser from "phaser";
import { BattleSession, cells, legalCommands } from "./battle-session";
import type { CardInstance, Cell, Command, EngineEvent } from "./model";

const battle = new BattleSession();
let selected: string | null = null;
let resolution = 0;
const board = document.querySelector<HTMLElement>("#game")!;
const scene = new (class extends Phaser.Scene {
  create(): void {
    const resize = () => {
      const nextResolution = Math.max(
        1,
        window.devicePixelRatio * Math.min(board.clientWidth / 360, board.clientHeight / 432),
      );
      if (nextResolution === resolution) {
        this.scale.refresh();
        return;
      }
      resolution = nextResolution;
      this.scale.resize(Math.ceil(360 * resolution), Math.ceil(432 * resolution));
      this.cameras.main.setZoom(resolution).centerOn(180, 216);
      render();
    };
    new ResizeObserver(resize).observe(board);
    resize();
  }
})({ key: "battle" });
const status = document.querySelector<HTMLElement>("#status")!;
const inspection = document.querySelector<HTMLElement>("#inspection")!;
const prompt = document.querySelector<HTMLElement>("#prompt")!;
const log = document.querySelector<HTMLElement>("#log")!;
const endTurn = document.querySelector<HTMLButtonElement>("#end-turn")!;
const takeAttack = document.querySelector<HTMLButtonElement>("#take-attack")!;

function name(id: string): string {
  const card = battle.state.cards.find((candidate) => candidate.id === id)!;
  return `${card.controller} ${battle.state.definitions.find((definition) => definition.id === card.definition)!.name}`;
}

function describe(event: EngineEvent): string | null {
  switch (event.type) {
    case "moved":
      return `${name(event.card)} moved ${event.from} → ${event.to}.`;
    case "rolled":
      return `${name(event.card)} rolled ${event.value}.`;
    case "wounded":
      return `${name(event.card)} took ${event.amount} damage.`;
    case "destroyed":
      return `${name(event.card)} died.`;
    case "redirected":
      return `${name(event.to)} defended ${name(event.from)}.`;
    default:
      return null;
  }
}

function act(command: Command): void {
  battle.command(command);
  render();
}

function clickCell(cell: Cell): void {
  const occupant = battle.state.cards.find(
    (card) => card.location.zone === "battlefield" && card.location.cell === cell,
  );
  if (occupant && battle.defenders.includes(occupant.id)) {
    act({ type: "defend", player: occupant.controller, card: occupant.id });
    return;
  }
  const command = selected
    ? legalCommands(battle.state, selected).find(
        (candidate) =>
          (candidate.type === "move" && candidate.to === cell) ||
          (candidate.type === "strike" && candidate.target === occupant?.id),
      )
    : undefined;
  if (command) act(command);
  else {
    selected = occupant?.id ?? null;
    render();
  }
}

function cardText(card: CardInstance): string {
  const definition = battle.state.definitions.find(
    (candidate) => candidate.id === card.definition,
  )!;
  return `${definition.name}\n${definition.lifeAllowance - card.wounds} life\n${card.status === "closed" ? "CLOSED" : `${definition.movementAllowance - card.movementMarkers} move`}`;
}

function render(): void {
  const state = battle.state;
  const defenders = battle.defenders;
  const commands = selected ? legalCommands(state, selected) : [];
  scene.children.removeAll(true);
  cells.forEach((cell, index) => {
    const x = (index % 5) * 72 + 36;
    const y = Math.floor(index / 5) * 72 + 36;
    const card = state.cards.find(
      (candidate) => candidate.location.zone === "battlefield" && candidate.location.cell === cell,
    );
    const move = commands.some((command) => command.type === "move" && command.to === cell);
    const attack = commands.some(
      (command) => command.type === "strike" && command.target === card?.id,
    );
    const defend = card && defenders.includes(card.id);
    const color = card ? (card.controller === "north" ? 0x234867 : 0x693b2f) : 0x202a32;
    const border = defend
      ? 0xffd166
      : attack
        ? 0xff8b75
        : move
          ? 0x95d5b2
          : card?.id === selected
            ? 0xffffff
            : 0x53616b;
    scene.add
      .rectangle(x, y, 68, 68, color)
      .setStrokeStyle(move || attack || defend || card?.id === selected ? 3 : 1, border)
      .setInteractive({ useHandCursor: true })
      .on("pointerup", () => clickCell(cell));
    scene.add.text(x - 30, y - 30, cell, {
      fontSize: "10px",
      fontFamily: "sans-serif",
      color: "#b7c5ce",
      resolution,
    });
    if (card)
      scene.add
        .text(x, y + 4, cardText(card), {
          fontSize: "13px",
          fontFamily: "sans-serif",
          resolution,
          color: "#ffffff",
          align: "center",
          lineSpacing: 3,
        })
        .setOrigin(0.5)
        .setAlpha(card.status === "closed" ? 0.65 : 1);
  });

  status.textContent = state.outcome
    ? state.outcome.kind === "win"
      ? `${state.outcome.winner} wins`
      : "Draw"
    : defenders.length
      ? `${state.priorityPlayer}: choose a defender`
      : `${state.activePlayer}'s turn`;
  prompt.textContent =
    battle.error ??
    (state.outcome
      ? "Battle finished. Restart to play again."
      : defenders.length
        ? "Tap a gold creature to defend, or take the attack."
        : "Both sides: tap a creature, then green to move or red to attack.");
  const card = state.cards.find((candidate) => candidate.id === selected);
  inspection.textContent = card
    ? `${name(card.id)} · ${cardText(card).split("\n").slice(1).join(" · ")} · strike ${state.definitions.find((definition) => definition.id === card.definition)!.simpleStrike.join("/")}${card.location.zone === "graveyard" ? " · dead" : ""}`
    : "Tap any creature to inspect it.";
  endTurn.disabled = Boolean(state.outcome || state.stack.length);
  takeAttack.hidden = !defenders.length;

  log.textContent =
    battle.events
      .map(describe)
      .filter((line) => line !== null)
      .slice(-4)
      .reverse()
      .join(" · ") || "No actions yet.";
}

endTurn.onclick = () => {
  battle.endTurn();
  selected = null;
  render();
};
takeAttack.onclick = () => {
  battle.takeAttack();
  render();
};
document.querySelector<HTMLButtonElement>("#restart")!.onclick = () => {
  battle.restart();
  selected = null;
  render();
};

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 360,
  height: 432,
  backgroundColor: "#18212b",
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene,
});
