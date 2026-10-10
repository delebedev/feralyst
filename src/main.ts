import Phaser from "phaser";
import { BattleSession } from "./battle/battle-session";
import { abilityPosition } from "./battle/positions";
import { CombatPlayback } from "./battle/combat-playback";
import { OpponentTurn } from "./battle/opponent";
import { createBattleBoard } from "./browser/battle-board";
import { createBattleControls } from "./browser/battle-controls";

const battle = new BattleSession(abilityPosition);
const playback = new CombatPlayback(battle, (step) => board.play(step), render);
const opponent = new OpponentTurn(battle, "south", present, 400, () => !playback.busy);
const controls = createBattleControls(battle, playback, render, present, restart);
const board = createBattleBoard(playback, controls.clickTarget, render);

function render(): void {
  const { selected, commands, defenders } = controls.render();
  board.render(selected, commands, defenders);
  opponent.update();
}
function present(): void {
  void playback.update().catch((error: unknown) => {
    console.error(error);
    controls.animationFailed();
  });
}
function restart(): void {
  opponent.cancel();
  battle.restart();
  controls.reset();
  board.reset();
  playback.reset();
}
new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 360,
  height: 700,
  backgroundColor: "#18212b",
  // Native controls overlay the board; their events must not target canvas cells.
  input: { windowEvents: false },
  scale: { mode: Phaser.Scale.NONE },
  scene: board.scene,
});
