// Derive clean shoot metadata { label, date, slug } from a messy folder name
// plus EXIF hints. Uses Claude (haiku) when ANTHROPIC_API_KEY is set; otherwise
// falls back to a deterministic heuristic so local builds work without a key.
//
// Results are cached per folder-content-hash by the caller (cache.mjs), so the
// API is hit at most once per new/changed shoot.

import Anthropic from "@anthropic-ai/sdk";
import { slugify, toIso } from "./util.mjs";

const MODEL = "claude-haiku-4-5";

const SYSTEM = `You normalize photo-shoot folder names for a photographer's portfolio website.

You are given:
- a category (concerts, weddings, or portraits)
- a raw folder name the photographer typed (often messy, abbreviated, or with a date jammed in)
- the dates the photos were actually taken (from EXIF), if available

Return clean display metadata:
- label: the human-friendly title shown on the site. For concerts, the band/artist name (no date). For weddings, the couple (e.g. "Sarah & James" or "The Smith Wedding"). For portraits, the person or family name. Fix capitalization and spacing. Do NOT include the date in the label.
- date: the shoot date as YYYY-MM-DD. Prefer a date clearly present in the folder name; otherwise use the earliest EXIF date provided. Use null only if there is genuinely no date signal.
- slug: a short URL-safe version of the label (lowercase, hyphens, no date), e.g. "gavin-degraw" or "smith-wedding".

Keep the label faithful to what the photographer wrote — clean it up, don't invent details.`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string" },
    date: { type: ["string", "null"] },
    slug: { type: "string" },
  },
  required: ["label", "date", "slug"],
};

// Deterministic fallback: pull a date out of the folder name, treat the rest as
// the label. Handles "Gavin DeGraw 2022-09-13", "Smith Wedding", etc.
export function heuristicMetadata({ folder, exifDates = [] }) {
  let label = folder;
  let date = null;

  const iso = folder.match(/(\d{4})[-_. ](\d{1,2})[-_. ](\d{1,2})/);
  if (iso) {
    date = `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
    label = folder.replace(iso[0], "");
  }
  label = label.replace(/[-_]+/g, " ").replace(/\s{2,}/g, " ").trim();
  if (!label) label = folder.trim();

  if (!date && exifDates.length) {
    date = exifDates.slice().sort()[0];
  }

  return { label, date, slug: slugify(label) };
}

let client = null;
function getClient() {
  if (!client) client = new Anthropic();
  return client;
}

export async function deriveMetadata({ folder, category, exifDates = [] }) {
  const fallback = heuristicMetadata({ folder, exifDates });

  if (!process.env.ANTHROPIC_API_KEY) {
    return { ...fallback, source: "heuristic" };
  }

  try {
    const userText =
      `category: ${category}\n` +
      `folder name: ${folder}\n` +
      `EXIF dates: ${exifDates.length ? exifDates.join(", ") : "(none)"}`;

    const response = await getClient().messages.create({
      model: MODEL,
      max_tokens: 512,
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
      messages: [{ role: "user", content: userText }],
    });

    const block = response.content.find((b) => b.type === "text");
    const parsed = JSON.parse(block.text);
    const label = (parsed.label || fallback.label).trim();
    return {
      label,
      date: parsed.date ? toIso(parsed.date) || fallback.date : fallback.date,
      slug: slugify(parsed.slug || label) || fallback.slug,
      source: "llm",
    };
  } catch (err) {
    console.warn(`  LLM metadata failed for "${folder}" (${err.message}); using heuristic`);
    return { ...fallback, source: "heuristic-fallback" };
  }
}
