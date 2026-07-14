# Agentic Layer — BodyNeeds Navigator

v1 has no agentic actions. The app is read-only for end users. Content is created by the admin editor.

## Risk Levels & Actions

| Action | Risk | Trigger | Approval |
|---|---|---|---|
| Auto-tag nutrient relevance from symptom description | Low | Admin saves symptom | Auto (no approval needed) |
| Draft new symptom entry from template | Low | Admin clicks "New Symptom" | Auto |
| Update `review_status` on a content row | Medium | Editor marks reviewed | Light approval (confirm dialog) |
| Bulk-delete symptom or nutrient | High | Admin selects rows | Always approval (typed confirmation) |
| Delete all content in a category | Critical | — | Human-only; no UI route |

## Named Tools (Later)
- `draft_symptom(name)` — scaffolds a new symptom row with empty fields and status 'unreviewed'
- `flag_low_confidence()` — queries all rows where `content_confidence < 0.7` and sets `review_status = 'needs_review'`

## Audit Log Fields
`id, created_at, editor_id, table_name, row_id, action (create|update|delete), previous_value (jsonb), new_value (jsonb)`

## Agent Permission Rule
No agent action may exceed the permissions of the logged-in editor. No raw SQL execution via agent. All mutations go through typed Supabase client calls.
