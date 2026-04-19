// Lightweight keyword-based recommendation engine.
// Used by RecommendationPanel and ContextPanel to surface related missions
// and NASA imagery without any backend calls.

import { missions, type Mission } from "@/data/missions";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "at", "for", "with",
  "from", "by", "is", "are", "was", "were", "be", "been", "this", "that",
  "these", "those", "it", "its", "as", "but", "not", "no", "we", "our", "us",
  "you", "your", "he", "she", "they", "them", "their", "his", "her", "i",
  "me", "my", "image", "photo", "picture", "view", "shows", "showing",
  "nasa", "space", "credit", "credits",
]);

export function extractKeywords(text: string, limit = 12): string[] {
  if (!text) return [];
  const cleaned = text
    .toLowerCase()
    .replace(/<[^>]*>/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ");
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  const freq = new Map<string, number>();
  for (const tok of tokens) {
    if (tok.length < 4) continue;
    if (STOP_WORDS.has(tok)) continue;
    freq.set(tok, (freq.get(tok) ?? 0) + 1);
  }
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

function scoreMissionAgainstKeywords(mission: Mission, keywords: string[]): number {
  if (keywords.length === 0) return 0;
  const haystack = [
    mission.name,
    mission.fullName,
    mission.summary,
    mission.target,
    mission.imageSearchQuery,
    ...mission.timeline.map((e) => `${e.title} ${e.description}`),
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  for (const kw of keywords) {
    if (haystack.includes(kw)) score += 1;
    // Boost when mission name itself contains the keyword
    if (mission.name.toLowerCase().includes(kw)) score += 2;
    if (mission.target.toLowerCase().includes(kw)) score += 1;
  }
  return score;
}

export function recommendMissionsFromText(
  text: string,
  opts: { limit?: number; excludeIds?: string[] } = {}
): Mission[] {
  const { limit = 4, excludeIds = [] } = opts;
  const keywords = extractKeywords(text);
  const scored = missions
    .filter((m) => !excludeIds.includes(m.id))
    .map((m) => ({ mission: m, score: scoreMissionAgainstKeywords(m, keywords) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.mission);
  return scored;
}

export function recommendMissionsForMission(mission: Mission, limit = 3): Mission[] {
  // Build a keyword profile from the source mission
  const text = `${mission.name} ${mission.summary} ${mission.target} ${mission.imageSearchQuery}`;
  const keywords = extractKeywords(text);

  const scored = missions
    .filter((m) => m.id !== mission.id)
    .map((m) => {
      let score = scoreMissionAgainstKeywords(m, keywords);
      // Same target body is a strong signal
      if (m.target.toLowerCase() === mission.target.toLowerCase()) score += 4;
      // Same agency is a mild signal
      if (m.agency === mission.agency) score += 1;
      return { mission: m, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.mission);

  return scored;
}

// Build a search query for NASA "you may also like" image rows.
export function buildRelatedImageQuery(text: string, fallback = "space"): string {
  const keywords = extractKeywords(text, 4);
  if (keywords.length === 0) return fallback;
  return keywords.slice(0, 3).join(" ");
}
