# Berserk engine exploration and decision records

Research date: 8 October 2026.

This is a portable knowledge pack for a browser-first, mobile-oriented tactical card game inspired by early Berserk Online. It preserves the product context, compares plausible engine and rules-core combinations, and records the reasons and status of initial decisions.

Accepted on 8 October 2026: **Phaser + TypeScript**. Phaser is the presentation engine; TypeScript is the language for the game client and rules core. The recommended architecture keeps the rules in an independent TypeScript package. Record 007 captures the choice and its rationale. Earlier engine and language comparisons are retained as background; the initial stack selection is complete. Exact versions, optional web UI, backend technology, screen orientation and mobile packaging remain open.

Also accepted: **begin at a deliberate learning pace**. We will develop first principles, abstractions, guidance and skills together through small, understandable steps. Larger autonomous feature delivery is a future direction whose scope can grow with shared understanding and confidence. Record 008 captures this working mode. Fully agentic development does not impose an overnight delivery target.

## Read in this order

1. [Project context](project-context.md) — established intent and unresolved product questions.
2. [Engine research](engine-research.md) — evidence for the selected stack, historical alternatives and proposed validation.
3. [Agent workflow](agent-workflow.md) — proposed requirements for a self-contained development loop.
4. [Decision records](decision-records.md) — accepted direction, proposals, alternatives and reasons to revisit.

Evidence level: documentation and source review. Device benchmarks, engine prototypes and an executable MVP are subsequent work. Proposed commands and interfaces in this pack describe a desired contract; they are not implemented tools.

These files can become repository documentation. Keep the rationale with the project so a new agent can continue without access to the original conversation.
