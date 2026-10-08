# Initial decision records

Date: 8 October 2026.

Accepted records below capture the user's established direction. **Phaser + TypeScript is accepted in Record 007. A deliberate initial learning pace is accepted in Record 008.** Proposed records capture architectural recommendations that remain open to refinement. Record 004 preserves the superseded shortlist as historical rationale.

## Record 001 Browser delivery and mobile interaction

Status: accepted user direction.

Decision: start with browser delivery and design interaction quality for phones from the beginning. Preserve a route into mobile applications.

Reasons: the user wants immediate browser access, future mobile growth and modern TCG interaction quality. Animated pixel creatures and a rich tactical ruleset are part of the creative ambition. Phase is a distribution reference, while stack choices remain independent.

Alternatives considered: selecting native-only delivery would not meet the current browser target. Treating mobile as a late layout adaptation would miss the requested design priority. Inheriting Phase's whole stack would skip the independent evaluation the user wants.

Consequences: a desktop web demo alone is insufficient acceptance evidence. Phone targeting, card inspection, information density and interruption/recovery need early attention.

Open scope: portrait versus landscape; supported devices; PWA versus native packages; exact release sequence. These are not settled by this record.

Evidence: user instructions in the project discussion, summarized in project-context.md.

Revisit: an explicit product-direction change by the user, or evidence that a required experience calls for a revised delivery strategy.

## Record 002 Keep project knowledge and reasons with the code

Status: accepted user direction.

Decision: develop the project fully agentically and make it self-contained; record the reasons behind decisions as choices settle.

Reasons: a new agent should have the context necessary to continue the work. Decisions should survive changes of session, model and developer agent. Historical reconstruction and deliberate balance changes make the rationale especially valuable.

Alternatives considered: chat-only context is fragile as the project grows. A large undifferentiated instruction file makes it difficult to find current decisions and can preserve obsolete assumptions.

Consequences: maintain a compact entry point, current decision index, source notes and executable evidence as it becomes available. Preserve accepted versus proposed status. Supersede changed decisions instead of erasing their reasons.

Open scope: the operational definition of self-contained. The proposed local development and runtime distinctions are in agent-workflow.md; fully offline clean builds are not yet accepted requirements.

Evidence: the user's explicit request for fully agentic, self-contained development and recorded whys.

Revisit: refine the operational guarantees with concrete experience; retain the underlying requirement for portable context and rationale.

## Record 003 Separate rules from presentation

Status: proposed architecture.

Decision proposed: maintain one authoritative rules implementation independent of rendering and animation timing. Expose explicit commands, player views, pending decisions, structured explanations and ordered events.

Reasons: this supports precise rules, expressive presentation, headless play, debugging, replay, agent experimentation and future server validation. It also prevents interface changes from silently changing the game.

Alternatives: rules implemented directly in scene components have low initial integration cost but couple behavior to presentation. Multiple independent rules implementations increase reconciliation work. A generic universal card platform adds abstractions before we know which mechanics need them.

Consequences: we must design and verify a small adapter contract. The frontend still owns selection, camera, panels and animation pacing. The rules core owns battle decisions and information visibility.

Current recommendation after Record 007: use an ordinary TypeScript rules package without Phaser, browser or scene-object dependencies. The precise commands, player views, events, state model and package layout remain design work to co-develop. Engine-runtime independence is achievable with this stack but has not yet been implemented or verified.

Evidence required: headless scenarios; an attack with a pending reaction; matching final outcomes under different presentation speeds; a rendered input test using the same core; versioned reproduction data.

Revisit: if the proposed boundary creates measurable complexity without benefiting the actual product, adjust its granularity. Do not duplicate authoritative rules merely to bypass an inconvenient adapter.

## Record 004 Engine shortlist and provisional lead

Status: superseded by accepted Record 007. This record preserves the earlier research conclusion; it no longer directs a multi-engine comparison.

Decision proposed: use Phaser with an independent rules package as the leading baseline; compare Godot as the main integrated alternative and keep Defold as a serious candidate. Evaluate a sufficiently typed rules core without privileging Rust. Strict TypeScript is a primary candidate; other languages should be assessed with their complete target and tooling path. PixiJS, Bevy and Unity are contextual alternatives.

Reasons: Phaser fits browser delivery and a conventional web development loop while supplying substantial presentation machinery. Godot may offer better integrated authoring. Defold's documented automation makes it more relevant than the initial two-engine framing suggested.

Alternatives and reasons at the time: Pixi asks us to coordinate more presentation systems. Bevy's evolving UI/tooling adds responsibilities outside the intended rules focus. Unity may justify its larger environment if specific presentation or native requirements emerge. None is rejected as incapable of rich gameplay.

Consequences: evaluate complete stacks, not renderer demos. Do not assume a mature engine makes a particular Rust integration mature. Do not interpret TypeScript as a temporary implementation with an automatic rewrite planned.

Evidence: linked primary sources in engine-research.md. Evidence level is documentation/source review; device and workflow experiments are pending.

Revisit: actual phone performance; difficult DOM/canvas coordination; an improved integrated authoring loop; unacceptable Rust integration cost; a firm requirement for real 3D scene composition; or a different language preference.

## Record 005 Preserve historical evidence and intentional changes

Status: proposed implementation policy supporting established product intent.

Decision proposed: keep recovered historical behavior, interpretation of uncertain evidence and deliberate rule/balance changes distinguishable in source notes, content definitions and representative scenarios.

Reasons: original materials are incomplete and the product explicitly permits new balance decisions. Without the distinction, an agent could mistake uncertainty for fact or revert a purposeful change as a bug fix.

Alternatives: one merged rule document is simpler to read initially but loses provenance. Separate incompatible implementations of old and new rules would add cost before there is a reason to maintain both.

