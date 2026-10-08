import { BattleHarness } from "./battle-harness";
import { createBattle } from "./engine";
import type { CardInstance, Cell } from "./model";

function card(id: string, definition: string, player: string, cell: Cell): CardInstance {
  return { id, definition, owner: player, controller: player, location: { zone: "battlefield", cell },
    status: "open", movementMarkers: 0, wounds: 0 };
}

// Synthetic creatures isolate the ordinary rules from card-specific abilities.
export const demoPosition = createBattle({
  players: ["north", "south"], activePlayer: "north",
  definitions: [
    { id: "fighter", name: "Fighter", movementAllowance: 2, lifeAllowance: 6, simpleStrike: [2, 3, 4] },
    { id: "guard", name: "Guard", movementAllowance: 1, lifeAllowance: 3, simpleStrike: [1, 2, 3] },
    { id: "ward", name: "Ward", movementAllowance: 2, lifeAllowance: 2, simpleStrike: [1, 1, 2] },
  ],
  cards: [card("fighter", "fighter", "north", "B2"), card("guard", "guard", "south", "C2"),
    card("ward", "ward", "south", "C1")],
});

export function playDemo(): BattleHarness {
  const battle = new BattleHarness(demoPosition, [4, 2, 6, 6]);
  battle.command({ type: "move", player: "north", card: "fighter", to: "B1" }).resolveStack();
  battle.command({ type: "strike", player: "north", card: "fighter", target: "ward" });
  battle.pass().pass().pass();
  battle.command({ type: "defend", player: "south", card: "guard" }).resolveStack();
  // Three pairs of empty-stack passes reach the next player's Main Phase.
  battle.pass().pass().pass().pass().pass().pass();
  battle.command({ type: "strike", player: "south", card: "ward", target: "fighter" }).resolveStack();
  battle.pass().pass().pass().pass().pass().pass();
  battle.command({ type: "strike", player: "north", card: "fighter", target: "ward" }).resolveStack();
  battle.assertDiceConsumed();
  return battle;
}

if (import.meta.main) {
  const battle = playDemo();
  for (const [index, entry] of battle.trace.entries()) console.log(JSON.stringify({ step: index + 1, ...entry }));
  console.log(JSON.stringify({ outcome: battle.state.outcome, cards: battle.state.cards }));
}
