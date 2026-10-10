import { afterEach, expect, test } from "bun:test";
import { abilityPosition } from "../battle/positions";
import { cells } from "../rules/board";
import { boardLayout, cardPosition, cellPosition, resizeBoard } from "./board-layout";

afterEach(() => resizeBoard(360, 700));

test.each([
  [304, 478, 0],
  [374, 574, 0],
  [374, 754, 0],
  [414, 842, 0],
  [390, 844, 34],
])(
  "%s by %s portrait board keeps ground and flyers clear of right-side controls",
  (width, height, bottomInset) => {
    resizeBoard(width, height, bottomInset);
    const scale = width / boardLayout.width;
    for (const cell of cells) {
      const { x, y } = cellPosition(cell);
      expect(x - boardLayout.cellWidth / 2).toBeGreaterThanOrEqual(0);
      expect(x + boardLayout.cellWidth / 2).toBeLessThanOrEqual(boardLayout.width);
      expect((y + boardLayout.cellHeight / 2) * scale).toBeLessThan(height - bottomInset - 162);
    }
    const groundTop = boardLayout.groundTop;
    const groundBottom = groundTop + boardLayout.cellHeight * 6;
    const north = cardPosition(abilityPosition.cards.find((card) => card.id === "north-gryphon")!)!;
    const south = cardPosition(abilityPosition.cards.find((card) => card.id === "south-gryphon")!)!;
    expect(south.y + 32).toBeLessThan(groundTop);
    expect(groundTop - south.y).toBeLessThanOrEqual(48);
    expect(north.y - groundBottom).toBeLessThanOrEqual(48);
    expect(north.y - 36).toBeGreaterThan(groundBottom);
    expect(north.x * scale + 40).toBeLessThan(width - 72);
    expect((north.y + 36) * scale).toBeLessThan(height);
  },
);
