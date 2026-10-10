import { BattleHarness } from "./battle-harness";
import { demoPosition } from "./positions";

export function playDemo(): BattleHarness {
  const battle = new BattleHarness(demoPosition, [4, 2, 6, 6]);
  battle.command({ type: "move", player: "north", card: "fighter", to: "B1" }).resolveStack();
  battle.command({ type: "strike", player: "north", card: "fighter", target: "ward" });
  battle.pass().pass().pass();
  battle.command({ type: "defend", player: "south", card: "guard" }).resolveStack();
  // Three pairs of empty-stack passes reach the next player's Main Phase.
  battle.pass().pass().pass().pass().pass().pass();
  battle
    .command({ type: "strike", player: "south", card: "ward", target: "fighter" })
    .resolveStack();
  battle.pass().pass().pass().pass().pass().pass();
  battle
    .command({ type: "strike", player: "north", card: "fighter", target: "ward" })
    .resolveStack();
  battle.assertDiceConsumed();
  return battle;
}

if (import.meta.main) {
  const battle = playDemo();
  for (const [index, entry] of battle.trace.entries())
    console.log(JSON.stringify({ step: index + 1, ...entry }));
  console.log(JSON.stringify({ outcome: battle.state.outcome, cards: battle.state.cards }));
}