Consequences: document the source and confidence behind reconstructed behavior, and the reason behind intentional changes. Version content that affects replay. Preserve tested examples when they explain a decision better than prose.

Evidence required: a first small set of reconciled rules/cards with source references, uncertainty notes, intentional changes and executable scenarios. This pack contains research entry points rather than that completed reconstruction.

Revisit: simplify metadata if it becomes repetitive while retaining the ability to answer whether a behavior is historical, interpreted or intentionally changed.

## Record 006 Sufficiently expressive types for the rules engine

Status: accepted user requirement, clarified on 8 October 2026.

Decision: the rules engine should use a sufficiently expressive static type system. Rust is not required and was never an established user constraint.

Reasons: the user wants meaningful type support for the rules engine. Our engineering interpretation is that types should help express commands, decisions, effects, identities and state transitions, and provide useful feedback during agent-driven changes.

Alternatives: mandatory Rust would add an unrequested constraint. Plain dynamically typed rules without an additional checking layer would not answer the clarified direction. Maximum type-system sophistication or formal soundness is also not a stated goal.

Consequences: assess the actual modeling and checking capabilities needed by our rules. The subsequent language selection is TypeScript, recorded in Record 007. Strict configuration and explicit domain modeling are proposed ways to realize this requirement. Earlier Kotlin, C#, Rust and engine-language comparisons remain background, with no ongoing language competition or assumed future rewrite.

Proposed evidence: implement a small domain model with distinct unit/card identities, command variants, explicit pending-decision states and comprehensive effect handling. Check that useful mistakes produce diagnostics, that boundary data is validated and that agents can maintain the model without routinely bypassing checks. These are suggested evaluation criteria rather than additional accepted requirements.

Revisit: refine compiler settings and modeling conventions as the first rules examples take shape. A specific demonstrated limitation may motivate a new decision; the existing requirement does not itself reopen the accepted TypeScript choice.

## Record 007 Phaser and TypeScript

Status: accepted user decision on 8 October 2026. Supersedes Record 004.

Decision: use Phaser as the presentation engine and TypeScript for the game client and rules core. This is the selected initial stack and a viable long-term direction; no later rewrite is assumed.

Reasons supporting the choice: Phaser supplies mature 2D presentation machinery for a browser-oriented product. TypeScript across presentation and rules keeps language boundaries few and supports useful static domain checks. A conventional source, command-line and browser workflow fits the intended inspectable agent development process. These are engineering reasons from the investigation supporting the user's explicit selection. They do not constitute measured performance results.

Alternatives considered: Godot offered integrated authoring; Defold offered relevant automation and mobile workflows; PixiJS offered a more selective presentation foundation. Rust and other typed rules languages were investigated as possible complete stacks. The research remains available to explain the choice, rather than requiring future agents to repeat it.

Consequences: develop the game within Phaser + TypeScript. The recommended architecture is an independent TypeScript rules package, with Phaser consuming its outcomes and controlling presentation. Strict compiler checks, explicit domain variants, distinct identifiers and runtime validation at external boundaries are proposed implementation practices. The exact rules/presentation contract remains a subject for small examples and discussion under Record 008.

Open scope: exact engine/tool versions; bundler; optional web UI and its ownership boundary; backend runtime/framework; mobile packaging; supported devices; orientation; and MVP rules/card scope. This record does not select React, Vite, Capacitor, a hosted agent service or a server framework.

Evidence: the user's statement, “phaser + typescript is the one”; linked primary documentation in engine-research.md. No project-specific engine prototype, device benchmark or executable MVP exists yet.

Revisit: a concrete product requirement or persistent demonstrated blocker that reasonable implementation changes cannot address. Routine agent preference is insufficient to restart stack selection. Diagnose implementation and architecture issues before attributing them to the engine or language.

## Record 008 Deliberate learning before larger autonomous delivery

Status: accepted user working direction on 8 October 2026.

Decision: treat the initial phase as a learning opportunity and develop at a deliberate pace. Co-develop first principles, abstractions, guidance and skills. Larger autonomous feature sets and autolanding are an anticipated later direction, with scope and timing to evolve through experience.

Reasons: the user explicitly wants time to understand and shape the foundations in a fast-moving AI environment. Our engineering interpretation is that shared understanding and reusable practices should grow alongside the game, so increasing automation preserves the intent behind the work.

Alternatives considered: an immediate broad MVP generation pass would compress the opportunity to inspect foundational choices. Indefinite analysis without working examples would provide too little practical evidence. The proposed balance is a sequence of small, meaningful questions and working slices.

Consequences: keep early changes coherent and explainable; surface the purpose and tradeoffs of foundational abstractions; leave room for discussion; and capture useful decisions and repeatable practices. Guidance and skills should develop from actual collaboration. The fully agentic ambition remains intact, and routine authorized work can proceed without repeated permission requests.

Open scope: the first learning slice, the later autonomy boundaries and when to expand them. No fixed delivery schedule, automatic transition threshold or blanket permission to merge/deploy future features is established here.

Evidence: the user's explicit request to take the build slowly as a learning opportunity, co-develop first principles, abstractions, guidance and skills, and potentially move toward autolanding larger feature sets later.

Revisit: adjust pace and delegated scope as the user directs and as shared understanding and working evidence develop. Preserve the reasons for that adjustment.

## Template for the next substantive decision

- Status and date.
- Concrete choice and scope.
- Context and reasons.
- Serious alternatives under the same constraints.
- Consequences and uncertainty accepted.
- Evidence, including relevant source versions and experiments.
- What would justify revisiting the choice.
- Links to implementation and verification once they exist.

Only promote a proposal when the decision has actually been made within the user's delegated scope. Routine implementation work can remain autonomous; a decision record is an explanation, not an extra approval ceremony.
