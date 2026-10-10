import Phaser from "phaser";
import { abilityPosition, BattleSession, cells, legalCommands } from "./battle-session";
import { CombatFeedback } from "./combat-feedback";
import { CombatPlayback } from "./combat-playback";
import { creatureArt } from "./creature-art";
import { CreatureSprites } from "./creature-sprites";
import { boardLayout, cardPosition, cellPosition, resizeBoard } from "./board-layout";
import { OpponentTurn } from "./opponent";
import type { CardInstance, Cell, Command, EngineEvent } from "./model";

const battle = new BattleSession(abilityPosition);
const playback = new CombatPlayback(
  battle,
  async (step) => {
    await Promise.all([
      creatures.play(step, (id) => decorations.get(id) ?? []),
      feedback.play(step, playback.state, resolution),
    ]);
  },
  render,
);
const opponent = new OpponentTurn(battle, "south", present, 400, () => !playback.busy);
let selected: string | null = null;
let abilityMode: "heal" | "shot" | null = null;
let resolution = 0;
let tiles: Phaser.GameObjects.Container;
let boardDetails: Phaser.GameObjects.Container;
let creatures: CreatureSprites;
let feedback: CombatFeedback;
let activePlayer = "north";
const decorations = new Map<string, Phaser.GameObjects.Container[]>();
const board = document.querySelector<HTMLElement>("#game")!;
const controls = document.querySelector<HTMLElement>("section")!;
const arenas = ["battlemap2_middleground", "battlemap0_middleground", "battlemap4_middleground"];
let arena = arenas[Math.floor(Math.random() * arenas.length)]!;
let ground: Phaser.GameObjects.Image;
let wash: Phaser.GameObjects.Rectangle;
let resizePending = false;
let resizeScene = () => {};
const scene = new (class extends Phaser.Scene {
  preload(): void {
    for (const arena of arenas) this.load.image(arena, `/arenas/${arena}.png`);
    for (const { asset } of Object.values(creatureArt))
      this.load.atlas(asset, `/creatures/${asset}.png`, `/creatures/${asset}.json`);
  }

  create(): void {
    // Crop transparent sky out of the placeholder art so terrain covers the frame.
    const terrainTop: Record<string, number> = {
      battlemap2_middleground: 168,
      battlemap0_middleground: 312,
      battlemap4_middleground: 0,
    };
    for (const arena of arenas) {
      const texture = this.textures.get(arena);
      const image = texture.getSourceImage();
      const top = terrainTop[arena]!;
      texture.add("terrain", 0, image.width / 4, top, image.width / 2, image.height - top);
    }
    ground = this.add.image(180, boardLayout.height / 2, arena).setDepth(-2);
    changeArena();
    wash = this.add
      .rectangle(180, boardLayout.height / 2, 360, boardLayout.height, 0x101923, 0.35)
      .setDepth(-1);
    tiles = this.add.container(0, 0);
    boardDetails = this.add.container(0, 0).setDepth(2);
    creatures = new CreatureSprites(
      this,
      (id) => clickTarget(playback.state.cards.find((card) => card.id === id)),
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    feedback = new CombatFeedback(
      this,
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    resizeScene = () => {
      if (playback.busy) {
        resizePending = true;
        return;
      }
      resizePending = false;
      resizeBoard(
        board.clientWidth,
        board.clientHeight,
        board.clientHeight - controls.clientHeight,
      );
      resolution = (window.devicePixelRatio * board.clientWidth) / boardLayout.width;
      this.scale.resize(
        Math.ceil(board.clientWidth * window.devicePixelRatio),
        Math.ceil(board.clientHeight * window.devicePixelRatio),
      );
      this.game.canvas.style.width = `${board.clientWidth}px`;
      this.game.canvas.style.height = `${board.clientHeight}px`;
      this.scale.refresh();
      this.cameras.main.setZoom(resolution).centerOn(180, boardLayout.height / 2);
      wash.setPosition(180, boardLayout.height / 2).setSize(360, boardLayout.height);
      changeArena();
    };
    new ResizeObserver(() => {
      resizeScene();
      if (!playback.busy) render();
    }).observe(board);
    resizeScene();
    render();
  }
})({ key: "battle" });
const status = document.querySelector<HTMLElement>("#status")!;
const inspection = document.querySelector<HTMLElement>("#inspection")!;
const prompt = document.querySelector<HTMLElement>("#prompt")!;
const log = document.querySelector<HTMLElement>("#log")!;
const shot = document.querySelector<HTMLButtonElement>("#shot")!;
const heal = document.querySelector<HTMLButtonElement>("#heal")!;
const endTurn = document.querySelector<HTMLButtonElement>("#end-turn")!;
const takeAttack = document.querySelector<HTMLButtonElement>("#take-attack")!;
const prepareFlight = document.querySelector<HTMLButtonElement>("#prepare-flight")!;
const actionMenu = document.querySelector<HTMLElement>("#action-menu")!;
const actionsToggle = document.querySelector<HTMLButtonElement>("#actions-toggle")!;
const creatureInfo = document.querySelector<HTMLDetailsElement>("#creature-info")!;
const history = document.querySelector<HTMLDetailsElement>("#history")!;
const selectedName = document.querySelector<HTMLElement>("#selected-name")!;
const settings = document.querySelector<HTMLDetailsElement>("#settings")!;
settings.ontoggle = () => {
  if (settings.open) {
    closeActions();
    creatureInfo.open = false;
  }
};

function closeActions(): void {
  actionMenu.hidden = true;
  actionsToggle.setAttribute("aria-expanded", "false");
  actionsToggle.setAttribute("aria-label", "Open battle actions");
  history.open = false;
}
actionsToggle.onclick = () => {
  settings.open = false;
  creatureInfo.open = false;
  actionMenu.hidden = !actionMenu.hidden;
  actionsToggle.setAttribute("aria-expanded", String(!actionMenu.hidden));
  actionsToggle.setAttribute(
    "aria-label",
    actionMenu.hidden ? "Open battle actions" : "Close battle actions",
  );
};
creatureInfo.ontoggle = () => {
  if (creatureInfo.open) {
    closeActions();
    settings.open = false;
  }
};
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (settings.open) {
      settings.open = false;
      settings.querySelector("summary")!.focus();
      return;
    }
    closeActions();
    creatureInfo.open = false;
    actionsToggle.focus();
  }
});

