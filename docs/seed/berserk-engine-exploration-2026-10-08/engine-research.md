# Engine research for a browser-first tactical card game

Research date: 8 October 2026. Current status: **Phaser + TypeScript selected**. Capabilities below are grounded in linked primary sources; assessments of fit and proposed experiments are engineering judgments. Phone performance and development-loop speed have not yet been measured. Comparisons with other engines and languages are preserved as historical research.

## Accepted direction and scope of this research

The user selected Phaser + TypeScript after this investigation. Phaser will provide the presentation engine; TypeScript will serve the game client and rules core. An independent rules package remains the recommended architecture. Record 007 in decision-records.md captures the accepted choice, supporting rationale, open details and reasons to revisit.

The earlier shortlist included Godot for integrated authoring and Defold for its mobile and automation workflows. PixiJS, Bevy and Unity supplied additional context. Their sections explain the tradeoffs considered; they do not direct a continuing engine competition.

Subsequent work should validate and refine the chosen combination through small, understandable examples. The user has explicitly chosen a deliberate initial learning pace, with first principles, abstractions, guidance and skills developed together. Engine acceptance is a product decision; it is not a claim that phone performance or the agent workflow has already been proven.

## Clarified rules-language requirement

The user clarified on 8 October 2026 that Rust was never required, then selected TypeScript. The underlying requirement is a sufficiently expressive static type system for the rules core. Rust-specific integration notes below are historical research; there is no planned Rust migration.

Our proposed TypeScript modeling work should cover distinct domain identities, explicit command and state variants, nullability and comprehensive handling of decisions and effects. We should inspect how easily agents can bypass those checks and how the build exposes useful diagnostics. Actual move legality and external input still need runtime validation.

