# Profil-SMKN-1Jakarta

## Backend API

The Express API in `backend/` is the application backend of record. Next.js Server Components and Server Actions call it over `BACKEND_API_URL`, forwarding the signed-in Supabase SSR cookies. The API checks the authenticated user and database role for every protected operation. F01 create, resubmit, approve, and reject continue to call the existing Supabase RPCs using the authenticated user's Supabase client, preserving the database's RLS/RPC behavior. No database schema or RLS changes are included.

### Local setup

1. Install frontend dependencies from the project root with `npm ci`. Install backend dependencies separately with `npm --prefix backend ci`.
2. Copy the root `.env.example` to `.env.local` for Next.js, then set the Supabase project URL and anon key. `BACKEND_API_URL` must point to the Express API reachable by the Next.js server, and `FRONTEND_ORIGIN` must match the frontend's exact origin.
3. Copy `backend/.env.example` to `backend/.env` and fill in the Supabase URL, anon key, and service-role key. The service-role key belongs only in this backend file/process; never put it in the frontend environment or any `NEXT_PUBLIC_*` variable.
4. Start the API with `npm run backend:dev` and Next.js with `npm run dev`.

Production must set `FRONTEND_ORIGIN` to the exact frontend origin (scheme/host/port, no path or trailing slash) in both processes, `BACKEND_API_URL` to a private/reachable API URL in the Next.js server environment, and `COOKIE_SECURE=true` on the API. The API enables credentialed CORS for that one configured origin and validates the origin on writes. Keep the API behind HTTPS in production. Only configure `TRUST_PROXY` when the API is behind a known reverse proxy, and set it to the trusted hop count.

### Operations

- `npm run backend:start` starts the API; `npm run backend:dev` starts it with Node watch mode.
- `npm test` runs the backend validation and origin/CORS tests.
- `npm run seed` creates/updates the initial superadmin using `backend/.env`; the seed script no longer prints the password.
- The frontend uses the root `package.json` and `package-lock.json`; the Express API has its own `backend/package.json` and `backend/package-lock.json`.
- Next.js is the frontend: Server Components and Server Actions call Express using `BACKEND_API_URL`; they do not access application tables or perform authentication/user/F01 operations directly. The Supabase browser client is retained only for signature object uploads, and middleware refreshes the shared Supabase session.
- The frontend environment template is the root `.env.example`; it contains only public Supabase project settings and frontend-to-API routing/origin values. Keep the Supabase service-role key exclusively in `backend/.env`.

The API's login rate limit is process-local; use an edge/API-gateway or shared rate limiter when deploying multiple backend instances. Existing RPC definitions and storage bucket policies are managed outside this repository and remain prerequisites.