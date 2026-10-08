# Project context

## Established user intent

Denis wants to explore a revival or reinterpretation of the old Berserk Online tactical card game with a battlefield grid. The creative direction combines the older game's tactical identity with original artwork, selected balance changes, modern mobile TCG interaction design and expressive animated pixel-art creatures.

The early starter era is the initial reference: Леса–Горы and Болота–Степи. Historical material is incomplete, and reconstruction is part of the work. The project should preserve the distinction between recovered facts, interpretations of uncertain evidence and intentional new design.

Distribution begins in the browser. Interaction quality must be designed for phones from the beginning. There should be a credible route into mobile applications, but an app-store release, portrait-only layout and a particular native packaging technology are not yet requirements.

The user selected **Phaser + TypeScript** on 8 October 2026. Phaser will supply the presentation engine, and TypeScript will be used for the game client and rules core. This follows the preference for a mature game engine and concentrated custom engineering on the rules. The rules core should have a sufficiently expressive, strongish type system; exact compiler settings and modeling conventions remain implementation decisions. Rust was never required. Other engines and languages remain historical research, with no planned language migration. The presentation ambition remains high: animated creatures, expressive effects and clear, sophisticated gameplay interactions.

The project is intended to be developed fully agentically and to be self-contained. Decisions should preserve their reasons. The precise boundary of offline development and offline runtime is still open; the proposed interpretation is in the agent workflow document.

The initial phase is explicitly a learning opportunity with a deliberate development pace. We will co-develop the first principles, abstractions, guidance and skills that make the project understandable and maintainable. Early work should arrive in small, coherent pieces with room to explain, inspect and discuss consequential choices. The user anticipates larger autonomous feature sets and autolanding later; the timing and scope will grow from the foundation we establish. There is no fixed transition date or current blanket authorization to merge or deploy future features.

## References and their role

[Phase](https://github.com/phase-rs/phase) is inspiration for browser-first delivery and the ability to think independently about the future stack. The project is not committed to inheriting Phase's architecture, languages or implementation. Phaser is a separate, unrelated game framework.

Duelyst is a visual reference for animated pixel creatures on a tactical battlefield. The rules and interface remain our own design decisions. Phaser is the selected 2D presentation foundation. A future requirement for an actual 3D board and camera would have architectural consequences and should be assessed if it emerges; it is not an active reason to restart engine selection.

## Historical research already identified

Earlier investigation found archived official material for basic rules, expanded rules, starter lists and a card catalogue. These are research entry points rather than a reconciled specification of one exact client version:

- [Archived basic rules](https://web.archive.org/web/20131006111059/http://berserk.mail.ru/pravila_igry.html).
- [Archived expanded rules](https://web.archive.org/web/20131006081326/http://berserk.mail.ru/rashirennye_pravila.html).
- [Archived starters](https://web.archive.org/web/20131006063456/http://berserk.mail.ru/starty.html).
- [Archived card catalogue](https://web.archive.org/web/20140715111955/http://berserk.mail.ru/spisok_kart.html).

The basic-rules material describes a five-column, six-row battlefield. This supplies a sensible initial layout fixture. Later archive dates do not by themselves establish that every rule or card belongs to the selected starter era. Original-client behavior still needs reconciliation where it matters.

## Questions deliberately left open

- What is the smallest useful rules/presentation boundary in the selected Phaser + TypeScript stack?
- Which parts of the interface belong in Phaser and which, if any, should use web UI?
- Which phone orientation and inspection layout work best for a dense battlefield?
- Which original mechanics and card pool belong in the first playable scope?
- How much local play, AI play and online multiplayer should the first release include?
- Does self-contained mean offline operation after setup, or also a fully offline clean build?
- Which first small exercise will best develop our shared understanding of the game and its implementation?

Engine and rules-language selection is complete. The next work should develop the selected stack and reconcile the historical game through deliberate discussion and targeted evidence. A final MVP implementation brief follows that work. The eventual developer-agent handoff should preserve the learning pace and agreed autonomy scope.
