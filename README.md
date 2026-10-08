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

- [English rulebook](docs/rules/rulebook.md)
- [Project context and decisions](docs/seed/berserk-engine-exploration-2026-10-08/README.md)
- [Working agreement](AGENTS.md)

Work is tracked with [Beads](https://github.com/steveyegge/beads).
After cloning, run `bd bootstrap` to restore issue history. Use `bd dolt pull`
before changing shared issues and `bd dolt push` to publish changes.

[MIT license](LICENSE).
