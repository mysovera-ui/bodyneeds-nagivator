-- Consultant branding profiles: business name, logo, accent color, unique
-- slug used in public share links (/c/{slug}/...). Publicly readable so
-- the branded share pages work for logged-out clients; only the owning
-- consultant can create/edit/delete their own row.
create table if not exists consultant_profiles (
  id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  business_name text not null,
  slug text not null unique,
  logo_url text,
  accent_color text not null default '#047857',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table consultant_profiles enable row level security;

create policy consultant_profiles_public_read on consultant_profiles
  for select using (true);
create policy consultant_profiles_owner_insert on consultant_profiles
  for insert with check (auth.uid() = id);
create policy consultant_profiles_owner_update on consultant_profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy consultant_profiles_owner_delete on consultant_profiles
  for delete using (auth.uid() = id);

-- Logo storage: public bucket, but consultants may only write inside a
-- folder named after their own auth.uid().
insert into storage.buckets (id, name, public)
values ('consultant-logos', 'consultant-logos', true)
on conflict (id) do nothing;

create policy "consultant_logos_public_read"
on storage.objects for select
using (bucket_id = 'consultant-logos');

create policy "consultant_logos_owner_insert"
on storage.objects for insert
with check (
  bucket_id = 'consultant-logos'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "consultant_logos_owner_update"
on storage.objects for update
using (
  bucket_id = 'consultant-logos'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "consultant_logos_owner_delete"
on storage.objects for delete
using (
  bucket_id = 'consultant-logos'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = auth.uid()::text
);
