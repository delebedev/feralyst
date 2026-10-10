import assert from "node:assert/strict";

type SourceFrame = { frame_name: string; x0: number; y0: number; width: number; height: number };
type SourceAtlas = { width: number; height: number; frames: Record<string, SourceFrame[]> };

for (const file of new Bun.Glob("*.json").scanSync({ cwd: "assets/duelyst" })) {
  const asset = file.slice(0, -5);
  const source = (await Bun.file(`assets/duelyst/${asset}.json`).json()) as SourceAtlas;
  const png = new DataView(await Bun.file(`public/creatures/${asset}.png`).arrayBuffer());
  assert.equal(png.getUint32(0), 0x89504e47, "Expected a PNG source");
  assert.equal(source.width, png.getUint32(16), "Atlas width must match PNG");
  assert.equal(source.height, png.getUint32(20), "Atlas height must match PNG");
  for (const animation of ["idle", "run", "attack", "hit", "death"])
    assert(source.frames[animation]?.length, `Missing ${animation} frames`);
  const frames = Object.fromEntries(
    Object.values(source.frames)
      .flat()
      .map((entry) => {
        const { frame_name, x0: x, y0: y, width: w, height: h } = entry;
        assert([x, y, w, h].every(Number.isInteger), "Frame bounds must be integers");
        assert(
          x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= source.width && y + h <= source.height,
          "Frame outside texture",
        );
        return [
          frame_name,
          {
            frame: { x, y, w, h },
            rotated: false,
            trimmed: false,
            spriteSourceSize: { x: 0, y: 0, w, h },
            sourceSize: { w, h },
          },
        ];
      }),
  );
  assert.equal(
    Object.keys(frames).length,
    Object.values(source.frames).flat().length,
    "Duplicate frame names",
  );
  const atlas =
    JSON.stringify({
      frames,
      meta: { image: `${asset}.png`, size: { w: source.width, h: source.height } },
    }) + "\n";
  const destination = `public/creatures/${asset}.json`;
  if (process.argv.includes("--check"))
    assert.equal(await Bun.file(destination).text(), atlas, "Rebuild creature atlases");
  else await Bun.write(destination, atlas);
}
