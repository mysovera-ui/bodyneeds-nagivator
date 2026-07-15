export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  required?: boolean;
  options?: string[];
};

export type EntityConfig = {
  key: string;
  label: string;
  singular: string;
  table: string;
  fields: FieldConfig[];
};

const REVIEW_OPTIONS = ["unreviewed", "reviewed", "approved"];

export const ENTITIES: Record<string, EntityConfig> = {
  symptoms: {
    key: "symptoms",
    label: "Symptoms",
    singular: "Symptom",
    table: "symptoms",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "explanation", label: "Explanation", type: "textarea", required: true },
      { name: "lifestyle_factors", label: "Lifestyle factors", type: "textarea", required: true },
      { name: "nutritional_factors", label: "Nutritional factors", type: "textarea", required: true },
      { name: "medical_causes", label: "Medical causes", type: "textarea", required: true },
      { name: "red_flags", label: "Red flags", type: "textarea", required: true },
      { name: "professional_next_steps", label: "Professional next steps", type: "textarea", required: true },
      { name: "explanation_review_status", label: "Review status", type: "select", options: REVIEW_OPTIONS },
    ],
  },
  nutrients: {
    key: "nutrients",
    label: "Nutrients",
    singular: "Nutrient",
    table: "nutrients",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "body_function", label: "Body function", type: "textarea", required: true },
      { name: "daily_requirement", label: "Daily requirement", type: "text", required: true },
      { name: "deficiency_signs", label: "Deficiency signs", type: "textarea", required: true },
      { name: "excess_risks", label: "Excess risks", type: "textarea", required: true },
      { name: "at_risk_groups", label: "At-risk groups", type: "textarea", required: true },
      { name: "supplement_forms", label: "Supplement forms", type: "textarea", required: true },
      { name: "content_review_status", label: "Review status", type: "select", options: REVIEW_OPTIONS },
    ],
  },
  foods: {
    key: "foods",
    label: "Food Sources",
    singular: "Food Source",
    table: "food_sources",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "serving_size", label: "Serving size", type: "text", required: true },
      {
        name: "dietary_category",
        label: "Dietary category",
        type: "select",
        required: true,
        options: ["vegan", "vegetarian", "omnivore"],
      },
      { name: "allergens", label: "Allergens", type: "text" },
      { name: "availability", label: "Availability", type: "text" },
      { name: "dietary_patterns", label: "Dietary patterns", type: "text" },
      { name: "content_review_status", label: "Review status", type: "select", options: REVIEW_OPTIONS },
    ],
  },
  supplements: {
    key: "supplements",
    label: "Supplement Categories",
    singular: "Supplement Category",
    table: "supplement_categories",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "forms", label: "Forms", type: "textarea", required: true },
      { name: "purpose", label: "Purpose", type: "textarea", required: true },
      { name: "advantages", label: "Advantages", type: "textarea", required: true },
      { name: "disadvantages", label: "Disadvantages", type: "textarea", required: true },
      { name: "side_effects", label: "Side effects", type: "textarea", required: true },
      { name: "cautions", label: "Cautions", type: "textarea", required: true },
      { name: "interactions", label: "Interactions", type: "textarea", required: true },
      { name: "at_risk_groups", label: "At-risk groups", type: "textarea", required: true },
      { name: "content_review_status", label: "Review status", type: "select", options: REVIEW_OPTIONS },
    ],
  },
};
