# Duelyst placeholder creatures

Fighter uses Saberspine Tiger, Guard uses Stone Golem, and Ward uses Crimson
Mystic. They retain Feralyst's synthetic names and rules; these are art choices.

Original art: [OpenDuelyst](https://github.com/open-duelyst/duelyst), released by
Counterplay Games under CC0 1.0. The included [license](LICENSE) applies to these
assets; Feralyst's own code remains MIT.

The PNGs in `public/creatures/` and source JSON here were copied unchanged from
[t73liu/open-duelyst-assets](https://github.com/t73liu/open-duelyst-assets) at
commit `9fd0a16b611be8c9b991806ec5a6f602aa981823`, under `assets/units/`.
That project extracts OpenDuelyst's PNG and plist frame metadata into JSON.
These three sheets use untrimmed, unrotated frames centered within their source
canvas. The converter preserves that frame geometry.

`bun run assets` builds Phaser atlas JSON from the checked-in metadata, without
network access. `bun run assets:check` checks dimensions, frame bounds, idle
sequences and reproducibility. Generated atlas JSON is kept compact and excluded
from formatting, along with the unchanged source JSON.

To swap art, supply a PNG and Phaser JSON atlas under `public/creatures/`, then
edit `src/creature-art.ts`. Idle frames use `<asset>_idle_<number>.png`, played
at eight frames per second. `size` is the displayed square canvas size in logical
board pixels; `origin` aligns the feet within that canvas. Retain source frames and their license for replacement assets.
The supplied sheets also contain other animation states, but this slice only
plays idle; combat animation sequencing is separate work.
