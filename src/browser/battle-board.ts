import Phaser from "phaser";
import { cells } from "../rules/board";
import type { CardInstance, Cell, Command } from "../rules/model";
import type { CombatPlayback, CombatStep } from "../battle/combat-playback";
import { CombatFeedback } from "./combat-feedback";
import { CreatureSprites } from "./creature-sprites";
import { creatureArt } from "./creature-art";
import { boardLayout, cardPosition, cellPosition, resizeBoard } from "./board-layout";

export function createBattleBoard(
  playback: CombatPlayback,
  clickTarget: (card: CardInstance | undefined, cell?: Cell) => void,
  changed: () => void,
) {
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
        if (!playback.busy) changed();
      }).observe(board);
      resizeScene();
      changed();
    }
  })({ key: "battle" });
  function changeArena(): void {
    ground.setTexture(arena, "terrain");
    ground.setPosition(180, boardLayout.height / 2);
    ground.setScale(
      Math.max(boardLayout.width / ground.frame.width, boardLayout.height / ground.frame.height),
    );
  }

  function render(
    selected: string | null,
    commands: readonly Command[],
    defenders: readonly string[],
  ): void {
    if (resizePending && !playback.busy) resizeScene();
    const state = playback.state;
    const bot = state.priorityPlayer === "south";
    const exchange = playback.exchange;
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
        marks
          .fillStyle(0x95d5b2)
          .fillRect(x - 21, y + 15, (42 * life) / definition.lifeAllowance, 6);
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

    if (
      exchange &&
      (playback.step?.animation === "attack" || playback.step?.animation === "heal")
    ) {
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
  }
  async function play(step: CombatStep): Promise<void> {
    await Promise.all([
      creatures.play(step, (id) => decorations.get(id) ?? []),
      feedback.play(step, playback.state, resolution),
    ]);
  }
  function reset(): void {
    arena = arenas[Math.floor(Math.random() * arenas.length)]!;
    changeArena();
    creatures.clear();
    feedback.clear();
    activePlayer = "north";
  }
  return { scene, render, play, reset };
}
