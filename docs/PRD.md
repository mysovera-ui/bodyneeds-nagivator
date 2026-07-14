# Product Requirements — BodyNeeds Navigator

## Problem
Health consultants and the public lack a single structured reference that maps common symptoms to their nutritional context — covering lifestyle factors, key nutrients, food sources, supplement safety, and when to seek medical help.

## Target Users
- **Primary:** Health/wellness consultants educating clients
- **Secondary:** Nutrition educators, general public

## Core Objects
| Object | Purpose |
|---|---|
| Symptom | Searchable entry with full educational structure |
| Nutrient | Nutrient profile with food sources and deficiency signs |
| Food Source | Food with nutrient links, serving size, dietary category |
| Supplement Category | Category-level supplement guidance with cautions |

## MVP Must-Haves
- [ ] Search by symptom name → structured result card
- [ ] Result card: explanation, lifestyle factors, nutritional factors, medical causes, nutrients, food sources, supplements, red flags, disclaimer
- [ ] Red-flag symptoms visually highlighted on every result
- [ ] Medical disclaimer on every result
- [ ] Browse indexes: symptoms, nutrients, foods, supplements
- [ ] 10 seeded symptoms, 6 nutrients, 6 food sources, 4 supplement categories
- [ ] Mobile-responsive at 375 px and 1280 px
- [ ] All UI states handled: loading, empty, error, ready

## Non-Goals (v1)
Diagnosis, personalized plans, exact dosages, children/pregnancy content, user accounts, meal plans, product rankings, affiliate links, AI generation, lab analysis, mobile app.

## Definition of Done
A stranger visits the live URL, types "Fatigue" into the search box, and within 3 seconds sees a complete result card with explanation, at least 2 nutrients, food sources for each nutrient, at least 1 supplement category with cautions, red-flag symptoms highlighted, and a medical disclaimer — without logging in.
