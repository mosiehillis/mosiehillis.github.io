// Read each photo's dimensions (for <img width/height>, prevents layout shift)
// and shooting date. Dimensions come from the image header via sharp; the date
// comes from EXIF DateTimeOriginal, falling back to the file's mtime.

import fs from "node:fs";
import exifr from "exifr";
import sharp from "sharp";
import { toIso } from "./util.mjs";

export async function readPhoto(filePath) {
  let width = null;
  let height = null;
  let orientation = 1;
  try {
    const meta = await sharp(filePath).metadata();
    orientation = meta.orientation || 1;
    // sharp reports pre-rotation pixel dims; swap for rotated orientations.
    if (orientation >= 5) {
      width = meta.height || null;
      height = meta.width || null;
    } else {
      width = meta.width || null;
      height = meta.height || null;
    }
  } catch {
    /* leave dims null */
  }

  let date = null;
  try {
    const exif = await exifr.parse(filePath, { pick: ["DateTimeOriginal", "CreateDate"] });
    const raw = exif && (exif.DateTimeOriginal || exif.CreateDate);
    if (raw) date = toIso(raw);
  } catch {
    /* ignore */
  }
  if (!date) {
    try {
      date = toIso(fs.statSync(filePath).mtime);
    } catch {
      /* leave null */
    }
  }

  return { width, height, date };
}
