# Duelyst placeholder art

Fighter uses Saberspine Tiger, Guard uses Stone Golem, and Ward uses Crimson
Mystic. Archer uses Backline Archer. Gryphon uses Gryphinox. They retain Feralyst's synthetic names and rules; these are art choices.

Original art: [OpenDuelyst](https://github.com/open-duelyst/duelyst), released by
Counterplay Games under CC0 1.0. The included [license](LICENSE) applies to these
assets; Feralyst's own code remains MIT.

The PNGs in `public/creatures/` and source JSON here were copied unchanged from
[t73liu/open-duelyst-assets](https://github.com/t73liu/open-duelyst-assets) at
commit `9fd0a16b611be8c9b991806ec5a6f602aa981823`, under `assets/units/`.
That project extracts OpenDuelyst's PNG and plist frame metadata into JSON.
These five sheets use untrimmed, unrotated frames centered within their source
canvas. The converter preserves that frame geometry.

`bun run assets` builds Phaser atlas JSON from the checked-in metadata, without
network access. `bun run assets:check` checks dimensions, frame bounds, required animation
sequences and reproducibility. Generated atlas JSON is kept compact and excluded
from formatting, along with the unchanged source JSON.

To swap art, supply a PNG and Phaser JSON atlas under `public/creatures/`, then
edit `src/browser/creature-art.ts`. Frames use `<asset>_<state>_<number>.png` for
`idle`, `run`, `attack`, `hit` and `death`. Idle loops at eight frames per second;
run loops at twelve during movement, attack plays once at twelve, hit and death at sixteen. `size` is the displayed square canvas size in logical
board pixels; `origin` aligns the feet within that canvas. Retain source frames and their license for replacement assets.
Combat playback follows engine events after defender resolution. Attack and
counterattack play together, followed by wounded creatures reacting and dead
creatures disappearing. Wounds appear at the hit stage; final locations and the log commit afterward.

Static arena art uses the unchanged `assets/maps/battlemap0_middleground.png`,
`battlemap2_middleground.png` and `battlemap4_middleground.png` from the same
pinned source and CC0 license. Copies live in `public/arenas/`. The browser crops
each to cover the board and adds a dark wash for target and health readability.
