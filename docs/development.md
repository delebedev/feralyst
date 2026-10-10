# Development playbook

## Iterate on one interaction

1. Read the relevant Bead and name the user action, expected result and smallest useful proof. Reproduce reported failures before changing code.
2. For unfamiliar behavior or visual direction, explain the options with a small example or quick visual. Carry the accepted choice through the implementation.
3. Make the smallest complete change, including callers, tests, assets and documentation that depend on it. Use the repository's pinned runtime and package manager.
4. Run targeted checks. For presentation changes, exercise the changed interaction through the actual browser controls and canvas targets.
5. Inspect the result against acceptance. Repeat when a change, failure or unresolved concern justifies another check. Record the evidence and limits in Beads before calling the slice complete.

Keep each agreed slice reviewable. Commit coherent checkpoints during extended
iteration rather than letting unrelated finished slices accumulate in one diff.

## Choose proof for the claim

- Rules: use controlled positions and scripted dice through the engine or battle harness. Test legality, state transitions and outcomes against the cited rules. Synthetic profiles are design choices, not historical proof.
- Battle flow: verify the decision pause, playback order and committed state. Cover cancellation or Restart when changing asynchronous behavior; the bot and input must wait for playback.
- Presentation: use portrait browser viewports, including 320×568 and 390×844 when geometry or controls change. Confirm one-viewport fit, readable pending choices and reachable sprite/cell targets through real input. Exercise only the affected movement, targeting, cancellation, defence or inspection paths.
- Motion: inspect a live sequence or short clip. A static screenshot establishes appearance, not animation timing or interaction behavior.
- Phone: browser viewport checks are not real-device checks. Claim phone verification only after observing the physical device; otherwise state that it remains unverified.

Landscape is outside the current product scope. Findings confined to landscape
are scope exclusions, not tasks to accumulate or implicit requirements to implement.

For phone previews, follow the owner's private preview instructions. Keep private
hostnames and machine details outside the public repository. Preserve existing
services and leave a requested preview running; return its verified URL.

## Review and deliver

- Self-review the diff and affected callers against acceptance before publishing. Run `bun run check` at a PR or merge boundary; scripts and prerequisites are defined in `package.json` and README.
- For authorized GitHub review, publish the branch and request Copilot when asked. Inspect review comments and threads, not just the overall review summary.
- Assess each finding against the rulebook and accepted scope. Fix confirmed issues, verify and push within the user's authorization. Explain rejected or excluded findings without treating them as fixed. Resolve fixed threads only after their fixes land.
- Poll checks or requested reviews in bounded snapshots. For a requested later check, schedule a follow-up and stop it when handled; stay quiet while nothing actionable changes.
- Merge only with explicit authorization and passing required checks on the current head. Report what changed, what was actually verified and what remains uncertain.
- At handoff, record the source map, accepted scope, current behavior, verification, tracker/PR state and any immediate unfinished work. Keep private runtime details in a local companion file. A handoff is context, not authorization for new features.
