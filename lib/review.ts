import { createClient } from "@/lib/supabase/server";
import { ENTITIES } from "@/lib/admin";

export type ReviewItem = {
  id: string;
  name: string;
  slug: string;
  entityKey: string;
  entityLabel: string;
  status: string;
  confidence: number | null;
  source: string | null;
};

const STATUS_ORDER: Record<string, number> = {
  unreviewed: 0,
  reviewed: 1,
  approved: 2,
};

export async function getReviewQueue(): Promise<ReviewItem[]> {
  const supabase = await createClient();
  const items: ReviewItem[] = [];

  for (const entity of Object.values(ENTITIES)) {
    const columns = `id, name, slug, ${entity.reviewStatusField}, ${entity.confidenceField}, ${entity.sourceField}`;
    const { data, error } = await supabase.from(entity.table).select(columns).order("name");
    if (error || !data) continue;

    for (const row of data as unknown as Record<string, unknown>[]) {
      const rawConfidence = row[entity.confidenceField];
      items.push({
        id: row.id as string,
        name: row.name as string,
        slug: row.slug as string,
        entityKey: entity.key,
        entityLabel: entity.singular,
        status: (row[entity.reviewStatusField] as string) || "unreviewed",
        confidence: rawConfidence != null ? Number(rawConfidence) : null,
        source: (row[entity.sourceField] as string) || null,
      });
    }
  }

  items.sort((a, b) => {
    const sa = STATUS_ORDER[a.status] ?? 0;
    const sb = STATUS_ORDER[b.status] ?? 0;
    if (sa !== sb) return sa - sb;
    const ca = a.confidence ?? -1;
    const cb = b.confidence ?? -1;
    if (ca !== cb) return ca - cb;
    return a.name.localeCompare(b.name);
  });

  return items;
}
