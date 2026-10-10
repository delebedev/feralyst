import { expect, test } from "bun:test";
import { adjacent, cells, coordinates, distance, isCell } from "./board";

test("all battlefield cells have unique coordinates across the unprimed and primed halves", () => {
  expect(cells).toHaveLength(30);
  expect(new Set(cells.map((cell) => JSON.stringify(coordinates(cell)))).size).toBe(30);
  expect(cells.every(isCell)).toBe(true);
  for (const invalid of ["", "F1", "A4", "A1extra", "A1'"]) expect(isCell(invalid)).toBe(false);
});

test("movement and approach count orthogonal steps while range counts diagonal steps", () => {
  expect(distance("B2", "D1′")).toBe(4);
  expect(distance("B2", "D1′", true)).toBe(2);
  expect(adjacent("B1", "C1′")).toBe(true);
  expect(adjacent("B1", "C1′", true)).toBe(false);
  expect(adjacent("B1", "B1′", true)).toBe(true);
  expect(adjacent("B1", "B1")).toBe(false);
});
