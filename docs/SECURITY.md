# Security — BodyNeeds Navigator

## Secrets
- Supabase `service_role` key: server-side only, never in frontend bundle or client env vars
- Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` exposed to client
- No secrets in git; `.env.local` in `.gitignore`

## Permission Model
- **v1 (demo):** Permissive RLS — all tables readable and writable by anonymous users (demo only)
- **Lock-down sprint:** Write policies replaced with `auth.uid() = user_id`; admin role required for content mutations
- **End users:** Read-only access; no write route exposed in the public UI

## Approved Tools Rule
All database access via typed Supabase JS client. No `run_any`, raw SQL endpoints, or dynamic query construction from user input. Search uses `ilike` with parameterised values — no string concatenation.

## Audit Principle
Every content create/update/delete in the admin panel writes a row to `audit_logs` with editor id, table, row id, action, and before/after values. Audit rows are append-only (no delete policy).

## Known Gaps at v1 (to address at lock-down)
- No rate limiting on search endpoint
- No CSRF protection (added when auth introduced)
- Admin area has no auth gate in Sprint 5 prototype — must be locked before real editors use it
- npm audit to be run and documented before lock-down sprint sign-off
