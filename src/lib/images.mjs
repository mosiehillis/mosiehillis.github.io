// Generate web derivatives for each source photo with sharp:
//   large (<=2048px), thumb (<=1280px), tint (tiny blurred LQIP placeholder).
// Output paths are human-friendly: img/<category>/<slug>/<NN>-<slug>.jpg
// Re-encoding is skipped when the output already exists and is newer than source.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { encodePath } from "./util.mjs";

const SIZES = { large: 2048, thumb: 1280 };

function isStale(src, dest) {
  try {
    return fs.statSync(src).mtimeMs > fs.statSync(dest).mtimeMs;
  } catch {
    return true; // dest missing
  }
}

async function render(src, dest, kind) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!isStale(src, dest)) return;
  const pipeline = sharp(src).rotate(); // auto-orient from EXIF
  if (kind === "tint") {
    await pipeline.resize(20).blur(2).jpeg({ quality: 50 }).toFile(dest);
  } else {
    await pipeline
      .resize(SIZES[kind], SIZES[kind], { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: kind === "large" ? 84 : 78, mozjpeg: true })
      .toFile(dest);
  }
}

// Process one shoot's photos. `photos` carries per-file {file, width, height, date}.
// Returns photo records with output URLs, dims, date, and cover flag.
export async function processShoot({ shoot, slug, photos, outRoot, coverFile }) {
  const relDir = `img/${shoot.category}/${slug}`;
  const out = [];

  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    const src = path.join(shoot.dir, p.file);
    const base = `${String(i + 1).padStart(2, "0")}-${slug}`;
    const names = {
      large: `${base}.jpg`,
      thumb: `${base}-thumb.jpg`,
      tint: `${base}-tint.jpg`,
    };

    await render(src, path.join(outRoot, relDir, names.large), "large");
    await render(src, path.join(outRoot, relDir, names.thumb), "thumb");
    await render(src, path.join(outRoot, relDir, names.tint), "tint");

    out.push({
      file: p.file,
      large: `/${encodePath(`${relDir}/${names.large}`)}`,
      thumb: `/${encodePath(`${relDir}/${names.thumb}`)}`,
      tint: `/${encodePath(`${relDir}/${names.tint}`)}`,
      w: p.width,
      h: p.height,
      date: p.date,
      cover:
        (coverFile && p.file === coverFile) ||
        /(^|[-_ ])cover([-_. ]|$)/i.test(p.file),
    });
  }

  return out;
}
