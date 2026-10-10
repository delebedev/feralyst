# Feralyst handoff

Snapshot: 2026-10-10. PR #11 collects the Archer/Flight slice, portrait presentation
iteration, source organization and current agent workflow. Inspect Git and the
PR for its current merge state before resuming.

## Accepted scope and current behavior

Portrait-only local skirmish. North is the human side at the bottom; south is a
basic automatic opponent. Gameplay fits one viewport. Landscape is unsupported
and has no outstanding backlog item; reintroduce it only on Denis's explicit request.

Five synthetic creatures per side: Fighter, Armor 1 Guard, Heal 2 Ward, Range 2
Archer and one Flight Gryphon. README records profiles and rule interpretations.
Flight uses the Additional Zone; ground preparation against an all-flyer squad
buys one air strike on the next own turn. Archer can shoot flyers.

Compact cell footprints are independent of sprite size. Selection and targets
use colored foot rings. Movement runs for 280 ms with decorations following;
input and opponent wait. Reduced motion snaps movement. Restart cancels playback.

Painted terrain fills the frame and randomizes at launch and Restart. The cog
contains Restart only. Actions is the lower round right-side button; End turn is
above it and becomes Take the attack during defence. Inspection opens from the
selected name; History is in the action fan. Flyers remain close to their side's
third row. Grid coordinates appear in inspection only.

## Source map

- `src/rules/`: immutable rule transitions, combat calculation, types and shared cell coordinates.
- `src/battle/`: sessions, legal decisions, opponent, playback, starting positions and headless harness/demo.
- `src/browser/`: Phaser board, sprites, feedback, layout, native controls and styles.
- `src/main.ts`: startup and wiring. Tests stay beside their modules.
- `assets/duelyst/`: pinned CC0 source metadata and license; generated atlases and terrain live under `public/`.

## Verification and limits

The implementation and source cleanup passed the full check gate with 198 tests.
The headless demo still reaches its scripted outcome. Portrait browser checks at
320×568 and 390×844 covered no scrolling, movement, Archer-to-flyer targeting,
Ward controls, opponent handoff, defender choices and Restart during playback.
No warning or error appeared in the browser console during these checks.

Physical-phone behavior remains unverified. The presentation currently has one
flyer slot per side. The bot uses a greedy approach and can stall behind occupied
paths. Recruitment, other card-specific abilities and symbiotes remain outside
this slice; the optional Weakening choice remains omitted as explained in README.

Copilot's only reported finding was battlefield collapse in landscape dimensions.
Denis removed landscape from scope and dropped the associated task. This is an
accepted limitation, not a repaired sizing formula.

## Resume

Read AGENTS.md, README and docs/development.md. Inspect `git status`, `bd ready`
and any relevant `bd show` before changing state. Current authorized delivery
ends with PR #11; no next gameplay feature has been selected. The review polling
automation is paused. Private preview URLs and temporary evidence paths belong
in the local companion handoff, not this repository.
