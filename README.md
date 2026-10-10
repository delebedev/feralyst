# Feralyst

A browser-first tactical card game inspired by early Berserk Online.

Selected stack: Phaser + TypeScript. Phone interaction is a design priority.

The current demo is a local skirmish: five synthetic creatures per side on a
5×6 battlefield. You control north at the bottom; a basic opponent controls
south at the top. Tap a
creature to inspect it, then a highlighted cell to move or an enemy to strike.
Choose a defender when prompted, or take the attack. End turn lets south play;
Restart resets the
battle. Dice, damage and deaths appear in the battle log. Refreshing also resets
the battle. South attacks the weakest adjacent enemy, otherwise moves closer,
and ends its turn when no useful action remains. It chooses the first legal
defender. Actions are paced; your defender choices pause the opponent.
The chooser is deterministic, but combat dice remain random.

Creatures use Duelyst placeholder sprites. Resolved strikes play attack,
dice results, hit, then death before survivors resume idle. Attacker and target
rings identify the exchange; damage or Miss appears beside affected creatures.
Ground movement plays existing run frames during a 280 ms cell-to-cell step.
Rings, shadows and status markers travel with the sprite, which returns to idle
on arrival. Input and the bot wait, and the log and location commit on arrival.
Reduced motion snaps to the destination; Restart cancels an unfinished step.
HP updates when the hit starts. Defender choices precede playback;
controls and the opponent wait while it runs. Restart cancels playback. Cells show numbered health
bars and movement pips. A checkmark and dimmed sprite mean the creature has spent
its action; tapping still shows full inspection.
Browser Guards have Armor 1: the first wound from nonmagical attacks is prevented
each player turn. The shield shows the remaining allowance; inspection shows the total.
Browser Wards have “Close: heal an adjacent wounded friendly creature for 2.”
Select Ward, choose Heal 2, then tap a green ally. Healing includes diagonal
neighbors, restores only existing wounds and closes Ward. It cannot heal itself.
The bot prioritizes useful healing before attacks.
Browser Archers have 3 life, 2 movement, a 1–1–2 simple strike, and
“Close: Shot 1–2–3 against an opposing creature. Range 2.”
Select Archer, choose Shot, then tap a red enemy. Range counts diagonal steps;
occupied cells do not block it and adjacent enemies are eligible. A shot rolls
one die, allows no ordinary defender or counterstrike, and closes Archer.
Armor prevents shot wounds. Playback shows the roll, a bolt, then damage.
The no-counterstrike reading follows the simple-strike scope of rule 205.6;
Shot and Range definitions add no opposed response. The synthetic profile uses
short range and weak melee to reward approaching the shooter.
Browser Gryphons have Flight, 4 life and a 1–2–3 simple strike. They occupy the
separate air zone (Additional Zone), have no movement or adjacency, and can strike
any battlefield or air-zone card. Flyers can defend flyers, or ground creatures
against flying attacks. Ground defenders must be adjacent to the target; against
ground attacks they must also be adjacent to the attacker. Archer can shoot a
flyer despite Range 2. Ward cannot heal it through adjacency.
When the opposing squad contains only flyers, an open ground creature can choose
Prepare air strike: it closes now and gains one strike against a flyer on its
next own turn. That permission expires if unused. The bot also prepares.
The portrait battlefield uses the full available width with 68-pixel columns
and row spacing that adapts to available height. Creature canvases grow up to
115% of their original size on taller viewports. Enemy flyers sit above the
ground formation; your flyer sits below it. Both stay close to their side’s
third row, independent of viewport height, and clear of the right-side controls.
Figures overlap and draw in row order;
cell hit areas remain separate. Coordinates appear in inspection only.
These are synthetic Feralyst cards; the ordinary headless fixtures remain unchanged.
Art lives outside rule definitions and can be swapped through `src/creature-art.ts`.
See [asset sources and rebuilding](assets/duelyst/README.md).

The top-right cog exposes Restart. Each new battle randomly chooses Sand,
Stone or Ice. A quiet continuous grid overlays the painted ground. Contact shadows
and blue/rust foot rings anchor creatures and identify their side. The
ring changes to white for selection, green for movement or healing, red for attack
targets and gold for defenders. Empty movement cells show green rings.
Flyer placement is presentation only; adjacency and targeting stay rule-based.

Phaser renders the full-height battlefield and handles cell targeting. Two round
buttons on the right open contextual actions at the bottom and end the turn
directly above. Painted ground fills the frame behind the status and settings. During
defence, Take the attack replaces End turn. Tap the selected creature name for
inspection; History in the action fan shows the latest four combat events.
Portrait gameplay fits one viewport without page or panel scrolling. Portrait
is the current preview and verification target. The existing
rules engine validates commands; the browser adapter passes through stages
without decisions and pauses at legal defender reactions.

With Bun and Node.js installed:

```sh
bun install --frozen-lockfile
bun run dev
```

Open the local URL printed by Vite. `bun run build` builds the production page
in `dist/`.

`bun run check` runs formatting, typed linting, TypeScript, tests and the build.
CI runs the same command. Use `bun run format` to apply Oxfmt's formatting.
The archived rules and design history are excluded from automatic formatting.
`.editorconfig` sets two-space indentation and LF endings; the
[Oxc editor extension](https://oxc.rs/docs/guide/usage/formatter/editors)
supports formatting on save and lint diagnostics.

`bun run battle` plays a scripted headless battle and prints each command's
resolution events, followed by the outcome. The synthetic creatures move,
attack, assign a defender, take wounds and die across several turns.

`createBattle` in `src/engine.ts` starts from deployed creatures. `applyCommand`
accepts movement, simple strikes, defender assignment and passing, returning
the next state and events or a rejection. Combat requires an explicit dice
source. `src/battle-harness.ts` supplies scripted dice, checks state invariants
and records a replayable trace. `bun run test` runs the rule examples and
complete battle scenarios; `bun run typecheck` checks TypeScript separately.

This slice covers ordinary ground creatures, flying creatures, and browser Armor, Healing and Shot abilities. Recruitment,
other card-specific abilities and symbiotes are outside its scope.
The optional **Weakening** choice is also omitted: rule 216.7 does not define
when its required “exchange” is possible.

- [English rulebook](docs/rules/rulebook.md)
- [Initial design history](docs/seed/berserk-engine-exploration-2026-10-08/README.md)
- [Working agreement](AGENTS.md)

Work is tracked with [Beads](https://github.com/steveyegge/beads).
After cloning, run `bd bootstrap` to restore issue history. Use `bd dolt pull`
before changing shared issues and `bd dolt push` to publish changes.

[MIT license](LICENSE).
