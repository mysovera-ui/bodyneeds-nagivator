create table if not exists symptoms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  name text not null,
  slug text unique not null,
  explanation text not null,
  lifestyle_factors text not null,
  nutritional_factors text not null,
  medical_causes text not null,
  red_flags text not null,
  professional_next_steps text not null,
  explanation_source text,
  explanation_confidence numeric,
  explanation_review_status text default 'unreviewed'
);
alter table symptoms enable row level security;
drop policy if exists "symptoms_v1_read" on symptoms;
create policy "symptoms_v1_read" on symptoms for select using (true);
drop policy if exists "symptoms_v1_write" on symptoms;
create policy "symptoms_v1_write" on symptoms for all using (true) with check (true);

create table if not exists nutrients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  name text not null,
  slug text unique not null,
  body_function text not null,
  daily_requirement text not null,
  deficiency_signs text not null,
  excess_risks text not null,
  at_risk_groups text not null,
  supplement_forms text not null,
  content_source text,
  content_confidence numeric,
  content_review_status text default 'unreviewed'
);
alter table nutrients enable row level security;
drop policy if exists "nutrients_v1_read" on nutrients;
create policy "nutrients_v1_read" on nutrients for select using (true);
drop policy if exists "nutrients_v1_write" on nutrients;
create policy "nutrients_v1_write" on nutrients for all using (true) with check (true);

create table if not exists food_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  name text not null,
  slug text unique not null,
  serving_size text not null,
  dietary_category text not null,
  allergens text,
  availability text,
  dietary_patterns text,
  content_source text,
  content_confidence numeric,
  content_review_status text default 'unreviewed'
);
alter table food_sources enable row level security;
drop policy if exists "food_sources_v1_read" on food_sources;
create policy "food_sources_v1_read" on food_sources for select using (true);
drop policy if exists "food_sources_v1_write" on food_sources;
create policy "food_sources_v1_write" on food_sources for all using (true) with check (true);

create table if not exists supplement_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  name text not null,
  slug text unique not null,
  forms text not null,
  purpose text not null,
  advantages text not null,
  disadvantages text not null,
  side_effects text not null,
  cautions text not null,
  interactions text not null,
  at_risk_groups text not null,
  content_source text,
  content_confidence numeric,
  content_review_status text default 'unreviewed'
);
alter table supplement_categories enable row level security;
drop policy if exists "supplement_categories_v1_read" on supplement_categories;
create policy "supplement_categories_v1_read" on supplement_categories for select using (true);
drop policy if exists "supplement_categories_v1_write" on supplement_categories;
create policy "supplement_categories_v1_write" on supplement_categories for all using (true) with check (true);

create table if not exists symptom_nutrients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  symptom_id uuid references symptoms(id) on delete cascade,
  nutrient_id uuid references nutrients(id) on delete cascade,
  relevance_note text
);
alter table symptom_nutrients enable row level security;
drop policy if exists "symptom_nutrients_v1_read" on symptom_nutrients;
create policy "symptom_nutrients_v1_read" on symptom_nutrients for select using (true);
drop policy if exists "symptom_nutrients_v1_write" on symptom_nutrients;
create policy "symptom_nutrients_v1_write" on symptom_nutrients for all using (true) with check (true);

create table if not exists symptom_supplements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  symptom_id uuid references symptoms(id) on delete cascade,
  supplement_category_id uuid references supplement_categories(id) on delete cascade,
  relevance_note text
);
alter table symptom_supplements enable row level security;
drop policy if exists "symptom_supplements_v1_read" on symptom_supplements;
create policy "symptom_supplements_v1_read" on symptom_supplements for select using (true);
drop policy if exists "symptom_supplements_v1_write" on symptom_supplements;
create policy "symptom_supplements_v1_write" on symptom_supplements for all using (true) with check (true);

create table if not exists nutrient_food_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  nutrient_id uuid references nutrients(id) on delete cascade,
  food_source_id uuid references food_sources(id) on delete cascade,
  amount_per_serving text
);
alter table nutrient_food_sources enable row level security;
drop policy if exists "nutrient_food_sources_v1_read" on nutrient_food_sources;
create policy "nutrient_food_sources_v1_read" on nutrient_food_sources for select using (true);
drop policy if exists "nutrient_food_sources_v1_write" on nutrient_food_sources;
create policy "nutrient_food_sources_v1_write" on nutrient_food_sources for all using (true) with check (true);

