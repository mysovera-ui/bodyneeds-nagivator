# Test Plan — BodyNeeds Navigator

## V1 Success Scenario (manual walk)
1. Open the live URL as a logged-out stranger
2. Confirm homepage loads with search input visible (not a login wall)
3. Type "Fatigue" → confirm result card appears within 3 seconds
4. Verify card contains: explanation, lifestyle factors, nutritional factors, medical causes
5. Verify ≥2 nutrients listed, each with food sources and amounts
6. Verify ≥1 supplement category with advantages, cautions, and interactions
7. Verify red-flag section is visually distinct (alert/warning styling)
8. Verify medical disclaimer is present at the bottom of the card
9. Click a nutrient name → navigate to nutrient detail page
10. Navigate back; browse `/symptoms` index → all seeded symptoms listed
11. Resize browser to 375 px width → confirm layout is readable, no horizontal scroll

**Pass:** All 11 steps succeed without error.

## Empty State
- Type "xyz123abc" → "No results found" message shown; no crash
- Visit `/symptoms/nonexistent-slug` → 404 page rendered, not a blank screen

## Error State
- Simulate Supabase offline (block network in DevTools) → error message shown: "Unable to load results. Please try again."; no raw error exposed

## Content Integrity
- Every symptom row has non-empty: explanation, red_flags, professional_next_steps
- Every nutrient row has non-empty: body_function, deficiency_signs
- Every result card disclaimer matches the approved text exactly

## Mobile
- Test on Chrome DevTools at 375 px (iPhone SE) and 768 px (tablet)
- No text overflow, no broken layout, search input accessible

## Admin (Sprint 5)
- Create a new symptom via the form → appears in public search immediately
- Edit symptom explanation → change reflected on result card
- Delete a food source → no longer appears in any result card

## Security (Sprint 6)
- Logged-out user: `POST /api/symptoms` with arbitrary body → rejected (403 or RLS block)
- Admin route without session → redirected to login, content not visible
- `NEXT_PUBLIC_*` env vars in browser console → only anon key and project URL present; no service_role key
