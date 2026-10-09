# Feralyst

A browser-first tactical card game inspired by early Berserk Online.

Selected stack: Phaser + TypeScript. Phone interaction is a design priority.

The current demo is a local skirmish: three synthetic creatures per side on a
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
outlines identify the exchange; damage or Miss appears beside affected creatures.
HP updates when the hit starts. Defender choices precede playback;
controls and the opponent wait while it runs. Restart cancels playback. Cell badges show HP (remaining
life), MP (remaining movement), or CLOSED; tapping still shows full inspection.
Browser Guards have Armor 1: the first wound from nonmagical attacks is prevented
each player turn. A1/A0 shows the remaining allowance; inspection shows the total.
Browser Wards have “Close: heal an adjacent wounded friendly creature for 2.”
Select Ward, choose Heal 2, then tap a green ally. Healing includes diagonal
neighbors, restores only existing wounds and closes Ward. It cannot heal itself.
The bot prioritizes useful healing before strikes.
These are synthetic Feralyst cards; the ordinary headless fixtures remain unchanged.
Art lives outside rule definitions and can be swapped through `src/creature-art.ts`.
See [asset sources and rebuilding](assets/duelyst/README.md).

Phaser renders the battlefield and handles cell targeting. Native HTML controls
provide inspection, turn controls and the log beside the canvas, or below it on
phones. Mobile gameplay must fit one viewport in portrait and landscape, with
no page or panel scrolling. The log previews the latest four combat events. The existing
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

This slice covers ordinary ground creatures, plus browser Armor and Healing abilities. Recruitment,
card-specific abilities, flying creatures and symbiotes are outside its scope.
The optional **Weakening** choice is also omitted: rule 216.7 does not define
when its required “exchange” is possible.

- [English rulebook](docs/rules/rulebook.md)
- [Initial design history](docs/seed/berserk-engine-exploration-2026-10-08/README.md)
- [Working agreement](AGENTS.md)

Work is tracked with [Beads](https://github.com/steveyegge/beads).
After cloning, run `bd bootstrap` to restore issue history. Use `bd dolt pull`
before changing shared issues and `bd dolt push` to publish changes.

[MIT license](LICENSE).
