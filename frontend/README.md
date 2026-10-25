# Profil SMK Negeri 1 Jakarta

This repository contains the public school-profile website and its school-information chatbot. The SIM-PKL portal, F01 workflows, account roles, and application API have been removed from this application.

## Local development

This folder contains the Next.js frontend. The CMS and AI provider API run separately.

1. Run `npm ci` in this folder.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_CMS_API_URL` to the Express CMS/API origin. The URL is public configuration; do not put API keys in `NEXT_PUBLIC_*` variables.
3. Set `NEXT_PUBLIC_CMS_SUPABASE_URL` and `NEXT_PUBLIC_CMS_SUPABASE_ANON_KEY` only if you use the `/admin` CMS interface.
4. Run `npm run dev` and open the local address shown in the terminal. Use `npm run build` for a production build.

### Chatbot and backend configuration

The browser calls the frontend's `/api/public/chat` route, which forwards the question to `${NEXT_PUBLIC_CMS_API_URL}/api/public/chat`. AI provider credentials and model settings must be configured in the separate Express backend environment (for example, its `GROQ_API_KEY` and model variables); keep them out of this frontend folder and out of every `NEXT_PUBLIC_*` setting. When the API URL or AI service is unavailable, the chat panel remains usable and shows a clear configuration or connection error. The ZIP contains only the frontend, so the chatbot will not return AI answers until the backend is running and configured.

The news page reads published entries from the same CMS API. Without a configured and available CMS, it shows an empty or unavailable state rather than displaying invented news
