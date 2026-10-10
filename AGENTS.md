# Working agreement

- AI writes; Denis reviews authored changes. Push and merge only when he explicitly asks.
- Keep one workstream. Deliver complete, small or medium slices in sequential or dependent PRs.
- Discuss novel game behavior or visual direction together. Implement routine work within the agreed slice autonomously.
- Mobile gameplay is portrait-only and fits one viewport without page or panel scrolling. Landscape is unsupported; exclude it from acceptance, testing and backlog unless Denis explicitly reopens the scope.
- Beads owns work and acceptance. Pull shared state before writes; inspect `bd ready` and the relevant `bd show`. Publish tracker changes when done.
- Verify the premise before editing. Finish the agreed interaction before expanding scope.
- Keep substantive decisions and their reasons with the relevant code or current documentation.
- Use the [PR template](.github/pull_request_template.md). State observed evidence and material limits precisely.

## Route the work

Read [README](README.md) before implementation.

- Rules changes: work in `src/rules/` and consult the relevant [English rulebook](docs/rules/rulebook.md) sections. Distinguish rules evidence, interpretation and deliberate synthetic-card design.
- Decisions, opponent behavior and playback sequencing: work in `src/battle/`. Starting positions belong in `positions.ts`; the executable demo remains separate.
- Layout, sprites, feedback and native controls: work in `src/browser/`. Keep startup and wiring in `src/main.ts`. Tests stay beside the modules they exercise.
- Implementation and UI iteration: follow the [development playbook](docs/development.md) for verification and completion.
- Resuming work: read the [handoff](docs/handoff.md), then inspect the actual checkout, tracker and PR state.

For consequential design choices, consult the seeded
[project context](docs/seed/berserk-engine-exploration-2026-10-08/project-context.md)
and [decision records](docs/seed/berserk-engine-exploration-2026-10-08/decision-records.md).
Those files preserve history and proposals; this agreement and current accepted
scope govern delivery.
