import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import {
  getFullSymptomBySlug,
  getNutrientBySlug,
  getFoodSourceBySlug,
  getSupplementCategoryBySlug,
} from "@/lib/data";
import type { ConsultantProfile } from "@/lib/branding";

export type ResultType = "symptoms" | "nutrients" | "foods" | "supplements";

const DISCLAIMER_TEXT =
  "Educational information only — not medical advice. This content does not diagnose, treat, or replace consultation with a qualified healthcare professional. Always seek professional medical advice for symptoms, supplement use, or health concerns.";

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica", color: "#262626" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#047857",
  },
  logo: { width: 32, height: 32, marginRight: 8, objectFit: "contain" },
  brandName: { fontSize: 13, fontWeight: 700 },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 10 },
  badge: {
    fontSize: 9,
    color: "#047857",
    backgroundColor: "#d1fae5",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 11, fontWeight: 700, marginTop: 12, marginBottom: 3 },
  body: { fontSize: 10, lineHeight: 1.45, color: "#404040" },
  row: { flexDirection: "row", gap: 16, marginTop: 4 },
  col: { flex: 1 },
  flagBox: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fca5a5",
    borderRadius: 4,
    padding: 10,
    marginVertical: 10,
  },
  flagTitle: { fontSize: 10, fontWeight: 700, color: "#991b1b", marginBottom: 3 },
  flagBody: { fontSize: 10, color: "#991b1b", lineHeight: 1.4 },
  cautionBox: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fcd34d",
    borderRadius: 4,
    padding: 10,
    marginVertical: 10,
  },
  cautionTitle: { fontSize: 10, fontWeight: 700, color: "#92400e", marginBottom: 3 },
  cautionBody: { fontSize: 10, color: "#92400e", lineHeight: 1.4 },
  listItem: { fontSize: 10, color: "#404040", marginBottom: 3 },
  listItemName: { fontWeight: 700, color: "#262626" },
  disclaimer: {
    fontSize: 8,
    color: "#737373",
    marginTop: 18,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    fontSize: 8,
    color: "#a3a3a3",
    textAlign: "center",
  },
});

function Header({ profile }: { profile: ConsultantProfile | null }) {
  if (!profile) return null;
  return (
    <View style={[styles.header, { borderBottomColor: profile.accent_color }]}>
      {profile.logo_url && <Image src={profile.logo_url} style={styles.logo} />}
      <Text style={[styles.brandName, { color: profile.accent_color }]}>{profile.business_name}</Text>
    </View>
  );
}

function Footer({ profile }: { profile: ConsultantProfile | null }) {
  const label = profile ? `Prepared by ${profile.business_name}` : "BodyNeeds Navigator";
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return (
    <Text style={styles.footer} fixed>
      {label} · Generated {date}
    </Text>
  );
}

function Section({ label, text }: { label: string; text: string | null | undefined }) {
  if (!text) return null;
  return (
    <View>
      <Text style={styles.sectionTitle}>{label}</Text>
      <Text style={styles.body}>{text}</Text>
    </View>
  );
}

function Disclaimer() {
  return <Text style={styles.disclaimer}>{DISCLAIMER_TEXT}</Text>;
}

