// Human-editable overrides that win over the automatic (LLM/heuristic) metadata.
// Keyed by the shoot's folder path under photos/, e.g. "concerts/Gavin DeGraw 2022-09-13".

import fs from "node:fs";
import yaml from "js-yaml";

export function loadOverrides(overridesPath) {
  try {
    const doc = yaml.load(fs.readFileSync(overridesPath, "utf8"));
    return doc && typeof doc === "object" ? doc : {};
  } catch {
    return {};
  }
}

// Apply the override for one shoot on top of derived metadata. Only the fields
// present in the override are replaced.
export function applyOverride(meta, override) {
  if (!override || typeof override !== "object") return meta;
  const out = { ...meta };
  for (const key of ["label", "date", "slug", "category", "cover"]) {
    if (override[key] != null) out[key] = override[key];
  }
  return out;
}
