import Phaser from "phaser";
import { abilityPosition, BattleSession, cells, legalCommands } from "./battle-session";
import { CombatFeedback } from "./combat-feedback";
import { CombatPlayback } from "./combat-playback";
import { creatureArt } from "./creature-art";
import { CreatureSprites, cellPosition } from "./creature-sprites";
import { OpponentTurn } from "./opponent";
import type { CardInstance, Cell, Command, EngineEvent } from "./model";

const battle = new BattleSession(abilityPosition);
const playback = new CombatPlayback(
  battle,
  async (step) => {
    await Promise.all([creatures.play(step), feedback.play(step, playback.state, resolution)]);
  },
  render,
);
const opponent = new OpponentTurn(battle, "south", present, 400, () => !playback.busy);
let selected: string | null = null;
let healMode = false;
let resolution = 0;
let tiles: Phaser.GameObjects.Container;
let boardDetails: Phaser.GameObjects.Container;
let creatures: CreatureSprites;
let feedback: CombatFeedback;
let activePlayer = "north";
const board = document.querySelector<HTMLElement>("#game")!;
const scene = new (class extends Phaser.Scene {
  preload(): void {
    for (const { asset } of Object.values(creatureArt))
      this.load.atlas(asset, `/creatures/${asset}.png`, `/creatures/${asset}.json`);
  }

  create(): void {
    tiles = this.add.container(0, 0);
    boardDetails = this.add.container(0, 0).setDepth(2);
    creatures = new CreatureSprites(this);
    feedback = new CombatFeedback(
      this,
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
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
const heal = document.querySelector<HTMLButtonElement>("#heal")!;
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
    case "healed":
      return `${name(event.source)} healed ${name(event.card)} for ${event.amount}.`;
    case "prevented":
      return `${name(event.card)} armor prevented ${event.amount}.`;
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

function present(): void {
  void playback.update().catch((error: unknown) => {
    console.error(error);
    prompt.textContent = "Animation failed. You can continue or restart.";
  });
}

function act(command: Command): void {
  battle.command(command);
  healMode = false;
  present();
}

function clickCell(cell: Cell): void {
  if (playback.busy || battle.state.priorityPlayer !== "north") return;
  const occupant = battle.state.cards.find(
    (card) => card.location.zone === "battlefield" && card.location.cell === cell,
  );
  if (occupant && battle.defenders.includes(occupant.id)) {
    act({ type: "defend", player: occupant.controller, card: occupant.id });
    return;
  }
  const command = selected
    ? legalCommands(battle.state, selected).find((candidate) =>
        healMode
          ? candidate.type === "heal" && candidate.target === occupant?.id
          : (candidate.type === "move" && candidate.to === cell) ||
            (candidate.type === "strike" && candidate.target === occupant?.id),
      )
    : undefined;
  if (command) act(command);
  else {
    selected = occupant?.id ?? null;
    healMode = false;
    render();
  }
}

function cardText(card: CardInstance): string {
  const definition = playback.state.definitions.find(
    (candidate) => candidate.id === card.definition,
  )!;
  return `${definition.name}\n${Math.max(0, definition.lifeAllowance - card.wounds)} life\n${card.status === "closed" ? "CLOSED" : `${definition.movementAllowance - card.movementMarkers} move`}`;
}

function render(): void {
  const state = playback.state;
  const defenders = battle.defenders;
  const bot = state.priorityPlayer === "south";
  const exchange = playback.exchange;
  const available = selected && !bot && !playback.busy ? legalCommands(state, selected) : [];
  const commands = available.filter((command) =>
    healMode ? command.type === "heal" : command.type !== "heal",
  );
  boardDetails.removeAll(true);
  tiles.removeAll(true);
  if (!playback.busy) creatures.sync(state);
  cells.forEach((cell) => {
    const { x, y } = cellPosition(cell);
    const card = state.cards.find(
      (candidate) => candidate.location.zone === "battlefield" && candidate.location.cell === cell,
    );
    const healing = commands.some(
      (command) => command.type === "heal" && command.target === card?.id,
    );
    const move = commands.some((command) => command.type === "move" && command.to === cell);
    const attack = commands.some(
      (command) => command.type === "strike" && command.target === card?.id,
    );
    const defend = !playback.busy && !bot && card && defenders.includes(card.id);
    const color = card ? (card.controller === "north" ? 0x234867 : 0x693b2f) : 0x202a32;
    const source = Boolean(card && exchange && card.id === exchange.source);
    const target = Boolean(card && exchange && card.id === exchange.target);
    const border = source
      ? 0x95d5b2
      : target
        ? playback.step?.animation === "heal"
          ? 0x95d5b2
          : 0xff8b75
        : defend
          ? 0xffd166
          : attack
            ? 0xff8b75
            : move || healing
              ? 0x95d5b2
              : card?.id === selected
                ? 0xffffff
                : 0x53616b;
    const tile = scene.add
      .rectangle(x, y, 68, 68, color)
      .setStrokeStyle(
        source || target || move || healing || attack || defend || card?.id === selected ? 3 : 1,
        border,
      )
      .setInteractive({ useHandCursor: true })
      .on("pointerup", () => clickCell(cell));
    tiles.add(tile);
    boardDetails.add(
      scene.add.text(x - 30, y - 30, cell, {
        fontSize: "10px",
        fontFamily: "sans-serif",
        color: "#b7c5ce",
        resolution,
      }),
    );
    if (card) {
      const definition = state.definitions.find((candidate) => candidate.id === card.definition)!;
      const armor = definition.abilities?.armor;
      if (armor)
        boardDetails.add(
          scene.add
            .text(x + 30, y - 30, `A${Math.max(0, armor - (card.armorSpent ?? 0))}`, {
              fontSize: "10px",
              fontFamily: "sans-serif",
              color: "#95d5b2",
              backgroundColor: "#18212b",
              resolution,
            })
            .setOrigin(1, 0),
        );
      const badge = `${Math.max(0, definition.lifeAllowance - card.wounds)}HP ${card.status === "closed" ? "CLOSED" : `${definition.movementAllowance - card.movementMarkers}MP`}`;
      boardDetails.add(
        scene.add
          .text(x, y + 26, badge, {
            fontSize: "10px",
            fontFamily: "sans-serif",
            resolution,
            color: "#ffffff",
            backgroundColor: "#18212b",
          })
          .setOrigin(0.5),
      );
    }
  });

  if (exchange && (playback.step?.animation === "attack" || playback.step?.animation === "heal")) {
    const position = (id: string) => {
      const card = state.cards.find((card) => card.id === id);
      return card?.location.zone === "battlefield" ? cellPosition(card.location.cell) : null;
    };
    const from = position(exchange.source);
    const to = position(exchange.target);
    if (from && to)
      boardDetails.add(
        scene.add
          .graphics()
          .lineStyle(2, 0xf5f1e8, 0.8)
          .lineBetween(from.x, from.y + 15, to.x, to.y + 15),
      );
  }
  if (!playback.busy && activePlayer !== state.activePlayer) {
    activePlayer = state.activePlayer;
    if (activePlayer === "north" && !state.outcome) feedback.yourTurn(state);
  }

  status.textContent = playback.busy
    ? playback.step?.animation === "heal"
      ? "Healing…"
      : "Resolving attack…"
    : state.outcome
      ? state.outcome.kind === "win"
        ? state.outcome.winner === "north"
          ? "You win"
          : "Opponent wins"
        : "Draw"
      : bot
        ? "Opponent’s turn"
        : defenders.length
          ? "Choose a defender"
          : state.activePlayer === "north"
            ? "Your turn"
            : "Opponent’s turn";
  prompt.textContent =
    battle.error ??
    (playback.busy
      ? exchange
        ? `${name(exchange.source)} → ${name(exchange.target)}`
        : "Watch the attack resolve."
      : state.outcome
        ? "Battle finished. Restart to play again."
        : bot
          ? "You control north. South plays automatically."
          : defenders.length
            ? "Tap a gold creature to defend, or take the attack."
            : healMode
              ? "Tap a green ally to heal. Ward closes after healing."
              : "North: tap a creature, then green to move or red to attack.");
  const card = state.cards.find((candidate) => candidate.id === selected);
  const armor = card
    ? state.definitions.find((def) => def.id === card.definition)?.abilities?.armor
    : undefined;
  const healing = card
    ? state.definitions.find((def) => def.id === card.definition)?.abilities?.heal
    : undefined;
  heal.hidden = !healing || bot || defenders.length > 0;
  heal.disabled = playback.busy || !available.some((command) => command.type === "heal");
  heal.textContent = healMode ? "Cancel heal" : `Heal ${healing ?? 2}`;
  heal.setAttribute("aria-pressed", String(healMode));
  inspection.textContent = card
    ? `${name(card.id)} · ${cardText(card).split("\n").slice(1).join(" · ")}${armor ? ` · Armor ${Math.max(0, armor - (card.armorSpent ?? 0))}/${armor}` : ""}${healing ? ` · Close: heal an adjacent wounded ally for ${healing}` : ""} · strike ${state.definitions.find((definition) => definition.id === card.definition)!.simpleStrike.join("/")}${card.location.zone === "graveyard" ? " · dead" : ""}`
    : "Tap any creature to inspect it.";
  endTurn.disabled = Boolean(playback.busy || bot || state.outcome || state.stack.length);
  takeAttack.hidden = playback.busy || bot || !defenders.length;

  log.textContent =
    battle.events
      .slice(0, playback.eventCount)
      .map(describe)
      .filter((line) => line !== null)
      .slice(-4)
      .reverse()
      .join(" · ") || "No actions yet.";
  opponent.update();
}

heal.onclick = () => {
  if (heal.disabled || playback.busy) return;
  healMode = !healMode;
  render();
};
endTurn.onclick = () => {
  if (playback.busy || battle.state.priorityPlayer !== "north") return;
  battle.decide({ type: "end-turn" });
  selected = null;
  healMode = false;
  present();
};
takeAttack.onclick = () => {
  if (playback.busy || battle.state.priorityPlayer !== "north") return;
  battle.decide({ type: "take-attack" });
  present();
};
document.querySelector<HTMLButtonElement>("#restart")!.onclick = () => {
  opponent.cancel();
  battle.restart();
  selected = null;
  healMode = false;
  creatures.clear();
  feedback.clear();
  activePlayer = "north";
  playback.reset();
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
