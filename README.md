# Feralyst

A browser-first tactical card game inspired by early Berserk Online.

Selected stack: Phaser + TypeScript. Phone interaction is a design priority.

The current demo renders a Phaser hello world.

With Bun and Node.js installed:

```sh
bun install --frozen-lockfile
bun run dev
```

Open the local URL printed by Vite. `bun run build` checks TypeScript and
builds the production page in `dist/`.

`bun run battle` plays a scripted headless battle and prints each command's
resolution events, followed by the outcome. The synthetic creatures move,
attack, assign a defender, take wounds and die across several turns.

`createBattle` in `src/engine.ts` starts from deployed creatures. `applyCommand`
accepts movement, simple strikes, defender assignment and passing, returning
the next state and events or a rejection. Combat requires an explicit dice
source. `src/battle-harness.ts` supplies scripted dice, checks state invariants
and records a replayable trace. `bun run test` checks TypeScript and runs the
rule examples and complete battle scenarios.

This slice covers ordinary ground creatures without abilities. Recruitment,
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
