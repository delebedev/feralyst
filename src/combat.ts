import type { Die, StrikeProfile } from "./model";

type Kind = "weak" | "medium" | "strong" | "miss";
const initiating: readonly (readonly [Kind, Kind])[] = [
  ["weak", "miss"], ["medium", "weak"], ["medium", "miss"],
  ["strong", "weak"], ["strong", "miss"],
];
const responding: readonly (readonly [Kind, Kind])[] = [
  ["weak", "miss"], ["miss", "miss"], ["miss", "weak"],
  ["weak", "medium"], ["miss", "medium"],
];

function value(kind: Kind, profile: StrikeProfile): number {
  if (kind === "miss") return 0;
  return profile[{ weak: 0, medium: 1, strong: 2 }[kind]];
}

// Strike Table (205.6); a non-fighting target uses the single-roll rule (205.4).
// shortcut: Weakening is omitted; clarify the exchange condition in 216.7 before adding that choice.
export function strikeDamage(source: Die, responder: Die | null, attack: StrikeProfile, response: StrikeProfile) {
  let kinds: readonly [Kind, Kind];
  if (responder === null) {
    kinds = [source <= 3 ? "weak" : source <= 5 ? "medium" : "strong", "miss"];
  } else {
    const difference = source - responder;
    kinds = difference > 0 ? initiating[difference - 1]
      : difference < 0 ? responding[-difference - 1]
      : source <= 4 ? ["weak", "miss"] : ["miss", "weak"];
  }
  return { toTarget: value(kinds[0], attack), toSource: value(kinds[1], response) };
}