Strict checking is the proposed baseline for the selected TypeScript core. Its discriminated unions and exhaustiveness patterns can support a well-typed domain model. Additional index-access and optional-property checks should be considered explicitly, since strict alone does not enable every useful check. These settings and modeling conventions are proposals, not new user-imposed requirements. [Strict](https://www.typescriptlang.org/tsconfig/strict.html) · [Narrowing and exhaustiveness](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) · [Indexed access](https://www.typescriptlang.org/tsconfig/noUncheckedIndexedAccess.html) · [Optional properties](https://www.typescriptlang.org/tsconfig/exactOptionalPropertyTypes.html).

Earlier alternatives included Kotlin/JS, given the user's experience. The official documentation describes compilation to JavaScript and sharing compatible common logic with a JVM backend. The exported interface, dependency compatibility, browser build and agent workflow were not proven for this project. [Kotlin/JS](https://kotlinlang.org/docs/js-overview.html). C# was a natural candidate in a Unity stack; Rust was conditional on justifying its complete integration cost. None is selected for the initial implementation.

Plain Lua by itself does not supply the requested static-checking direction for the rules core. A typed layer or separate typed core would need evaluation for Defold. This does not disqualify Lua for presentation. GDScript supports static typing and should be evaluated against concrete domain-modeling needs rather than dismissed by language label. [GDScript typing](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/static_typing.html).

## What the engine must make easy

A useful engine must support more than moving sprites. Our representative experience includes a populated grid, persistent creature animation, precise selection, readable statuses, card inspection, reaction choices, scrolling text and a coherent sequence of combat effects. The same screen must remain understandable when a thumb obscures part of it.

The development environment must let an agent change that experience, build it, load a named scenario, inspect its state, exercise actual input and capture the visible result. A CLI build is necessary evidence of automation, but does not establish the entire loop.

Rules throughput and graphics performance are separate workloads. Normal turn resolution, bulk balance simulations, rendering and UI layout should be measured separately. A fast rules library will not fix expensive effects or poorly coordinated scrolling.

## Phaser — selected

### Capabilities and platform direction

Phaser is a 2D JavaScript/TypeScript game framework whose primary target is desktop and mobile browsers. Mobile app delivery uses additional packaging tools. Its runtime supplies scenes, animation, input, sound, textures, scaling and the game loop. [Overview](https://docs.phaser.io/phaser/getting-started/what-is-phaser) · [Runtime systems](https://docs.phaser.io/phaser/concepts/game).

The verified release is 4.2.1, dated 9 July 2026. Phaser 4 changed its renderer and visual-effects architecture, so version-specific examples matter. Its migration article describes unified filters, expanded lighting and changes to custom rendering. Those are capability statements, not measured results for our scene. [Release](https://github.com/phaserjs/phaser/releases/tag/v4.2.1) · [Version 4 changes](https://phaser.io/news/2026/05/phaser-3-vs-phaser-4).

### Fit for this game

My judgment is that Phaser offers the best initial balance between adopting presentation machinery and retaining a straightforward web project. The battlefield can use sprites, layers, cameras and effects, while the rules stay in a separate package.

An optional web UI layer can handle card inspection, searchable collections, menus and readable action panels. This could be React, but React is not a requirement. The official React/TypeScript template demonstrates a Vite workflow, a bridge to Phaser, hot reload and production builds. [Template](https://github.com/phaserjs/template-react-ts).

This composition carries real work. Focus, gestures, canvas scaling, overlays and animation coordination need clear ownership. Keep the battlefield within one rendering system where practical. The DOM layer should not independently reconstruct combat or own another authoritative copy of battle state. Phaser's DOM-element documentation also notes that HTML elements cannot be interleaved arbitrarily between canvas sprites. [DOM integration](https://docs.phaser.io/phaser/concepts/gameobjects/dom-element).

A particularly elaborate card transition across the interface and battlefield is a good test of the composition. If it requires fragile synchronization or inconsistent hit areas, the proposed UI split should change.

### Agentic and self-contained implications

A local source-and-build workflow is available without adopting a hosted game-development service. The separate Phaser Game Agent MCP product uses an account, credits and cloud sandboxes; it is optional for using Phaser itself. [Hosted agent product](https://phaser.io/agent/mcp).

The official template's default scripts send an anonymous build log. It documents no-log commands and removal of the script. The template should be adapted to our chosen local workflow rather than treated as an immutable dependency. [Template behavior](https://github.com/phaserjs/template-react-ts).

The proposed project-specific additions are a named-scenario launcher, structured player-visible state, action identifiers, render readiness, input-target bounds and failure artifacts. None requires making rules depend on Phaser scene objects.

### Browser to mobile

Capacitor documents a native-container approach for web applications and explicitly covers canvas/WebGL games. It is a credible packaging candidate. It preserves a web-based presentation rather than translating our game into a different native renderer. Target-device performance, background/resume behavior and platform integrations still need testing. [Capacitor](https://capacitorjs.com/docs) · [Games guide](https://capacitorjs.com/docs/guides/games).

### When it should win

Choose this route if the real-phone presentation and the agent edit-build-inspect loop work well, and the DOM/canvas division stays comprehensible. Its case becomes weaker if actual 3D scene authoring becomes central or if our integrated UI transitions repeatedly fight the composition.

## Godot — alternative considered

### Capabilities and authoring model

Godot provides a dedicated 2D renderer, sprite and cutout animation, particles, lighting and custom shaders. Its UI system includes layout containers and rich text, so a card-heavy interface does not have to be built only from low-level drawing primitives. [2D tools](https://docs.godotengine.org/en/stable/tutorials/2d/introduction_to_2d.html) · [Containers](https://docs.godotengine.org/en/stable/tutorials/ui/gui_containers.html) · [Rich text](https://docs.godotengine.org/en/stable/tutorials/ui/bbcode_in_richtextlabel.html).

The attraction is an integrated space for composing the battlefield, effects, UI and transitions. If real 3D scenery becomes part of the direction, that also has a natural home. My judgment is that this is the strongest alternative when authored game presentation should shape the workflow.

Godot is not inherently dependent on a human operating its editor. It supports command-line execution and headless exports, and its text scene format is designed to be readable and version-controlled. Agents still need to validate imports, references and the rendered outcome. [CLI](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html) · [Text scenes](https://docs.godotengine.org/en/stable/engine_details/file_formats/tscn.html).

### Browser and mobile consequences

Current stable documentation describes WebAssembly/WebGL 2 browser exports and native Android/iOS exports. The web target uses the Compatibility renderer; C# projects in Godot 4 do not currently have a supported web export in these docs. Single-threaded web export improves compatibility, while extension support adds deployment requirements. These constraints must be tested with the chosen stack. [Web export](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html).

For our product, startup time, memory, touch behavior, audio and recovery after backgrounding are more informative than an empty-scene benchmark. A native build performing well would not settle whether browser delivery meets the requirement.

Godot's official web demo index also says screen-reader support is unavailable on the web platform. We should not assume native accessibility machinery becomes browser semantics automatically. This affects both accessible interaction and the amount of custom semantic inspection we may need. [Web demo limitations](https://godotengine.github.io/godot-demo-projects/).

### Conditional rules-language integration options

Godot plus a Rust core is a separate evaluation from Godot by itself. The godot-rust web guide still labels support experimental and describes an Emscripten-based build. A March 2026 update reports WebAssembly prebuilds and removes the earlier need for api-custom/LLVM; the general guide contains older instructions. Pinning the entire tested combination is essential. [Web guide](https://godot-rust.github.io/book/toolchain/export-web.html) · [March update](https://godot-rust.github.io/dev/march-2026-update/).

A second proposed approach is a browser-facing JavaScript adapter around a separately compiled rules module, with a native adapter for native Godot builds. Godot exposes JavaScriptBridge for browser integration. This is an architectural possibility to prove, not a verified ready-made integration for our game. [JavaScriptBridge](https://docs.godotengine.org/en/stable/tutorials/platform/web/javascript_bridge.html).

A statically typed GDScript rules module offers simpler integration and can be separated from presentation. Its type-system capabilities should be tested against our required domain model. Running it still requires the Godot runtime, which is a different portability commitment from an ordinary standalone library. Neither typing adequacy nor runtime independence should be assumed from the engine choice.

### When it should win

Choose Godot if integrated composition materially improves visual and UI iteration, agents can operate the complete workflow reliably, and the selected rules integration passes browser and mobile checks. Avoid selecting it solely on the assumption that native export or Rust support makes every target equally straightforward.

## Defold — alternative considered

### Why it belongs on the shortlist

Defold is a substantial alternative for a sprite-oriented cross-platform game. Its GUI layouts can adapt by orientation and aspect ratio, with different property values per layout. That provides useful machinery for phone screens, although our card inspector and interaction hierarchy remain product work. [GUI layouts](https://defold.com/manuals/gui-layouts/).

Its current automation documentation is especially relevant. Text resource files, an editor HTTP API, documentation discovery and structured build/inspection operations are explicitly documented. This is a concrete starting point for agents, not merely a promise that they can click an editor. [AI agents](https://defold.com/manuals/ai-agents/) · [Editor API](https://defold.com/manuals/editor-http-api/).

The verification docs cover Lua module tests, running collections, browser input tests and visual checks. Some richer runtime operations use an optional debug extension. A browser build needs browser-side automation; the native runtime service should not be assumed to exist unchanged in the browser. [Testing](https://defold.com/manuals/automated-testing/) · [Runtime service](https://defold.com/manuals/engine-service/).

### What we would own

Lua is the natural presentation language. Given the clarified typing requirement, plain Lua by itself is no longer a leading rules-core option. Defold would need a suitable typed language layer or a separate typed core, with the full build and target integration verified. A substantial custom card UI would still require a component and layout design appropriate to this engine.

The browser target uses WebAssembly and currently requests WebGL 2 by default, with a WebGL 1 context option. Its docs explicitly state that HTML5 hot reload is unavailable. The actual web iteration loop therefore deserves measurement even if native iteration is convenient. [HTML5](https://defold.com/manuals/html5/).

### Rust and build independence

The standard native-extension system uses a cloud builder by default, and supports configuring a self-hosted build server. Bob supplies command-line project builds and bundles. Self-hosting can preserve control, but adds a build component that the repository must describe and reproduce. [Extensions](https://defold.com/manuals/extensions/) · [Bob](https://defold.com/manuals/bob/).

The community defold-rs project describes experiments in Rust extensions and requires a Rust-enabled extension-builder fork. This review did not verify a current Rust-to-HTML5 integration we should adopt. That is uncertainty in our evaluated combination, not a claim of impossibility. [Rust extension project](https://github.com/defold-rs/dmsdk).

Its license is available for inspection and permits commercial games, while restricting commercialization of the engine/editor as an engine product. It should not be casually described as identical to an MIT license. [Defold license](https://defold.com/license/).

### When it should win

Defold should win if its actual automation and mobile workflow are better for our product and a sufficiently typed rules-language path works well. Prove the chosen typed-core integration before investing in a complete interface. The question is type-system adequacy and toolchain fit; there is no requirement that the integration use Rust.

## PixiJS with web UI

PixiJS is a credible choice for deliberately composing a rendering layer with a web application. Its attraction is selective control over the battlefield while card interfaces and navigation remain ordinary web UI. The tradeoff is responsibility for coordinating more of the presentation stack: scene transitions, audio, animation policy, resource lifetime and application-to-renderer synchronization.

It should win because that composition helps our design. A smaller rendering layer does not automatically produce a simpler project.

There is a current-version correction to the earlier light research: PixiJS 8.22.0 has a Canvas renderer, and its versioned API permits an explicit WebGL/Canvas preference. The general v8 guide's earlier coming-soon statement is stale. Available backends do not imply identical effect support or performance. [Versioned renderer API](https://pixijs.download/v8.22.0/docs/rendering.autoDetectRenderer.html).

Pixi's optional accessibility system creates DOM overlays with labels, focus and interaction handling. That can support both assistive use and semantic inspection, but requires deliberate metadata. AssetPack provides a configuration-driven CLI and watch mode for asset preparation. [Accessibility](https://pixijs.com/8.x/guides/components/accessibility) · [AssetPack](https://pixijs.io/assetpack/docs/guide/getting-started/cli/).

My present judgment is to keep Pixi as a reserve for a consciously selective architecture. The user's preference to adopt a mature game engine gives Phaser an initial advantage in presentation coordination, rather than establishing a limit on Pixi's visual quality.

## Bevy

Bevy offers an appealing all-Rust codebase. A pure rules crate can be shared with the presentation, tests, CLI and server without a foreign-language boundary. The rules do not need to adopt the presentation engine's ECS to gain that benefit.

The cost is maturity in the parts our product will exercise heavily. Bevy's introductory documentation still warns about missing features, sparse documentation and recurring breaking releases. Its current standard-widget example is explicitly experimental and notes remaining UX issues. [Introduction](https://bevy.org/learn/quick-start/introduction/) · [Widgets](https://bevy.org/examples/ui-user-interface/standard-widgets-observers/).

My judgment is that Bevy fits when building Rust game-development infrastructure is itself a desired part of the project. It is less aligned with concentrating effort on rules and polished card interactions while adopting mature presentation machinery. Agents can build additional UI systems, but we still own their design, validation and maintenance.

## Unity

Unity remains technically viable. Current documentation explicitly supports some mobile browsers, including iOS Safari and Android Chrome, so an old blanket statement that Unity Web cannot target phones would be incorrect. This establishes support rather than a performance result. [Browser compatibility](https://docs.unity3d.com/Manual/webgl-browsercompatibility.html).

Its UI documentation describes both UI Toolkit and uGUI, with different strengths for interface-heavy screens and animation workflows. Command-line batch operation, editor methods and licensing operations are documented. [UI systems](https://docs.unity3d.com/Manual/UI-system-compare.html) · [Editor CLI](https://docs.unity3d.com/Manual/EditorCommandLineArguments.html).

My judgment is that the editor, asset pipeline and automation environment are a larger commitment than we currently need. They could be justified by specific authored effects, team expertise or a strongly native product direction. A phone loading test and a reproducible agent loop would decide that question. A particular Rust integration has not been established in this review; an independent C# core would be another language choice to evaluate.

## Selected stack and historical alternatives

### Selected: Phaser presentation and TypeScript rules

Phaser plus TypeScript presentation, optionally web UI, and an independent TypeScript rules package is the selected direction. The same rules package can serve browser execution, tests and a JavaScript server runtime, although no backend runtime is selected yet. Strict configuration and explicit domain modeling are the proposed approach to the typing requirement. TypeScript can remain the long-term implementation; there is no assumed future Rust rewrite.

Its main architectural discipline is preventing scene/application objects from leaking into rules. A language-level type system should be complemented by runtime validation at untrusted input boundaries.

### Historical alternative: web presentation and Rust rules

Phaser plus TypeScript presentation and a pure Rust rules crate compiled to WebAssembly was another researched combination. It adds compilation and interface work, but can support the same core in a native CLI/server and browser. A worker is a possible scheduling boundary for expensive computation, not a remedy for rendering cost.

Rust should earn that cost through domain modeling, maintenance, native reuse or simulation needs. The shape of the UI and quality of animation do not follow from the rules language.

### Historical alternative: integrated engine and separate rules

Godot with GDScript presentation and a suitable typed rules module or external typed core remains plausible, conditional on type-system adequacy and a verified target toolchain. Defold with Lua presentation needs a suitable typed rules path; plain Lua rules alone no longer match the clarified preference. Engine-language rules can be independently testable while remaining tied to that language/runtime.

These alternatives should be compared honestly against the requirement: independence from rendering and independence from the engine runtime are different levels of portability.

## A proposed rules boundary

The core should accept explicit player commands and return coherent player views, pending decisions, structured rejection reasons and ordered semantic events. The presentation controls how resolved events are shown. Choices that belong to the rules remain explicit; animations can pace or defer presentation without deciding combat outcomes.

For example, an attack declaration may pause for a defender choice. Only after that input should the relevant resolution continue. A final board snapshot alone loses the sequence needed for expressive animation and useful explanations.

Use one authoritative implementation. For online play, a shared rules library does not mean sending the server's complete hidden state to clients. Player-facing observations, previews and logs must respect information visibility; local debugging can expose a fuller view.

Replay needs an explicit determinism contract. For the selected TypeScript core, the proposed design specifies resolution order, randomness, numeric representations and rules/content versions. Keep ambient clocks and animation timing outside rules resolution. Record the outcomes needed for stable reproduction; a seed alone does not define long-term compatibility. Earlier Rust research illustrated the same need to define behavior explicitly: [HashMap](https://doc.rust-lang.org/std/collections/struct.HashMap.html) · [Rand reproducibility](https://rust-random.github.io/book/crate-reprod.html).

A commands/snapshots/events interface does not require full application event sourcing, a universal card language, a microservice architecture or an ECS in the rules core. Those choices should be justified separately if they become useful.

## Proposed validation of the selected stack

The following is a proposed path for accumulating evidence, not a benchmark report or an instruction to build the entire fixture immediately. Keep the work consistent with the accepted initial learning pace.

Begin with one agreed question and a small Phaser + TypeScript example that makes the answer inspectable. Develop the rules/presentation boundary together using a concrete interaction. The first example should expose assumptions and tradeoffs, and create useful working evidence for the next discussion. There is no current multi-engine comparison to perform.

Over successive slices, a representative fixture can grow to include the five-by-six grid, a dense squad, looping sprites, status markers, selection, movement, an attack with a reaction choice, card inspection, long text and a scrollable event history. Use the intended richness, including representative effects, when testing presentation limits. Compare portrait and landscape before treating either as settled.

Measure cold load to an interactive battlefield, compressed download size, memory, frame pacing during effects, tap feedback, text readability and background/resume recovery. Use a real target iPhone and a representative Android device; desktop emulation supplements them. A provisional 60-fps goal is a design objective, not evidence that any candidate meets it. Set the supported device range before turning measurements into pass/fail gates.

Measure the agent workflow as well: clean setup, asset rebuild, scene edit, application build, scenario launch, actual input, state inspection, screenshot/clip capture and failure reproduction. An agent should be able to change a rule and an animation, verify both through relevant checks, and leave a concise explanation.

Use failures to refine the chosen implementation: inaccessible targeting on the chosen phone, unacceptable startup cost, unmanageable UI synchronization, irreproducible builds or unstable rules integration each call for diagnosis. Revisit the stack only if a material failure persists despite reasonable fixes or a new product requirement changes the constraints. Determine whether the cause is the engine, architecture or implementation before assigning blame.

The immediate objective is a small, understandable step within Phaser + TypeScript. Larger autonomous feature delivery can follow as the first principles, abstractions, guidance and skills become established through collaboration. The research does not set a delivery deadline or an automatic transition to that later mode.
