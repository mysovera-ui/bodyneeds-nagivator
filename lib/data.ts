import { createClient } from "@/lib/supabase/server";

export type Symptom = {
  id: string;
  name: string;
  slug: string;
  explanation: string;
  lifestyle_factors: string;
  nutritional_factors: string;
  medical_causes: string;
  red_flags: string;
  professional_next_steps: string;
  created_at: string;
};

export type Nutrient = {
  id: string;
  name: string;
  slug: string;
  body_function: string;
  daily_requirement: string;
  deficiency_signs: string;
  excess_risks: string;
  at_risk_groups: string;
  supplement_forms: string;
};

export type FoodSource = {
  id: string;
  name: string;
  slug: string;
  serving_size: string;
  dietary_category: string;
  allergens: string | null;
  availability: string | null;
  dietary_patterns: string | null;
};

export type SupplementCategory = {
  id: string;
  name: string;
  slug: string;
  forms: string;
  purpose: string;
  advantages: string;
  disadvantages: string;
  side_effects: string;
  cautions: string;
  interactions: string;
  at_risk_groups: string;
};

export type NutrientWithFoods = Nutrient & {
  relevance_note: string | null;
  food_sources: (FoodSource & { amount_per_serving: string | null })[];
};

export type SupplementWithNote = SupplementCategory & {
  relevance_note: string | null;
};

export type FullSymptom = Symptom & {
  nutrients: NutrientWithFoods[];
  supplements: SupplementWithNote[];
};

// ── Search ──────────────────────────────────────────────────────────────────

