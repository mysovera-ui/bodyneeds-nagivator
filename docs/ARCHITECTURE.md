# Architecture — BodyNeeds Navigator

## Stack
- **Frontend:** Next.js 14 (App Router), Tailwind CSS
- **Database:** Supabase (Postgres)
- **Hosting:** Vercel
- **Auth:** None in v1; Supabase Auth added at lock-down sprint

## Key User Action — Step by Step
1. User types "Fatigue" in search box on homepage
2. Next.js calls Supabase: `select * from symptoms where name ilike '%fatigue%'`
3. Result row returned; UI renders explanation, lifestyle, nutritional factors
4. Second query fetches joined nutrients via `symptom_nutrients`
5. Third query fetches food sources via `nutrient_food_sources` for each nutrient
6. Fourth query fetches supplement categories via `symptom_supplements`
7. Red flags and disclaimer rendered from symptom row fields
8. Empty state shown if no symptom match; error state if query fails

## Layer Plan
1. **Data first:** All content lives in Supabase; seeded before any UI
2. **App logic:** Next.js server components fetch and assemble the result card
3. **Smart features (later):** Full-text search ranking, cross-linking, content review workflow

## Core Without AI
The entire app is a structured educational database. Content is manually authored and seeded. No AI required for the core to function — AI fields (`_source`, `_confidence`, `_review_status`) are stored but optional in v1.

## Now vs Later
- **Now:** Symptom search, result card, browse indexes, seed data
- **Later:** Full-text search across nutrients/foods, admin CRUD UI, user accounts, PDF export
