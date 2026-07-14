# Tasks & Sprints — BodyNeeds Navigator

## Sprint 1 — Database & Seed Data
**Goal:** All core tables exist in Supabase with realistic seed data readable via the API.
- [ ] Run migration SQL in Supabase SQL editor
- [ ] Verify 6 symptoms, 6 nutrients, 6 food sources, 4 supplement categories exist
- [ ] Verify join tables have rows (symptom_nutrients, symptom_supplements, nutrient_food_sources)
- [ ] Confirm RLS policies allow anonymous select

**Definition of Done:** `select * from symptoms` returns ≥6 rows via the anon key in Supabase table editor.

---

## Sprint 2 — Symptom Search Engine (Core) ✦ Core engine
**Goal:** The one core action works end-to-end against live data.
- [ ] Homepage with search input (not a login page)
- [ ] Query `symptoms` table on submit (`ilike` match)
- [ ] Assemble result card from symptom + joined nutrients + food sources + supplements
- [ ] Loading state (skeleton), empty state ("No results — try 'Fatigue' or 'Poor Sleep'"), error state
- [ ] Red flags section with alert styling
- [ ] Medical disclaimer block on every result
- [ ] No dead buttons — every UI element does something or is absent

**Definition of Done:** Type "Fatigue" → result card renders with ≥2 nutrients, food sources, 1 supplement category, red flags highlighted, disclaimer visible. Works on mobile (375 px).

---

## Sprint 3 — Browse Indexes & Polish → **v1 functional milestone**
**Goal:** Full browse experience; app is demoable by a stranger.
- [ ] `/symptoms` index: list all symptoms as clickable cards
- [ ] `/nutrients` index: list all nutrients
- [ ] `/foods` index: list all food sources with dietary category badge
- [ ] `/supplements` index: list all supplement categories
- [ ] Detail pages for each object type (slug-based routing)
- [ ] Mobile-responsive layout verified at 375 px and 1280 px
- [ ] All four index pages handle empty state and loading state

**Definition of Done:** Stranger visits live URL, browses to Fatigue, reads the full result, navigates to Iron nutrient page — all without logging in. No broken links.

---

## Sprint 4 — Extended Search & Filters
**Goal:** Search reaches nutrients and foods; dietary filters work.
- [ ] Extend search to nutrients and food sources
- [ ] Filter `/foods` by dietary_category
- [ ] Filter `/foods` by allergen exclusion
- [ ] Cross-link related symptoms on result cards

**Definition of Done:** Searching "magnesium" returns the Magnesium nutrient card and lists Pumpkin Seeds as a food source.

---

## Sprint 5 — Admin Content Management
**Goal:** Editor can add/edit content without touching the database directly.
- [ ] `/admin` route (basic password protection — env var secret)
- [ ] CRUD forms: symptoms, nutrients, food sources, supplement categories
- [ ] `review_status` field visible and editable in admin
- [ ] Form validation: required fields enforced client + server side

**Definition of Done:** Editor creates a new symptom via the form; it appears immediately in the public search results.

---

## Sprint 6 — Lock It Down
**Goal:** App is safe for real editors and real users.
- [ ] Replace permissive RLS write policies with `auth.uid() = user_id` owner policies
- [ ] Supabase Auth for admin login; route guard on `/admin`
- [ ] `audit_logs` table; every admin mutation writes a log row
- [ ] npm audit — fix critical/high vulnerabilities; document any that cannot be fixed
- [ ] Rate limit search endpoint (Vercel middleware or Supabase edge function)
- [ ] Confirm no secrets in frontend bundle
- [ ] Security pass documented: injection, XSS, CSRF, PII exposure

**Definition of Done:** Logged-out user can read all content; cannot write to any table. Admin cannot access `/admin` without valid session. Audit log shows last 5 content edits.

---

## Gantt (sprint → feature)
```
Sprint 1  |████| DB + seed
Sprint 2  |████| Symptom search (core engine)
Sprint 3  |████| Browse + polish → v1 functional
Sprint 4  |████| Extended search + filters
Sprint 5  |████| Admin CRUD
Sprint 6  |████| Auth + security lock-down
```