insert into symptoms (name, slug, explanation, lifestyle_factors, nutritional_factors, medical_causes, red_flags, professional_next_steps) values
('Fatigue', 'fatigue', 'Persistent lack of energy affecting daily function. Distinct from normal tiredness.', 'Poor sleep hygiene, sedentary lifestyle, chronic stress, excessive caffeine, dehydration', 'Iron deficiency, B12 deficiency, low vitamin D, inadequate caloric intake, high refined sugar diet', 'Anaemia, hypothyroidism, sleep apnoea, diabetes, depression', 'Fatigue lasting >2 weeks, unexplained weight loss, chest pain, shortness of breath', 'Consult GP if fatigue persists beyond 2 weeks or is accompanied by red-flag symptoms'),
('Poor Sleep', 'poor-sleep', 'Difficulty falling or staying asleep, or waking unrefreshed despite adequate time in bed.', 'Irregular sleep schedule, blue light exposure, high evening caffeine, late exercise, alcohol use', 'Magnesium deficiency, low tryptophan intake, high sugar diet disrupting blood sugar overnight', 'Sleep apnoea, anxiety disorders, restless leg syndrome, thyroid dysfunction', 'Gasping/choking during sleep, severe daytime sleepiness impairing function, chest pain at night', 'Refer to GP for sleep study if suspected apnoea; consider CBT-I for chronic insomnia'),
('Low Mood', 'low-mood', 'Persistent feelings of sadness, flatness, or reduced motivation not meeting clinical depression criteria.', 'Social isolation, low physical activity, excessive screen time, chronic stress', 'Omega-3 deficiency, low folate, vitamin D insufficiency, inadequate protein, gut dysbiosis', 'Clinical depression, bipolar disorder, thyroid dysfunction, nutritional anaemia', 'Suicidal ideation, inability to function in daily life, psychosis symptoms', 'Always refer to mental health professional if low mood persists >2 weeks or affects function'),
('Digestive Bloating', 'digestive-bloating', 'Abdominal distension, discomfort or excess gas after eating, often fluctuating throughout the day.', 'Eating too fast, high stress, sedentary habits, food intolerances, antibiotic use disrupting gut flora', 'Low fibre intake, inadequate hydration, excess FODMAPs, low digestive enzyme production', 'IBS, coeliac disease, SIBO, inflammatory bowel disease, food allergy', 'Blood in stool, unintentional weight loss, nocturnal symptoms, persistent vomiting', 'Refer to GP/gastroenterologist if red flags present or symptoms persist beyond 4 weeks'),
('Muscle Cramps', 'muscle-cramps', 'Sudden, involuntary muscle contractions typically in legs, often occurring at night or during exercise.', 'Dehydration, overexertion, prolonged sitting/standing, ill-fitting footwear', 'Magnesium deficiency, low potassium, insufficient calcium, low sodium from excessive sweating', 'Peripheral vascular disease, nerve compression, medication side effects (statins, diuretics)', 'Persistent cramps with swelling, redness, or warmth in limb; cramps with significant leg pain at rest', 'GP review if cramps are frequent, severe, or accompanied by swelling or leg pain'),
('Poor Concentration', 'poor-concentration', 'Difficulty sustaining attention, mental fogginess, or slow thinking affecting work or daily tasks.', 'Sleep deprivation, chronic stress, multitasking overload, dehydration, sedentary lifestyle', 'Iron deficiency, omega-3 deficiency, B vitamin insufficiency, blood sugar instability from high refined carb diet', 'ADHD, thyroid dysfunction, anxiety, depression, anaemia', 'Sudden cognitive change, memory loss, confusion with headache or fever', 'Neurological or psychiatric assessment if sudden onset or progressive deterioration');