function changeArena(): void {
  ground.setTexture(arena, "terrain");
  ground.setPosition(180, boardLayout.height / 2);
  ground.setScale(
    Math.max(boardLayout.width / ground.frame.width, boardLayout.height / ground.frame.height),
  );
}

function name(id: string): string {
  const card = battle.state.cards.find((candidate) => candidate.id === id)!;
  return `${card.controller} ${battle.state.definitions.find((definition) => definition.id === card.definition)!.name}`;
}

function describe(event: EngineEvent): string | null {
  switch (event.type) {
    case "moved":
      return `${name(event.card)} moved ${event.from} → ${event.to}.`;
    case "prepared-flight":
      return `${name(event.card)} prepared an air strike for next turn.`;
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
  closeActions();
  creatureInfo.open = false;
  battle.command(command);
  abilityMode = null;
  present();
}

function clickTarget(occupant: CardInstance | undefined, cell?: Cell): void {
  settings.open = false;
  closeActions();
  creatureInfo.open = false;
  if (playback.busy || battle.state.priorityPlayer !== "north") return;
  if (occupant && battle.defenders.includes(occupant.id)) {
    act({ type: "defend", player: occupant.controller, card: occupant.id });
    return;
  }
  const command = selected
    ? legalCommands(battle.state, selected).find((candidate) =>
        abilityMode
          ? candidate.type === abilityMode && candidate.target === occupant?.id
          : (candidate.type === "move" && candidate.to === cell) ||
            (candidate.type === "strike" && candidate.target === occupant?.id),
      )
    : undefined;
  if (command) act(command);
  else {
    selected = occupant?.id ?? null;
    abilityMode = null;
    render();
  }
}

function cardText(card: CardInstance): string {
  const definition = playback.state.definitions.find(
    (candidate) => candidate.id === card.definition,
  )!;
  return `${definition.name}\n${Math.max(0, definition.lifeAllowance - card.wounds)} life\n${card.status === "closed" ? "Action spent" : definition.flight ? "Flight" : `${definition.movementAllowance - card.movementMarkers} move`}`;
}

function render(): void {
  if (resizePending && !playback.busy) resizeScene();
  const state = playback.state;
  const defenders = battle.defenders;
  const card = state.cards.find((candidate) => candidate.id === selected);
  const bot = state.priorityPlayer === "south";
  const exchange = playback.exchange;
  const available = selected && !bot && !playback.busy ? legalCommands(state, selected) : [];
  const commands = available.filter((command) =>
    abilityMode ? command.type === abilityMode : command.type !== "heal" && command.type !== "shot",
  );
  boardDetails.removeAll(true);
  tiles.removeAll(true);
  decorations.clear();
  if (!playback.busy) creatures.sync(state);
  const positions = [
    ...cells.map((cell) => ({
      cell,
      card: state.cards.find(
        (candidate) =>
          candidate.location.zone === "battlefield" && candidate.location.cell === cell,
      ),
      ...cellPosition(cell),
    })),
    ...state.cards
      .filter((card) => card.location.zone === "additional")
      .map((card) => ({ cell: undefined, card, ...cardPosition(card)! })),
  ];
  positions.forEach(({ cell, card, x, y }) => {
    const healing = commands.some(
      (command) => command.type === "heal" && command.target === card?.id,
    );
    const move =
      commands.some((command) => command.type === "move" && command.to === cell) ||
      (playback.step?.animation === "move" &&
        playback.step.actors.some((actor) => actor.to === cell));
    const attack = commands.some(
      (command) =>
        (command.type === "strike" || command.type === "shot") && command.target === card?.id,
    );
    const defend = !playback.busy && !bot && card && defenders.includes(card.id);
    const color = card ? (card.controller === "north" ? 0x234867 : 0x693b2f) : 0x202a32;
    const source = Boolean(card && exchange && card.id === exchange.source);
    const target = Boolean(card && exchange && card.id === exchange.target);
    const emphasized = Boolean(
      source || target || move || healing || attack || defend || card?.id === selected,
    );
    const ringColor = source
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
                : card?.controller === "north"
                  ? 0x6cb8ef
                  : 0xe3936c;
    const tile = scene.add
      .rectangle(
        x,
        y,
        cell ? boardLayout.cellWidth : 72,
        cell ? boardLayout.cellHeight : 64,
        color,
        cell ? (card ? 0.12 : 0.04) : 0,
      )
      .setStrokeStyle(1, 0x53616b, cell ? 0.3 : 0)
      .setInteractive({ useHandCursor: true })
      .on("pointerup", () => clickTarget(card, cell));
    tiles.add(tile);
    const groundMarks = card || emphasized ? scene.add.container(0, 0) : null;
    if (groundMarks) tiles.add(groundMarks);
    if (card) groundMarks!.add(scene.add.ellipse(x, y + 5, 38, 12, 0x000000, 0.35));
    if (groundMarks)
      groundMarks.add([
        scene.add.ellipse(x, y + 6, 44, 18).setStrokeStyle(emphasized ? 5 : 3, 0x101923, 0.8),
        scene.add
          .ellipse(x, y + 6, 44, 18, ringColor, emphasized ? 0.14 : 0.04)
          .setStrokeStyle(emphasized ? 3 : 1.5, ringColor, emphasized ? 1 : 0.7),
      ]);
    if (card) {
      const details = scene.add.container(0, 0);
      boardDetails.add(details);
      decorations.set(card.id, [groundMarks!, details]);
      const definition = state.definitions.find((candidate) => candidate.id === card.definition)!;
      if (definition.flight)
        details.add(
          scene.add
            .text(x, y + 29, "Flight", { fontSize: "10px", color: "#b7c5ce", resolution })
            .setOrigin(0.5),
        );
      const armor = definition.abilities?.armor;
      const marks = scene.add.graphics();
      details.add(marks);
      if (armor) {
        marks.fillStyle(0x18212b).lineStyle(1.5, 0x95d5b2);
        marks.beginPath();
        marks.moveTo(x + 15, y - 17);
        marks.lineTo(x + 24, y - 17);
        marks.lineTo(x + 24, y - 7);
        marks.lineTo(x + 19.5, y - 2);
        marks.lineTo(x + 15, y - 7);
        marks.closePath();
        marks.fillPath().strokePath();
        details.add(
          scene.add
            .text(x + 19.5, y - 10, `${Math.max(0, armor - (card.armorSpent ?? 0))}`, {
              fontSize: "10px",
              fontFamily: "sans-serif",
              color: "#95d5b2",
              resolution,
            })
            .setOrigin(0.5),
        );
      }
      if (card.status === "closed") {
        marks.lineStyle(2.5, 0xf5f1e8);
        marks.beginPath();
        marks.moveTo(x + 17, y + 3);
        marks.lineTo(x + 22, y + 8);
        marks.lineTo(x + 24, y - 2);
        marks.strokePath();
      } else {
        for (let i = 0; i < definition.movementAllowance; i++) {
          const pipX = x + (i - (definition.movementAllowance - 1) / 2) * 9;
          marks.lineStyle(1.5, 0xf5f1e8).strokeCircle(pipX, y + 10, 2.5);
          if (i < definition.movementAllowance - card.movementMarkers)
            marks.fillStyle(0xf5f1e8).fillCircle(pipX, y + 10, 2.5);
        }
      }
      const life = Math.max(0, definition.lifeAllowance - card.wounds);
      marks.fillStyle(0x18212b).fillRect(x - 21, y + 15, 42, 6);
      marks.fillStyle(0x95d5b2).fillRect(x - 21, y + 15, (42 * life) / definition.lifeAllowance, 6);
      details.add(
        scene.add
          .text(x, y + 18, String(life), {
            fontSize: "10px",
            fontFamily: "sans-serif",
            resolution,
            color: "#ffffff",
            stroke: "#18212b",
            strokeThickness: 3,
          })
          .setOrigin(0.5),
      );
    }
  });

  if (exchange && (playback.step?.animation === "attack" || playback.step?.animation === "heal")) {
    const position = (id: string) => {
      const card = state.cards.find((card) => card.id === id);
      return card ? cardPosition(card) : null;
    };
    const from = position(exchange.source);
    const to = position(exchange.target);
    if (from && to)
      boardDetails.add(
        scene.add
          .graphics()
          .lineStyle(2, 0xf5f1e8, 0.8)
          .lineBetween(from.x, from.y + 3, to.x, to.y + 3),
      );
  }
  if (!playback.busy && activePlayer !== state.activePlayer) {
    activePlayer = state.activePlayer;
    if (activePlayer === "north" && !state.outcome) feedback.yourTurn(state);
  }

  status.textContent = playback.busy
    ? playback.step?.animation === "move"
      ? "Moving…"
      : playback.step?.animation === "heal"
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
      ? playback.step?.animation === "move"
        ? `${name(playback.step.actors[0]!.card)} moves ${playback.step.actors[0]!.from} → ${playback.step.actors[0]!.to}.`
        : exchange
          ? `${name(exchange.source)} → ${name(exchange.target)}`
          : "Watch the attack resolve."
      : state.outcome
        ? "Battle finished. Restart to play again."
        : bot
          ? "You control north. South plays automatically."
          : defenders.length
            ? "Tap a gold creature to defend, or take the attack."
            : abilityMode === "shot"
              ? "Tap a red enemy to shoot. No counterstrike or defender. Archer closes."
              : abilityMode === "heal"
                ? "Tap a green ally to heal. Ward closes after healing."
                : card && state.definitions.find((def) => def.id === card.definition)?.flight
                  ? "Flight: tap a red enemy on the battlefield or air zone to strike."
                  : "North: tap a creature, then green to move or red to attack.");
  const armor = card
    ? state.definitions.find((def) => def.id === card.definition)?.abilities?.armor
    : undefined;
  const healing = card
    ? state.definitions.find((def) => def.id === card.definition)?.abilities?.heal
    : undefined;
  const shooting = card
    ? state.definitions.find((def) => def.id === card.definition)?.abilities?.shot
    : undefined;
  prepareFlight.hidden = !available.some((command) => command.type === "prepare-flight");
  shot.hidden = !shooting || bot || defenders.length > 0;
  shot.disabled = playback.busy || !available.some((command) => command.type === "shot");
  shot.querySelector("span")!.textContent =
    abilityMode === "shot" ? "Cancel shot" : `Shot ${shooting?.strength.join("/") ?? "1/2/3"}`;
  shot.setAttribute("aria-pressed", String(abilityMode === "shot"));
  heal.hidden = !healing || bot || defenders.length > 0;
  heal.disabled = playback.busy || !available.some((command) => command.type === "heal");
  heal.querySelector("span")!.textContent =
    abilityMode === "heal" ? "Cancel heal" : `Heal ${healing ?? 2}`;
  heal.setAttribute("aria-pressed", String(abilityMode === "heal"));
  inspection.textContent = card
    ? `${name(card.id)} · ${cardText(card).split("\n").slice(1).join(" · ")}${armor ? ` · Armor ${Math.max(0, armor - (card.armorSpent ?? 0))}/${armor}` : ""}${healing ? ` · Close: heal an adjacent wounded ally for ${healing}` : ""}${shooting ? ` · Close: Shot ${shooting.strength.join("/")} · Range ${shooting.range}` : ""} · ${card.location.zone === "battlefield" ? card.location.cell : card.location.zone === "additional" ? "Air zone" : "Graveyard"}${card.flightStrike === "pending" ? " · Air strike next turn" : card.flightStrike === "ready" ? " · Air strike ready this turn" : ""} · strike ${state.definitions.find((definition) => definition.id === card.definition)!.simpleStrike.join("/")}${card.location.zone === "graveyard" ? " · dead" : ""}`
    : "Tap any creature to inspect it.";
  selectedName.textContent = card
    ? state.definitions.find((definition) => definition.id === card.definition)!.name
    : "Tap a creature";
  prompt.hidden =
    !battle.error && !playback.busy && !state.outcome && !defenders.length && !abilityMode;
  actionsToggle.disabled = playback.busy;
  if (playback.busy || defenders.length || state.outcome) closeActions();
  endTurn.hidden = !playback.busy && !bot && defenders.length > 0;
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

shot.onclick = () => {
  if (shot.disabled || playback.busy) return;
  closeActions();
  abilityMode = abilityMode === "shot" ? null : "shot";
  render();
};
heal.onclick = () => {
  if (heal.disabled || playback.busy) return;
  closeActions();
  abilityMode = abilityMode === "heal" ? null : "heal";
  render();
};
endTurn.onclick = () => {
  if (playback.busy || battle.state.priorityPlayer !== "north") return;
  closeActions();
  creatureInfo.open = false;
  battle.decide({ type: "end-turn" });
  selected = null;
  abilityMode = null;
  present();
};
takeAttack.onclick = () => {
  if (playback.busy || battle.state.priorityPlayer !== "north") return;
  closeActions();
  creatureInfo.open = false;
  battle.decide({ type: "take-attack" });
  present();
};
prepareFlight.onclick = () => {
  if (!selected || playback.busy) return;
  act({ type: "prepare-flight", player: "north", card: selected });
};
document.querySelector<HTMLButtonElement>("#restart")!.onclick = () => {
  settings.open = false;
  closeActions();
  creatureInfo.open = false;
  opponent.cancel();
  arena = arenas[Math.floor(Math.random() * arenas.length)]!;
  changeArena();
  battle.restart();
  selected = null;
  abilityMode = null;
  creatures.clear();
  feedback.clear();
  activePlayer = "north";
  playback.reset();
};

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 360,
  height: 700,
  backgroundColor: "#18212b",
  // Native controls overlay the board; their events must not target canvas cells.
  input: { windowEvents: false },
  scale: { mode: Phaser.Scale.NONE },
  scene,
});
