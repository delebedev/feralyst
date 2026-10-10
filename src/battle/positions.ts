import { createBattle } from "../rules/engine";
import type { CardInstance, Cell } from "../rules/model";

function card(id: string, definition: string, player: string, cell: Cell): CardInstance {
  return {
    id,
    definition,
    owner: player,
    controller: player,
    location: { zone: "battlefield", cell },
    status: "open",
    movementMarkers: 0,
    wounds: 0,
  };
}

// Synthetic creatures isolate the ordinary rules from card-specific abilities.
export const demoPosition = createBattle({
  players: ["north", "south"],
  activePlayer: "north",
  definitions: [
    {
      id: "fighter",
      name: "Fighter",
      movementAllowance: 2,
      lifeAllowance: 6,
      simpleStrike: [2, 3, 4],
    },
    { id: "guard", name: "Guard", movementAllowance: 1, lifeAllowance: 3, simpleStrike: [1, 2, 3] },
    { id: "ward", name: "Ward", movementAllowance: 2, lifeAllowance: 2, simpleStrike: [1, 1, 2] },
  ],
  cards: [
    card("fighter", "fighter", "north", "B2"),
    card("guard", "guard", "south", "C2"),
    card("ward", "ward", "south", "C1"),
  ],
});

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

// Browser abilities are separate from the ordinary rules fixtures.
export const abilityPosition = createBattle({
  ...skirmishPosition,
  cards: [
    ...skirmishPosition.cards,
    ...(["north", "south"] as const).map((player) => ({
      id: `${player}-gryphon`,
      definition: "gryphon",
      owner: player,
      controller: player,
      location: { zone: "additional" as const },
      status: "open" as const,
      movementMarkers: 0,
      wounds: 0,
    })),
    ...(["north", "south"] as const).map((player) => ({
      id: `${player}-archer`,
      definition: "archer",
      owner: player,
      controller: player,
      location: { zone: "battlefield" as const, cell: (player === "north" ? "E1" : "A1′") as Cell },
      status: "open" as const,
      movementMarkers: 0,
      wounds: 0,
    })),
  ],
  definitions: [
    {
      id: "gryphon",
      name: "Gryphon",
      flight: true,
      movementAllowance: 0,
      lifeAllowance: 4,
      simpleStrike: [1, 2, 3],
    },
    ...skirmishPosition.definitions.map((definition) =>
      definition.id === "guard"
        ? { ...definition, abilities: { armor: 1 } }
        : definition.id === "ward"
          ? { ...definition, abilities: { heal: 2 } }
          : definition,
    ),
    {
      id: "archer",
      name: "Archer",
      movementAllowance: 2,
      lifeAllowance: 3,
      simpleStrike: [1, 1, 2],
      abilities: { shot: { strength: [1, 2, 3], range: 2 } },
    },
  ],
});
