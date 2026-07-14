# Data Model — BodyNeeds Navigator

## symptoms
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid | nullable, for future owner-scoping |
| name | text | e.g. "Fatigue" |
| slug | text unique | URL key |
| explanation | text | Plain-language symptom description |
| lifestyle_factors | text | |
| nutritional_factors | text | |
| medical_causes | text | |
| red_flags | text | Highlighted in UI |
| professional_next_steps | text | |
| explanation_source | text | AI field: source |
| explanation_confidence | numeric | AI field: 0–1 |
| explanation_review_status | text | default 'unreviewed' |
| created_at | timestamptz | |

## nutrients
`name, slug, body_function, daily_requirement, deficiency_signs, excess_risks, at_risk_groups, supplement_forms` + `content_source, content_confidence, content_review_status`

## food_sources
`name, slug, serving_size, dietary_category, allergens, availability, dietary_patterns` + `content_source, content_confidence, content_review_status`

## supplement_categories
`name, slug, forms, purpose, advantages, disadvantages, side_effects, cautions, interactions, at_risk_groups` + `content_source, content_confidence, content_review_status`

## Join Tables
- **symptom_nutrients** (`symptom_id`, `nutrient_id`, `relevance_note`)
- **symptom_supplements** (`symptom_id`, `supplement_category_id`, `relevance_note`)
- **nutrient_food_sources** (`nutrient_id`, `food_source_id`, `amount_per_serving`)

## RLS
All tables: RLS enabled. v1 — permissive read + write for demo. Lock-down sprint replaces write policy with `auth.uid() = user_id`.

## Secondary tables (Sprint 5+)
`audit_logs` — records every content create/update/delete with editor id, table, row id, action, timestamp.
