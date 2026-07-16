-- Sprint 6 + Consultant Accounts: replace permissive v1 write policies with
-- real auth-based ones, auto-stamp user_id via auth.uid() default, and add
-- saved_searches + audit_logs tables.

-- 1. Auto-stamp user_id on write, for every content + join table
alter table symptoms alter column user_id set default auth.uid();
alter table nutrients alter column user_id set default auth.uid();
alter table food_sources alter column user_id set default auth.uid();
alter table supplement_categories alter column user_id set default auth.uid();
alter table symptom_nutrients alter column user_id set default auth.uid();
alter table symptom_supplements alter column user_id set default auth.uid();
alter table nutrient_food_sources alter column user_id set default auth.uid();

-- 2. Replace permissive write policies with "must be a signed-in consultant/editor"
drop policy if exists symptoms_v1_write on symptoms;
create policy symptoms_v1_write on symptoms for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists nutrients_v1_write on nutrients;
create policy nutrients_v1_write on nutrients for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists food_sources_v1_write on food_sources;
create policy food_sources_v1_write on food_sources for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists supplement_categories_v1_write on supplement_categories;
create policy supplement_categories_v1_write on supplement_categories for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists symptom_nutrients_v1_write on symptom_nutrients;
create policy symptom_nutrients_v1_write on symptom_nutrients for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists symptom_supplements_v1_write on symptom_supplements;
create policy symptom_supplements_v1_write on symptom_supplements for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists nutrient_food_sources_v1_write on nutrient_food_sources;
create policy nutrient_food_sources_v1_write on nutrient_food_sources for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- 3. Saved searches (strictly per-owner)
create table if not exists saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  query text not null,
  created_at timestamptz not null default now()
);
alter table saved_searches enable row level security;

create policy saved_searches_select on saved_searches for select
  using (auth.uid() = user_id);
create policy saved_searches_insert on saved_searches for insert
  with check (auth.uid() = user_id);
create policy saved_searches_delete on saved_searches for delete
  using (auth.uid() = user_id);

-- 4. Audit logs (append-only, readable by any signed-in editor)
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users(id) on delete set null,
  actor_email text,
  action text not null,
  table_name text not null,
  record_id uuid,
  details text,
  created_at timestamptz not null default now()
);
alter table audit_logs enable row level security;

create policy audit_logs_select on audit_logs for select
  using (auth.uid() is not null);
create policy audit_logs_insert on audit_logs for insert
  with check (auth.uid() is not null);
