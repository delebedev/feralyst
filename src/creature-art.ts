// Presentation keys stay separate from rule definitions so placeholder art can be replaced.
export const creatureArt: Readonly<
  Record<
    string,
    {
      asset: string;
      size: number;
      origin: readonly [number, number];
    }
  >
> = {
  fighter: { asset: "neutral_beastsaberspinetiger", size: 104, origin: [0.45, 0.8] },
  guard: { asset: "neutral_golemstone", size: 100, origin: [0.6, 0.8] },
  ward: { asset: "neutral_crimsonmystic", size: 106, origin: [0.5, 0.94] },
};