insert into nutrients (name, slug, body_function, daily_requirement, deficiency_signs, excess_risks, at_risk_groups, supplement_forms) values
('Iron', 'iron', 'Oxygen transport via haemoglobin; energy metabolism; immune function', '8 mg/day (men), 18 mg/day (pre-menopausal women)', 'Fatigue, pallor, brittle nails, shortness of breath, poor concentration', 'Constipation, nausea, organ damage at very high doses; haemochromatosis risk', 'Pre-menopausal women, vegetarians, athletes, frequent blood donors', 'Ferrous sulfate, ferrous gluconate, ferric forms, liposomal iron'),
('Magnesium', 'magnesium', 'Muscle and nerve function; energy production; sleep regulation; bone health', '310–420 mg/day depending on age and sex', 'Muscle cramps, poor sleep, fatigue, anxiety, constipation', 'Diarrhoea and nausea at high doses; risk in kidney disease', 'Older adults, type 2 diabetics, people with GI disorders, heavy alcohol users', 'Magnesium glycinate, citrate, oxide, threonate, malate'),
('Vitamin D', 'vitamin-d', 'Calcium absorption; immune modulation; mood regulation; musculoskeletal health', '600–800 IU/day; many experts recommend 1000–2000 IU especially in low-sun climates', 'Fatigue, low mood, bone pain, frequent infections, muscle weakness', 'Hypercalcaemia at very high supplemental doses (>4000 IU/day long-term without testing)', 'People with limited sun exposure, darker skin tones, older adults, office workers', 'D3 (cholecalciferol) preferred over D2; softgels, drops, tablets'),
('Omega-3 Fatty Acids', 'omega-3', 'Anti-inflammatory regulation; brain and mood function; cardiovascular health; joint support', '250–500 mg EPA+DHA/day (dietary); higher therapeutic ranges under guidance', 'Low mood, poor concentration, dry skin, joint stiffness, high triglycerides', 'Blood thinning effect at high doses; fishy aftertaste; possible glycaemic effects', 'People with low oily fish intake, vegetarians/vegans, those with depression or cardiovascular risk', 'Fish oil (EPA/DHA), algae oil (vegan), krill oil'),
('Vitamin B12', 'vitamin-b12', 'Nerve function; red blood cell production; DNA synthesis; energy metabolism', '2.4 mcg/day; absorption declines with age and with metformin/PPIs', 'Fatigue, nerve tingling, poor memory, low mood, mouth ulcers, pale skin', 'Very low toxicity; excess excreted. Rare: acne-like rash at very high doses', 'Vegans, vegetarians, over-50s, people on metformin or PPIs, those with pernicious anaemia', 'Methylcobalamin or cyanocobalamin; sublingual, injection (medical), oral tablet'),
('Folate (B9)', 'folate-b9', 'DNA repair; cell division; red blood cell production; mood regulation via neurotransmitter synthesis', '400 mcg DFE/day for adults', 'Fatigue, poor mood, mouth sores, cognitive slowing, megaloblastic anaemia', 'High-dose folic acid may mask B12 deficiency; avoid mega-dosing', 'Heavy alcohol users, people with MTHFR polymorphisms, those on methotrexate', 'Folate (food form), folic acid (synthetic), methylfolate (MTHFR-friendly)');

insert into food_sources (name, slug, serving_size, dietary_category, allergens, availability, dietary_patterns) values
('Spinach (cooked)', 'spinach-cooked', '180g / 1 cup cooked', 'vegan', 'none', 'widely available fresh, frozen, canned', 'vegan, vegetarian, mediterranean, omnivore'),
('Lentils (cooked)', 'lentils-cooked', '200g / 1 cup cooked', 'vegan', 'none', 'widely available dried and canned', 'vegan, vegetarian, mediterranean, omnivore'),
('Salmon (grilled)', 'salmon-grilled', '140g / 5 oz fillet', 'omnivore', 'fish', 'widely available fresh and frozen', 'pescatarian, mediterranean, omnivore'),
('Pumpkin seeds', 'pumpkin-seeds', '30g / 2 tbsp', 'vegan', 'none', 'widely available', 'vegan, vegetarian, omnivore'),
('Eggs (whole, boiled)', 'eggs-boiled', '2 large eggs', 'vegetarian', 'eggs', 'widely available', 'vegetarian, omnivore'),
('Fortified oat milk', 'fortified-oat-milk', '250 ml / 1 cup', 'vegan', 'gluten (oats)', 'widely available in supermarkets', 'vegan, vegetarian, omnivore');

insert into supplement_categories (name, slug, forms, purpose, advantages, disadvantages, side_effects, cautions, interactions, at_risk_groups) values
('Iron Supplements', 'iron-supplements', 'Ferrous sulfate, ferrous gluconate, ferric ammonium citrate, liposomal iron', 'Correct iron deficiency anaemia; support energy and oxygen transport', 'Effective for diagnosed deficiency; widely available; low cost', 'Should only be taken with confirmed deficiency; form affects tolerance', 'Constipation, dark stools, nausea, stomach upset; liposomal form generally better tolerated', 'Do not supplement without testing; haemochromatosis contraindication; keep away from children', 'Reduces absorption of levothyroxine, quinolone antibiotics, tetracyclines; calcium inhibits iron absorption', 'Pre-menopausal women, vegetarians, athletes; NOT for men or post-menopausal women without diagnosis'),
('Magnesium Supplements', 'magnesium-supplements', 'Glycinate, citrate, oxide, threonate, malate', 'Support muscle function, sleep quality, energy, and nervous system regulation', 'Generally well tolerated; multiple forms for different needs; wide safety margin', 'Oxide form poorly absorbed; dosing varies by form; loose stools at high doses', 'Diarrhoea, loose stools (especially oxide/citrate at high doses)', 'Use with caution in kidney disease; check with GP if on medications', 'May enhance effect of muscle relaxants; caution with antibiotics (separate timing)', 'Older adults, diabetics, people with high stress or poor sleep'),
('Vitamin D3 Supplements', 'vitamin-d3-supplements', 'Softgels, drops, tablets, sprays; D3 (cholecalciferol) or D2 (ergocalciferol)', 'Correct vitamin D insufficiency; support mood, immunity, bone health', 'D3 raises serum levels more effectively than D2; low cost; widely available', 'Fat-soluble — can accumulate; testing recommended before high-dose supplementation', 'Rare at standard doses; toxicity (hypercalcaemia) with prolonged very high doses', 'Avoid doses >4000 IU/day without testing; caution in sarcoidosis, granulomatous conditions', 'May increase calcium absorption — monitor if on thiazide diuretics or digoxin', 'Office workers, darker skin tones, older adults, people in low-sunlight climates'),
('Omega-3 Supplements', 'omega-3-supplements', 'Fish oil capsules, liquid fish oil, krill oil, algae oil (vegan EPA/DHA)', 'Support mood, cardiovascular health, inflammation regulation, brain function', 'Well-researched; algae oil provides vegan alternative; convenient', 'Quality varies; oxidation risk in low-quality products; fish burps with some forms', 'Fishy aftertaste, loose stools at high doses, mild blood thinning', 'Caution at doses >3 g EPA+DHA/day if on anticoagulants; stop 2 weeks before surgery', 'Additive blood-thinning effect with warfarin, aspirin, NSAIDs', 'Vegans (use algae oil), people with low oily fish intake, cardiovascular risk');

