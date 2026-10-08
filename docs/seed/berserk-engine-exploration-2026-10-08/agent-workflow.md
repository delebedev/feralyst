# Proposed workflow for a self-contained agentic project

Status: the Phaser + TypeScript choice, fully agentic/self-contained intent and deliberate initial learning pace are accepted. The specific interfaces, compiler configuration, build guarantees and learning loop below are implementation proposals.

## Deliberate learning and growing autonomy

The initial phase should build shared understanding of the game, its implementation and the way we work with agents. Co-develop first principles, abstractions, guidance and skills through small, coherent slices. Leave room to inspect and discuss the result before expanding the scope of a foundational design.

A suggested early loop is: choose one concrete question; explain the relevant model and tradeoffs; implement or investigate the smallest useful example within the agreed scope; inspect the behavior together; and capture the reason or reusable practice we learned. This is a working pattern, not a formal gate or a requirement to write a new document for every edit.

Good early progress includes a clearer rules concept, an abstraction whose purpose we can explain, a small playable interaction and a reliable way for an agent to verify it. Code volume and feature count are secondary measures during this phase. Develop reusable guidance and skills as actual practices emerge, and keep their assumptions and examples with the project.

Larger autonomous feature delivery and autolanding are a future direction. Expand the scope with shared understanding and demonstrated reliability; there is no fixed deadline for that transition. Future intentions do not grant blanket merge or deployment permission today. Routine reversible work within an agreed slice can proceed autonomously, without adding repeated permission requests.

## The acceptance question

Can a new agent, given a clean checkout, understand the current direction, reproduce a reported turn, explain its outcome, make a change, and show both behavioral and visual evidence?

This is the capability the repository should accumulate. It should remain useful when the coding model or agent harness changes.

## Knowledge that travels with the repository

Keep a short entry point describing the product, current stage and where authoritative documents live. An eventual AGENTS.md should route an agent to current constraints and verification commands, rather than duplicating the whole design.

Preserve accepted decisions and their reasons, unresolved questions, rejected alternatives under their original constraints, source notes, named scenarios and known limitations. Attach evidence to claims that can otherwise become stale.

For reconstructed Berserk behavior, record three separate things: historical evidence, our interpretation and deliberate design changes. A tested implementation does not prove historical accuracy. An archival source does not prove that the exact old client implemented every provision. A rebalance must retain its intent so a later agent does not accidentally revert it.

Keep rule references close to scenarios that exercise them. This makes explanation useful during implementation, not merely during initial onboarding.

## Type checking as part of the agent loop

TypeScript is selected for the rules core, meeting the direction toward a sufficiently expressive type system. Strict checking is the proposed baseline, with exact settings chosen when the project is initialized. The build should expose clear diagnostics for the domain model. Proposed conventions include explicit command/state variants, distinct domain identifiers and careful handling of optional values. Avoid routine use of casts or unchecked escape hatches to silence diagnostics. Types complement runtime legality checks and focused behavioral scenarios.

## Reproducible development

Proposed baseline: after documented dependency setup, source, tests and assets can be built locally without production services or undocumented editor state. Pin the engine, language tools, package dependencies and relevant plugins. Record the host prerequisites that cannot sensibly live in source control.

A fully offline clean build is a stricter requirement. It would need cached or vendored toolchains and dependencies. Similarly, local development does not by itself promise offline multiplayer, app-store packaging or a production service with no external dependencies. Decide those scopes separately.

Retain the actual source art and animation metadata. The reproducible operation should be generating production atlases and asset manifests from those sources. A generation prompt alone is not a durable substitute for the chosen image or animation frames.

Asset checks should address dimensions, frame names, pivots, animation states, transparency, atlas limits and pixel scaling. Preserve font and sound sources as well as final outputs. An engine-specific import cache can be disposable only if the source and import configuration reconstruct it reliably.

## A compact tool contract

The following describes intended operations, not existing commands or a mandated CLI syntax:

- Check environment and explain missing prerequisites.
- Start a local playable build with a named battle fixture.
- Build the target and regenerate derived assets.
- Run the narrow relevant rules and presentation checks.
- Observe the game as a chosen player and inspect the current decision.
- Query legal actions, targets and structured rejection reasons.
- Execute actions through either the rules API or actual interface input, according to the test's purpose.
- Export a reproduction bundle with versions, initial state, commands, randomness, logs and relevant screenshots or clips.

A reproduction bundle should be portable to another machine. Avoid depending on a path, active editor session or hidden production account that only the original agent possesses.

## Behavioral and visual verification

Rules verification should operate on small controlled scenarios and meaningful invariants. The proposed independent TypeScript package should be exercisable without Phaser. If the core later runs in both browser and server environments, representative replays should agree under the defined determinism contract.

Presentation verification should exercise the application as a player does: inspect a unit, scroll a panel, select a target, cancel, react and commit. The tooling can expose semantic identifiers and current screen bounds, then deliver real input through the normal path. Directly submitting a game command cannot verify a touch target.

A static image can establish layout but not animation timing or interaction flow. A short clip and associated state/event trace are useful for an attack or reaction sequence. Keep criteria explicit: readable text, visible pending choices, coherent selected states, no accidental command while scrolling and a clear result after the effect.

The earlier engine research includes examples of automation and testing interfaces in other engines. Those remain background evidence. Build the project-specific contract for Phaser + TypeScript, beginning with the operations needed by the first agreed learning slice.

## Keep the loop bounded

Make readiness and completion observable. Prefer process completion or state notifications; use bounded polling where the tool requires it. Avoid an agent repeatedly waiting without new evidence.

Use the narrowest meaningful checks for a change. Broader tests should answer a concrete risk. CI must produce a deterministic pass/fail result without needing an agent to interpret whether the build probably succeeded. Agents can then diagnose and repair failures.

Rules introspection and full-state debug operations belong in an explicit development context. Player-facing observations should preserve hidden information. The same clear boundary supports fair automated play and powerful local investigation.

## How decisions stay useful

Record choices that affect future reasoning: engine, rules language, portability boundary, information visibility, animation/rules timing, source interpretation, asset formats and platform guarantees. Ordinary local refactors usually need a concise code explanation, not a new architecture record.

A record should state its status, reasons, serious alternatives, consequences, evidence and revisit trigger. When the choice changes, supersede the old record so its historical reasoning survives. Link the implementation and verification once they exist.

Accepted decisions guide autonomous work within the user's authorized scope. This process should not introduce a new permission request for routine implementation choices.