export async function buildResultPdf(
  type: ResultType,
  itemSlug: string,
  profile: ConsultantProfile | null,
): Promise<{ buffer: Buffer; fileName: string } | null> {
  if (type === "symptoms") {
    const symptom = await getFullSymptomBySlug(itemSlug);
    if (!symptom) return null;

    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <Header profile={profile} />
          <Text style={styles.title}>{symptom.name}</Text>
          <Text style={styles.body}>{symptom.explanation}</Text>

          <View style={styles.flagBox}>
            <Text style={styles.flagTitle}>Seek medical attention if:</Text>
            <Text style={styles.flagBody}>{symptom.red_flags}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Section label="Lifestyle factors" text={symptom.lifestyle_factors} />
            </View>
            <View style={styles.col}>
              <Section label="Nutritional factors" text={symptom.nutritional_factors} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Section label="Possible medical causes" text={symptom.medical_causes} />
            </View>
            <View style={styles.col}>
              <Section label="Next steps" text={symptom.professional_next_steps} />
            </View>
          </View>

          {symptom.nutrients.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Related nutrients</Text>
              {symptom.nutrients.map((n) => (
                <Text key={n.id} style={styles.listItem}>
                  <Text style={styles.listItemName}>{n.name}</Text>
                  {n.relevance_note ? ` — ${n.relevance_note}` : ""}
                </Text>
              ))}
            </View>
          )}

          {symptom.supplements.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Supplement categories</Text>
              {symptom.supplements.map((s) => (
                <Text key={s.id} style={styles.listItem}>
                  <Text style={styles.listItemName}>{s.name}</Text>
                  {` — Cautions: ${s.cautions}`}
                </Text>
              ))}
            </View>
          )}

          <Disclaimer />
          <Footer profile={profile} />
        </Page>
      </Document>
    );
    const buffer = await renderToBuffer(doc);
    return { buffer, fileName: symptom.slug };
  }

  if (type === "nutrients") {
    const nutrient = await getNutrientBySlug(itemSlug);
    if (!nutrient) return null;

    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <Header profile={profile} />
          <Text style={styles.title}>{nutrient.name}</Text>

          <View style={styles.row}>
            <View style={styles.col}>
              <Section label="Body function" text={nutrient.body_function} />
            </View>
            <View style={styles.col}>
              <Section label="Daily requirement" text={nutrient.daily_requirement} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Section label="Deficiency signs" text={nutrient.deficiency_signs} />
            </View>
            <View style={styles.col}>
              <Section label="Excess risks" text={nutrient.excess_risks} />
            </View>
          </View>

          {nutrient.food_sources.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Food sources</Text>
              {nutrient.food_sources.map((f) => (
                <Text key={f.id} style={styles.listItem}>
                  <Text style={styles.listItemName}>{f.name}</Text>
                  {f.amount_per_serving ? ` — ${f.amount_per_serving}` : ""}
                </Text>
              ))}
            </View>
          )}

          <Disclaimer />
          <Footer profile={profile} />
        </Page>
      </Document>
    );
    const buffer = await renderToBuffer(doc);
    return { buffer, fileName: nutrient.slug };
  }

  if (type === "foods") {
    const food = await getFoodSourceBySlug(itemSlug);
    if (!food) return null;

    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <Header profile={profile} />
          <Text style={styles.title}>{food.name}</Text>
          <Text style={styles.badge}>{food.dietary_category}</Text>

          <View style={styles.row}>
            <View style={styles.col}>
              <Section label="Serving size" text={food.serving_size} />
            </View>
            <View style={styles.col}>
              <Section label="Allergens" text={food.allergens || "None listed"} />
            </View>
          </View>

          {food.nutrients.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Key nutrients</Text>
              {food.nutrients.map((n) => (
                <Text key={n.id} style={styles.listItem}>
                  <Text style={styles.listItemName}>{n.name}</Text>
                  {n.amount_per_serving ? ` — ${n.amount_per_serving}` : ""}
                </Text>
              ))}
            </View>
          )}

          <Disclaimer />
          <Footer profile={profile} />
        </Page>
      </Document>
    );
    const buffer = await renderToBuffer(doc);
    return { buffer, fileName: food.slug };
  }

  const supplement = await getSupplementCategoryBySlug(itemSlug);
  if (!supplement) return null;

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header profile={profile} />
        <Text style={styles.title}>{supplement.name}</Text>
        <Text style={styles.body}>{supplement.purpose}</Text>

        <View style={styles.row}>
          <View style={styles.col}>
            <Section label="Forms" text={supplement.forms} />
          </View>
          <View style={styles.col}>
            <Section label="Advantages" text={supplement.advantages} />
          </View>
        </View>

        <View style={styles.cautionBox}>
          <Text style={styles.cautionTitle}>Cautions</Text>
          <Text style={styles.cautionBody}>{supplement.cautions}</Text>
        </View>

        <Disclaimer />
        <Footer profile={profile} />
      </Page>
    </Document>
  );
  const buffer = await renderToBuffer(doc);
  return { buffer, fileName: supplement.slug };
}
