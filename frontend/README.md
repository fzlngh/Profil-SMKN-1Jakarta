# Profil SMK Negeri 1 Jakarta

This repository contains the public school-profile website and its school-information chatbot. The SIM-PKL portal, F01 workflows, account roles, and application API have been removed from this application.

## Local development

The application is split into a Next.js public website and an Express CMS/chat API. Their manifests and lockfiles are separate.

### Frontend

1. Run `npm ci` in the repository root.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_CMS_API_URL` to the Express API origin.
3. Set the public Supabase CMS URL and anon key to enable `/admin`.
4. Run `npm run dev`; use `npm run build` to verify a production build.

### Backend

1. Follow [backend/README.md](./backend/README.md) and install dependencies from `backend/`.
2. Copy `backend/.env.example` to `backend/.env`; configure the dedicated CMS Supabase project and exact frontend origin.
3. Apply `backend/migrations/001_school_profile_cms.sql` to that Supabase project and assign the first trusted administrator as documented in the backend guide.
4. Add the OpenRouter-compatible provider key and model settings to `backend/.env` to enable the chatbot, then start the API with `npm run dev`.

The frontend's `/api/public/chat` route proxies to Express. Provider secrets stay exclusively in the backend environment. Express retrieves only currently published news, announcements, academic agenda, and hero-banner content for chatbot answers; if none is relevant, the chatbot says so without generating an unsupported answer. Questions and selected published excerpts are sent to the configured AI provider, so visitors are advised not to enter personal information. Express also serves published content to the public site; `/admin` manages drafts, publication, roles, and privacy-safe chatbot analytics.

Profile content and school facts remain provisional until confirmed by the school. The CMS uses a separate Supabase project and `cms_*` schema; its migration is additive and does not restore or modify SIM-PKL application data.
