-- Search analytics: log every search so consultants can see which
-- symptoms and terms are most searched.
create table if not exists public.search_logs (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  symptom_ids uuid[] not null default '{}',
  nutrient_count int not null default 0,
  food_count int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.search_logs enable row level security;

-- Anyone (including anonymous visitors) can log a search — this mirrors
-- a public view counter, not sensitive user data.
create policy search_logs_insert on public.search_logs
  for insert
  with check (true);

-- Only signed-in consultants can read the aggregated analytics.
create policy search_logs_select on public.search_logs
  for select
  using (auth.uid() is not null);

create index if not exists search_logs_created_at_idx on public.search_logs (created_at desc);
create index if not exists search_logs_symptom_ids_idx on public.search_logs using gin (symptom_ids);