export async function searchSymptoms(q: string): Promise<Symptom[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("symptoms")
    .select("*")
    .ilike("name", `%${q}%`)
    .order("name")
    .limit(10);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function searchNutrients(q: string): Promise<Nutrient[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nutrients")
    .select("*")
    .ilike("name", `%${q}%`)
    .order("name")
    .limit(10);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function searchFoodSources(q: string): Promise<FoodSource[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("food_sources")
    .select("*")
    .ilike("name", `%${q}%`)
    .order("name")
    .limit(10);
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ── Full symptom assembly (core result card) ────────────────────────────────

export async function getFullSymptomBySlug(
  slug: string,
): Promise<FullSymptom | null> {
  const supabase = await createClient();

  const { data: symptom, error: symptomErr } = await supabase
    .from("symptoms")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (symptomErr) throw new Error(symptomErr.message);
  if (!symptom) return null;

  return assembleFullSymptom(symptom);
}

export async function assembleFullSymptom(
  symptom: Symptom,
): Promise<FullSymptom> {
  const supabase = await createClient();

  const { data: symptomNutrients, error: snErr } = await supabase
    .from("symptom_nutrients")
    .select("relevance_note, nutrients(*)")
    .eq("symptom_id", symptom.id);
  if (snErr) throw new Error(snErr.message);

  const nutrientRows = (symptomNutrients ?? []) as unknown as {
    relevance_note: string | null;
    nutrients: Nutrient;
  }[];
  const nutrientIds = nutrientRows.map((r) => r.nutrients.id);

  let foodByNutrient = new Map<
    string,
    (FoodSource & { amount_per_serving: string | null })[]
  >();
  if (nutrientIds.length > 0) {
    const { data: nfs, error: nfsErr } = await supabase
      .from("nutrient_food_sources")
      .select("nutrient_id, amount_per_serving, food_sources(*)")
      .in("nutrient_id", nutrientIds);
    if (nfsErr) throw new Error(nfsErr.message);
    const rows = (nfs ?? []) as unknown as {
      nutrient_id: string;
      amount_per_serving: string | null;
      food_sources: FoodSource;
    }[];
    foodByNutrient = new Map();
    for (const row of rows) {
      const list = foodByNutrient.get(row.nutrient_id) ?? [];
      list.push({ ...row.food_sources, amount_per_serving: row.amount_per_serving });
      foodByNutrient.set(row.nutrient_id, list);
    }
  }

  const nutrients: NutrientWithFoods[] = nutrientRows.map((r) => ({
    ...r.nutrients,
    relevance_note: r.relevance_note,
    food_sources: foodByNutrient.get(r.nutrients.id) ?? [],
  }));

  const { data: symptomSupplements, error: ssErr } = await supabase
    .from("symptom_supplements")
    .select("relevance_note, supplement_categories(*)")
    .eq("symptom_id", symptom.id);
  if (ssErr) throw new Error(ssErr.message);

  const supplements: SupplementWithNote[] = (
    (symptomSupplements ?? []) as unknown as {
      relevance_note: string | null;
      supplement_categories: SupplementCategory;
    }[]
  ).map((r) => ({ ...r.supplement_categories, relevance_note: r.relevance_note }));

  return { ...symptom, nutrients, supplements };
}

// ── Browse indexes ───────────────────────────────────────────────────────────

export async function listSymptoms(): Promise<Symptom[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("symptoms").select("*").order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listNutrients(): Promise<Nutrient[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("nutrients").select("*").order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listFoodSources(filters?: {
  category?: string;
  excludeAllergen?: string;
}): Promise<FoodSource[]> {
  const supabase = await createClient();
  let query = supabase.from("food_sources").select("*").order("name");
  if (filters?.category) {
    query = query.eq("dietary_category", filters.category);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  let rows = data ?? [];
  if (filters?.excludeAllergen) {
    const term = filters.excludeAllergen.toLowerCase();
    rows = rows.filter(
      (f) => !(f.allergens ?? "").toLowerCase().includes(term),
    );
  }
  return rows;
}

export async function listSupplementCategories(): Promise<SupplementCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("supplement_categories")
    .select("*")
    .order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ── Detail pages (with reverse relations) ───────────────────────────────────

export type NutrientDetail = Nutrient & {
  food_sources: (FoodSource & { amount_per_serving: string | null })[];
  related_symptoms: (Symptom & { relevance_note: string | null })[];
};

export async function getNutrientBySlug(slug: string): Promise<NutrientDetail | null> {
  const supabase = await createClient();
  const { data: nutrient, error } = await supabase
    .from("nutrients")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!nutrient) return null;

  const { data: nfs, error: nfsErr } = await supabase
    .from("nutrient_food_sources")
    .select("amount_per_serving, food_sources(*)")
    .eq("nutrient_id", nutrient.id);
  if (nfsErr) throw new Error(nfsErr.message);

  const { data: sn, error: snErr } = await supabase
    .from("symptom_nutrients")
    .select("relevance_note, symptoms(*)")
    .eq("nutrient_id", nutrient.id);
  if (snErr) throw new Error(snErr.message);

  return {
    ...nutrient,
    food_sources: (
      (nfs ?? []) as unknown as {
        amount_per_serving: string | null;
        food_sources: FoodSource;
      }[]
    ).map((r) => ({ ...r.food_sources, amount_per_serving: r.amount_per_serving })),
    related_symptoms: (
      (sn ?? []) as unknown as {
        relevance_note: string | null;
        symptoms: Symptom;
      }[]
    ).map((r) => ({ ...r.symptoms, relevance_note: r.relevance_note })),
  };
}

export type FoodSourceDetail = FoodSource & {
  nutrients: (Nutrient & { amount_per_serving: string | null })[];
};

export async function getFoodSourceBySlug(slug: string): Promise<FoodSourceDetail | null> {
  const supabase = await createClient();
  const { data: food, error } = await supabase
    .from("food_sources")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!food) return null;

  const { data: nfs, error: nfsErr } = await supabase
    .from("nutrient_food_sources")
    .select("amount_per_serving, nutrients(*)")
    .eq("food_source_id", food.id);
  if (nfsErr) throw new Error(nfsErr.message);

  return {
    ...food,
    nutrients: (
      (nfs ?? []) as unknown as {
        amount_per_serving: string | null;
        nutrients: Nutrient;
      }[]
    ).map((r) => ({ ...r.nutrients, amount_per_serving: r.amount_per_serving })),
  };
}

export type SupplementCategoryDetail = SupplementCategory & {
  related_symptoms: (Symptom & { relevance_note: string | null })[];
};

export async function getSupplementCategoryBySlug(
  slug: string,
): Promise<SupplementCategoryDetail | null> {
  const supabase = await createClient();
  const { data: supplement, error } = await supabase
    .from("supplement_categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!supplement) return null;

  const { data: ss, error: ssErr } = await supabase
    .from("symptom_supplements")
    .select("relevance_note, symptoms(*)")
    .eq("supplement_category_id", supplement.id);
  if (ssErr) throw new Error(ssErr.message);

  return {
    ...supplement,
    related_symptoms: (
      (ss ?? []) as unknown as {
        relevance_note: string | null;
        symptoms: Symptom;
      }[]
    ).map((r) => ({ ...r.symptoms, relevance_note: r.relevance_note })),
  };
}

// ── Mutations (admin-less CRUD, permissive RLS in v1) ───────────────────────

export async function createSymptom(input: Omit<Symptom, "id" | "created_at">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("symptoms")
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateSymptom(
  id: string,
  input: Partial<Omit<Symptom, "id" | "created_at">>,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("symptoms")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSymptom(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("symptoms").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