insert into symptom_nutrients (symptom_id, nutrient_id, relevance_note)
select s.id, n.id, 'Primary nutrient associated with fatigue'
from symptoms s, nutrients n where s.slug = 'fatigue' and n.slug = 'iron';

insert into symptom_nutrients (symptom_id, nutrient_id, relevance_note)
select s.id, n.id, 'B12 deficiency is a common reversible cause of fatigue'
from symptoms s, nutrients n where s.slug = 'fatigue' and n.slug = 'vitamin-b12';

insert into symptom_nutrients (symptom_id, nutrient_id, relevance_note)
select s.id, n.id, 'Magnesium supports sleep onset and muscle relaxation'
from symptoms s, nutrients n where s.slug = 'poor-sleep' and n.slug = 'magnesium';

insert into symptom_nutrients (symptom_id, nutrient_id, relevance_note)
select s.id, n.id, 'Omega-3 linked to mood regulation and brain function'
from symptoms s, nutrients n where s.slug = 'low-mood' and n.slug = 'omega-3';

insert into symptom_nutrients (symptom_id, nutrient_id, relevance_note)
select s.id, n.id, 'Magnesium deficiency is a common cause of muscle cramps'
from symptoms s, nutrients n where s.slug = 'muscle-cramps' and n.slug = 'magnesium';

insert into symptom_supplements (symptom_id, supplement_category_id, relevance_note)
select s.id, sc.id, 'Iron supplementation if deficiency confirmed by blood test'
from symptoms s, supplement_categories sc where s.slug = 'fatigue' and sc.slug = 'iron-supplements';

insert into symptom_supplements (symptom_id, supplement_category_id, relevance_note)
select s.id, sc.id, 'Magnesium glycinate for sleep support'
from symptoms s, supplement_categories sc where s.slug = 'poor-sleep' and sc.slug = 'magnesium-supplements';

insert into symptom_supplements (symptom_id, supplement_category_id, relevance_note)
select s.id, sc.id, 'Omega-3 for mood and brain function support'
from symptoms s, supplement_categories sc where s.slug = 'low-mood' and sc.slug = 'omega-3-supplements';

insert into nutrient_food_sources (nutrient_id, food_source_id, amount_per_serving)
select n.id, f.id, '6.4 mg iron per cup cooked'
from nutrients n, food_sources f where n.slug = 'iron' and f.slug = 'spinach-cooked';

insert into nutrient_food_sources (nutrient_id, food_source_id, amount_per_serving)
select n.id, f.id, '6.6 mg iron per cup cooked'
from nutrients n, food_sources f where n.slug = 'iron' and f.slug = 'lentils-cooked';

insert into nutrient_food_sources (nutrient_id, food_source_id, amount_per_serving)
select n.id, f.id, '156 mg magnesium per 30g'
from nutrients n, food_sources f where n.slug = 'magnesium' and f.slug = 'pumpkin-seeds';

insert into nutrient_food_sources (nutrient_id, food_source_id, amount_per_serving)
select n.id, f.id, '2.6 mcg B12 per 2 eggs'
from nutrients n, food_sources f where n.slug = 'vitamin-b12' and f.slug = 'eggs-boiled';

insert into nutrient_food_sources (nutrient_id, food_source_id, amount_per_serving)
select n.id, f.id, '~2000 mg omega-3 per 140g fillet'
from nutrients n, food_sources f where n.slug = 'omega-3' and f.slug = 'salmon-grilled';