import { expect, test } from "bun:test";
import assert from "node:assert/strict";
import { strikeDamage } from "./combat";
import type { Die } from "./model";

// Rows are initiating rolls 1–6, columns responding rolls 1–6 (205.6).
// Profiles 1/2/3 and 10/20/30 distinguish both damage directions and strengths.
const expected = [
  [
    [1, 0],
    [1, 0],
    [0, 0],
    [0, 10],
    [1, 20],
    [0, 20],
  ],
  [
    [1, 0],
    [1, 0],
    [1, 0],
    [0, 0],
    [0, 10],
    [1, 20],
  ],
  [
    [2, 10],
    [1, 0],
    [1, 0],
    [1, 0],
    [0, 0],
    [0, 10],
  ],
  [
    [2, 0],
    [2, 10],
    [1, 0],
    [1, 0],
    [1, 0],
    [0, 0],
  ],
  [
    [3, 10],
    [2, 0],
    [2, 10],
    [1, 0],
    [0, 10],
    [1, 0],
  ],
  [
    [3, 0],
    [3, 10],
    [2, 0],
    [2, 10],
    [1, 0],
    [0, 10],
  ],
] as const;
const dice: Die[] = [1, 2, 3, 4, 5, 6];
for (const source of dice) {
  for (const responder of dice) {
    test(`strike table: ${source} versus ${responder}`, () => {
      const pair = expected[source - 1]?.[responder - 1];
      assert(pair);
      const [toTarget, toSource] = pair;
      expect(strikeDamage(source, responder, [1, 2, 3], [10, 20, 30])).toEqual({
        toTarget,
        toSource,
      });
    });
  }
}
test.each([
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 2],
  [5, 2],
  [6, 3],
] satisfies [Die, number][])("a closed target does not respond to roll %i", (source, toTarget) => {
  expect(strikeDamage(source, null, [1, 2, 3], [10, 20, 30])).toEqual({
    toTarget,
    toSource: 0,
  });
});
