import type { Cell } from "./model";

const columns = ["A", "B", "C", "D", "E"] as const;
const rows = ["3", "2", "1", "1′", "2′", "3′"] as const;
export const cells: readonly Cell[] = rows.flatMap((row) =>
  columns.map((column) => `${column}${row}` as Cell),
);

export function coordinates(cell: string) {
  return {
    column: columns.findIndex((column) => column === cell[0]),
    row: rows.findIndex((row) => row === cell.slice(1)),
  };
}
export function isCell(cell: string): cell is Cell {
  const { column, row } = coordinates(cell);
  return column >= 0 && row >= 0;
}
export function distance(a: string, b: string, diagonal = false): number {
  const first = coordinates(a),
    second = coordinates(b);
  const x = Math.abs(first.column - second.column),
    y = Math.abs(first.row - second.row);
  return diagonal ? Math.max(x, y) : x + y;
}
export function adjacent(a: Cell, b: Cell, orthogonal = false): boolean {
  return distance(a, b, !orthogonal) === 1;
}
