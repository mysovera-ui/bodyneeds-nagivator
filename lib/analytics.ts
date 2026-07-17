import { createClient } from "@/lib/supabase/server";

export async function logSearch(
  query: string,
  symptomIds: string[],
  nutrientCount: number,
  foodCount: number,
) {
  try {
    const trimmed = query.trim();
    if (!trimmed) return;
    const supabase = await createClient();
    await supabase.from("search_logs").insert({
      query: trimmed,
      symptom_ids: symptomIds,
      nutrient_count: nutrientCount,
      food_count: foodCount,
    });
  } catch {
    // Analytics logging is best-effort; never block the search itself.
  }
}

export type SearchStats = {
  totalAllTime: number;
  total7d: number;
  total30d: number;
};

export async function getSearchStats(): Promise<SearchStats> {
  const supabase = await createClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [allTime, last7, last30] = await Promise.all([
    supabase.from("search_logs").select("id", { count: "exact", head: true }),
    supabase
      .from("search_logs")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
    supabase
      .from("search_logs")
      .select("id", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo),
  ]);

  return {
    totalAllTime: allTime.count ?? 0,
    total7d: last7.count ?? 0,
    total30d: last30.count ?? 0,
  };
}

export type TopSymptom = {
  id: string;
  name: string;
  slug: string;
  count: number;
};

export async function getTopSearchedSymptoms(limit = 10): Promise<TopSymptom[]> {
  const supabase = await createClient();

  const { data: logs, error } = await supabase.from("search_logs").select("symptom_ids");
  if (error || !logs) return [];

  const counts = new Map<string, number>();
  for (const row of logs as { symptom_ids: string[] }[]) {
    for (const id of row.symptom_ids ?? []) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  if (counts.size === 0) return [];

  const topIds = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);

  const { data: symptoms } = await supabase
    .from("symptoms")
    .select("id, name, slug")
    .in(
      "id",
      topIds.map(([id]) => id),
    );

  const byId = new Map((symptoms ?? []).map((s) => [s.id as string, s]));

  return topIds
    .map(([id, count]) => {
      const s = byId.get(id);
      if (!s) return null;
      return { id, name: s.name as string, slug: s.slug as string, count };
    })
    .filter((x): x is TopSymptom => x !== null);
}

export type TopTerm = {
  term: string;
  count: number;
};

export async function getTopSearchTerms(limit = 10): Promise<TopTerm[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("search_logs").select("query");
  if (error || !data) return [];

  const counts = new Map<string, number>();
  for (const row of data as { query: string }[]) {
    const key = row.query.trim().toLowerCase();
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([term, count]) => ({ term, count }));
}
