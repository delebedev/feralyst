import { cells } from "./battle-session";
import type { CardInstance, Cell } from "./model";

export const boardLayout = {
  width: 360,
  height: 700,
  cellWidth: 68,
  cellHeight: 64,
  groundTop: 128,
  spriteScale: 1.15,
};

export function resizeBoard(width: number, height: number, bottomInset = 0): void {
  boardLayout.height = (height * boardLayout.width) / width;
  // Reserve the physical thumb-control area below every ground row.
  const groundBottom = boardLayout.height - ((180 + bottomInset) * boardLayout.width) / width;
  boardLayout.cellHeight = Math.min(64, (groundBottom - 128) / 6);
  boardLayout.groundTop = 128 + (groundBottom - 128 - boardLayout.cellHeight * 6) / 2;
  boardLayout.spriteScale = boardLayout.cellHeight < 50 ? 1 : 1.15;
}

export function cellPosition(cell: Cell): { x: number; y: number } {
  const index = cells.indexOf(cell);
  return {
    x: (index % 5) * boardLayout.cellWidth + 44,
    y: boardLayout.groundTop + (5 - Math.floor(index / 5) + 0.5) * boardLayout.cellHeight,
  };
}

export function cardPosition(card: CardInstance): { x: number; y: number } | null {
  if (card.location.zone === "battlefield") return cellPosition(card.location.cell);
  // shortcut: the demo has one flyer per side; add air slots for larger squads.
  if (card.location.zone === "additional")
    return {
      x: card.controller === "north" ? 120 : 180,
      y:
        card.controller === "north"
          ? boardLayout.groundTop + boardLayout.cellHeight * 6 + 48
          : boardLayout.groundTop - 44,
    };
  return null;
}
