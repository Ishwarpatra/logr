import { z } from "zod";

export const NARRATE_TAGS = ["work", "milestone", "talk", "side_quest", "writing"] as const;

// One event extracted from a natural-language narrative.
export const narratedEvent = z.object({
  dateOn: z.string().describe("ISO date YYYY-MM-DD inferred from the text"),
  fullDate: z.boolean().describe("true only when a specific day was stated"),
  title: z.string().describe("a short headline for the event"),
  tags: z.array(z.enum(NARRATE_TAGS)).describe("one or more tags from the allowed set"),
  featured: z.boolean().describe("true for clear milestones/achievements"),
  body: z.string().describe("one or two sentences of detail"),
  links: z.array(z.string()).describe("full https URLs mentioned for this event (else empty)"),
});
export const narrateSchema = z.object({ events: z.array(narratedEvent) });
export type NarratedEvent = z.infer<typeof narratedEvent>;

const TAGSET = new Set<string>(NARRATE_TAGS);

/** Leniently pull events out of a model response: strips ```fences``` / prose,
 *  normalizes dates, drops non-enum tags. Survives non-structured output. */
export function parseNarrated(raw: string): NarratedEvent[] {
  const s = raw.replace(/```[a-z]*/gi, "").replace(/```/g, "").trim();
  const a = s.indexOf("{");
  const b = s.lastIndexOf("}");
  if (a < 0 || b < 0) return [];
  let obj: unknown;
  try {
    obj = JSON.parse(s.slice(a, b + 1));
  } catch {
    return [];
  }
  const list = (obj as { events?: unknown[] })?.events;
  if (!Array.isArray(list)) return [];

  const normDate = (v: unknown): string | null => {
    if (typeof v !== "string") return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    if (/^\d{4}-\d{2}$/.test(v)) return `${v}-01`;
    if (/^\d{4}$/.test(v)) return `${v}-01-01`;
    return null;
  };

  const URL_RE = /https?:\/\/[^\s)"'<>]+/gi;
  return list
    .map((raw): NarratedEvent | null => {
      const e = raw as Record<string, unknown>;
      const dateOn = normDate(e.dateOn);
      if (!dateOn || typeof e.title !== "string" || !e.title.trim()) return null;
      const tags = (Array.isArray(e.tags) ? e.tags : []).filter((t): t is NarratedEvent["tags"][number] =>
        typeof t === "string" && TAGSET.has(t)
      );
      const body = typeof e.body === "string" ? e.body : "";
      const fromModel = Array.isArray(e.links) ? e.links.filter((u): u is string => typeof u === "string") : [];
      const links = Array.from(new Set([...fromModel, ...(body.match(URL_RE) ?? [])]))
        .map((u) => u.trim().replace(/[.,)]+$/, ""))
        .filter((u) => /^https?:\/\//.test(u))
        .slice(0, 4);
      return {
        dateOn,
        fullDate: !!e.fullDate,
        title: e.title.trim().slice(0, 200),
        tags: tags.length ? tags : ["work"],
        featured: !!e.featured,
        body,
        links,
      };
    })
    .filter((e): e is NarratedEvent => e !== null);
}

export function buildNarratePrompt(text: string): string {
  const today = new Date().toISOString().slice(0, 10);
  return [
    `Today is ${today}. Read the narrative below and extract the person's life and career events as structured data.`,
    "",
    "Rules:",
    "- Infer `dateOn` as ISO YYYY-MM-DD. If only a month+year is given, use day 01 and set fullDate=false. If only a year, use 01-01 and fullDate=false. Set fullDate=true ONLY when an exact day is stated. Resolve relative phrases (\"last year\", \"now\") against today.",
    "- Choose `tags` from the allowed set; use `milestone` for notable wins and set `featured=true` for those.",
    "- Keep `title` short; `body` to one or two sentences, in the person's voice.",
    "- Put any full https URLs mentioned for an event into its `links` array; otherwise use [].",
    "- Extract one entry per distinct event. Do NOT invent anything not in the text.",
    "",
    "NARRATIVE:",
    text,
  ].join("\n");
}
