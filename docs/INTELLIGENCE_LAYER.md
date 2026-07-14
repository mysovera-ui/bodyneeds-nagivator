# Intelligence Layer — BodyNeeds Navigator

## v1: Rule-Based, No AI Required
All content is manually authored. The app is a structured lookup — no AI inference needed for core function.

## Structured Result Schema (assembled per search)
```json
{
  "symptom": { "name": "Fatigue", "explanation": "...", "red_flags": "...", "disclaimer": "..." },
  "lifestyle_factors": "...",
  "nutritional_factors": "...",
  "medical_causes": "...",
  "nutrients": [
    { "name": "Iron", "body_function": "...", "food_sources": [{"name": "Lentils", "amount": "6.6mg"}] }
  ],
  "supplements": [
    { "name": "Iron Supplements", "cautions": "...", "interactions": "..." }
  ]
}
```

## AI Fields (stored, not generated in v1)
For any content field generated or assisted by AI: store `_source` (model/editor), `_confidence` (0–1), `_review_status` ('unreviewed' | 'reviewed' | 'approved').

## Events to Track (Later)
- Symptom searched (name, matched/unmatched)
- Result card viewed (symptom slug)
- Red flag section expanded
- Supplement detail expanded

## Later Enhancements
- Rank food sources by nutrient density per serving
- Surface most-searched symptoms in browse index
- Flag low-confidence content for editor review
