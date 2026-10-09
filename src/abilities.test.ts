import { expect, test } from "bun:test";
import { abilityPosition, BattleSession } from "./battle-session";
import { createBattle } from "./engine";

const card = (battle: BattleSession, id: string) =>
  battle.state.cards.find((card) => card.id === id)!;
function attack(battle: BattleSession, source: string, target: string) {
  battle.command({ type: "strike", player: "north", card: source, target });
  if (battle.defenders.length) battle.takeAttack();
  expect(battle.error).toBeNull();
}

test("armor is shared across hits and resets for both squads each player turn", () => {
  const battle = new BattleSession(abilityPosition, () => 4);
  attack(battle, "north-fighter", "south-guard");
  expect(card(battle, "south-guard").wounds).toBe(1);
  expect(card(battle, "south-guard").armorSpent).toBe(1);
  attack(battle, "north-ward", "south-guard");
  expect(card(battle, "south-guard").wounds).toBe(2);
  battle.endTurn();
  expect(card(battle, "south-guard").armorSpent).toBe(0);
  // North's guard consumes armor on south's turn, then resets on north's turn.
  battle.command({ type: "strike", player: "south", card: "south-fighter", target: "north-guard" });
  battle.takeAttack();
  expect(card(battle, "north-guard").armorSpent).toBe(1);
  battle.endTurn();
  expect(card(battle, "north-guard").armorSpent).toBe(0);
  expect(
    abilityPosition.cards.every((card) => card.armorSpent === undefined && card.wounds === 0),
  ).toBe(true);
});

test("armor belongs to the redirected defender and protects against counterstrikes", () => {
  const battle = new BattleSession(abilityPosition, () => 4);
  battle.command({
    type: "strike",
    player: "north",
    card: "north-fighter",
    target: "south-fighter",
  });
  battle.command({ type: "defend", player: "south", card: "south-guard" });
  expect(battle.events).toContainEqual({
    type: "prevented",
    card: "south-guard",
    source: "north-fighter",
    amount: 1,
  });
  expect(card(battle, "south-fighter").wounds).toBe(0);
  let roll = 0;
  const response = new BattleSession(abilityPosition, () => (++roll % 2 ? 2 : 6));
  attack(response, "north-guard", "south-fighter");
  expect(card(response, "north-guard").armorSpent).toBe(1);
  expect(card(response, "north-guard").wounds).toBe(2);
});

test("misses preserve armor and a fully absorbed lethal hit causes no wounds or destruction", () => {
  const miss = new BattleSession(abilityPosition, () => 6);
  attack(miss, "north-fighter", "south-guard");
  expect(card(miss, "south-guard").armorSpent ?? 0).toBe(0);
  const lethal = new BattleSession(
    createBattle({
      ...abilityPosition,
      cards: abilityPosition.cards.map((card) =>
        card.id === "south-guard" ? { ...card, wounds: 2, status: "closed" } : card,
      ),
    }),
    () => 4,
  );
  attack(lethal, "north-ward", "south-guard");
  expect(card(lethal, "south-guard").location.zone).toBe("battlefield");
  expect(card(lethal, "south-guard").wounds).toBe(2);
  expect(
    lethal.events.some((event) => event.type === "wounded" || event.type === "destroyed"),
  ).toBe(false);
});

test("ability values and armor markers are validated", () => {
  for (const amount of [0, -1, 1.5, NaN])
    expect(() =>
      createBattle({
        ...abilityPosition,
        definitions: abilityPosition.definitions.map((def) => ({
          ...def,
          abilities: { armor: amount },
        })),
      }),
    ).toThrow("Invalid creature ability");
  expect(() =>
    createBattle({
      ...abilityPosition,
      cards: abilityPosition.cards.map((card) => ({ ...card, armorSpent: -1 })),
    }),
  ).toThrow("Invalid card markers");
});
