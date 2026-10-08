# Issue tracking

Beads uses an embedded Dolt database here. Dolt holds the issue history;
JSONL exports are for interchange.

After cloning, run `bd bootstrap`. Use `bd dolt pull` before changing shared
issue state and `bd dolt push` to publish it.

Use `bd --help` for commands.
