// Walk photos/<category>/<shoot>/ and return the raw structure plus a
// content hash per shoot. The hash is used as the cache key for the (paid)
// metadata step, so it must change only when the photos in a folder change.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const IMAGE_RE = /\.(jpe?g|png|webp|tiff?)$/i;

function isImage(name) {
  return IMAGE_RE.test(name) && !name.startsWith(".");
}

// Hash the sorted list of (name, size, mtime) for the folder's images.
function hashFolder(dir, files) {
  const h = crypto.createHash("sha1");
  for (const f of files.slice().sort()) {
    const st = fs.statSync(path.join(dir, f));
    h.update(`${f}:${st.size}:${Math.round(st.mtimeMs)}\n`);
  }
  return h.digest("hex").slice(0, 16);
}

export function scanPhotos(photosDir) {
  if (!fs.existsSync(photosDir)) return [];
  const categories = [];

  for (const category of fs.readdirSync(photosDir).sort()) {
    const catDir = path.join(photosDir, category);
    if (!fs.statSync(catDir).isDirectory() || category.startsWith(".")) continue;

    const shoots = [];
    for (const folder of fs.readdirSync(catDir).sort()) {
      const shootDir = path.join(catDir, folder);
      if (!fs.statSync(shootDir).isDirectory() || folder.startsWith(".")) continue;

      const files = fs.readdirSync(shootDir).filter(isImage).sort();
      if (files.length === 0) continue; // empty folder -> not a shoot

      shoots.push({
        category,
        folder,
        dirRel: `${category}/${folder}`, // key for overrides
        dir: shootDir,
        files,
        hash: hashFolder(shootDir, files),
      });
    }

    categories.push({ slug: category, shoots });
  }

  return categories;
}
