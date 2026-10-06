# School Profile CMS API

Standalone Express 5 API for the inclusive SMKN 1 Jakarta public-profile CMS. This backend is new and separate from the removed SIM-PKL application. Point the `CMS_SUPABASE_*` settings to the dedicated Supabase project/auth instance for this CMS. The backend accesses only that project's Auth and new `cms_*` schema; it does not restore or reference SIM-PKL tables, flows, roles, or credentials.

## Setup

Requirements: Node.js 20+. From `backend/`:

```sh
npm ci
cp .env.example .env
# Set CMS_SUPABASE_URL, CMS_SUPABASE_ANON_KEY, CMS_SUPABASE_SERVICE_ROLE_KEY, and exact FRONTEND_ORIGINS.
npm test
npm start
```

Run `migrations/001_school_profile_cms.sql` once in the intended Supabase project's SQL editor/deployment pipeline. The migration is additive and creates only `cms_*` tables/indexes/policies and CMS-prefixed helper functions. It contains no `DROP`, truncate, schema reset, or SIM-PKL data operations. Review the target project and take the normal database backup before deployment.

Set up the first `admin_it` with a trusted operator session after creating that person in Supabase Auth:

```sql
insert into public.cms_user_roles (user_id, role)
values ('<existing-auth.users-uuid>', 'admin_it');
```

Do not put an admin password, service key, or seed account in source control. Subsequent role assignments use `PUT /api/admin/users/{userId}/role`; only a verified `admin_it` can use it. The route checks that the target is an existing Supabase Auth user. Self-role changes are rejected to prevent accidental lockout.

The API verifies every bearer token with `supabase.auth.getUser(token)` and reads authorization from the protected `cms_user_roles` table through the server-only service client. It never trusts user/app metadata or a role claim from the request. The service-role key is never sent to a browser. Direct Supabase access is independently constrained by RLS; only the API's server-side service client bypasses RLS.

## Roles

| Capability | `admin_it` | `editor_guru_staf` |
|---|---:|---:|
| Read public published content | Yes | Yes |
| Read CMS drafts through API | Yes | Yes |
| Create/update content | Yes | Yes |
| Delete content | Yes | No |
| Assign either CMS role to an existing Auth user | Yes | No |

An authenticated account without a `cms_user_roles` row has no CMS access. Create users through the school's configured Supabase Auth process; this API intentionally does not implement public registration or password management.

## Endpoint contract

All success responses except `204` use `{ "data": ... }`; errors use `{ "error": { "code": "...", "message": "..." } }`. `X-Request-ID` is returned for support correlation. Pagination is `limit` (1–100) and `offset` (0–100000). See `openapi.yaml` for the machine-readable contract.

### Public

- `GET /health`
- `GET /api/public/news[?limit=20&offset=0]`
- `GET /api/public/announcements[?limit=20&offset=0]`
- `GET /api/public/academic-agenda[?limit=20&offset=0]`
- `GET /api/public/hero-banners[?limit=20&offset=0]`
- `GET /api/public/{resource}/{uuid}` returns only a currently published item.
- `POST /api/public/chat` accepts exactly `{ "message": "..." }` (max 2,000 characters) and returns `{ "data": { "reply": "...", "model": "..." } }`.

The Next.js route at `POST /api/public/chat` validates and proxies chat requests to this Express API. Configure `NEXT_PUBLIC_CMS_API_URL` in the frontend to the Express API origin. The provider key, model configuration, rate limiting, and privacy-minimizing analytics are handled by this backend.

The Express chatbot tries the three configured OpenRouter-compatible `:free` model IDs in order, with an 8-second per-model timeout. Chat analytics persist only a coarse category, `resolved` / `fallback` / `unavailable`, selected model where applicable, and database timestamp. Raw prompts, generated replies, user IDs, IP addresses, and conversation history are not stored. The raw question is sent to the configured AI provider to produce an answer; disclose that processing to visitors and advise them not to include personal information. Chat requests have a separate limit of 20 per IP per 15 minutes; other public routes are limited to 120 per IP per 15 minutes. In multi-instance production, use a shared/edge rate limiter.

### Authenticated CMS

Send `Authorization: Bearer <Supabase access token>`.

- `GET /api/admin/{news|announcements|academic-agenda|hero-banners}[?limit=50&offset=0]` includes drafts.
- `GET /api/admin/me` returns the verified user ID and CMS role.
- `GET /api/admin/analytics` returns 30-day category/outcome aggregates and recent metadata, without prompts, replies, user identifiers, or IP addresses.
- `POST /api/admin/{resource}` creates a resource-specific content object.
- `PATCH /api/admin/{resource}/{uuid}` partially updates known content fields.
- `DELETE /api/admin/{resource}/{uuid}` is `admin_it` only and returns `204`.
- `PUT /api/admin/users/{userId}/role` with `{ "role": "admin_it" | "editor_guru_staf" }` is `admin_it` only and returns `204`.

Supported content fields:

- `news`: `title`, `slug`, `body`, optional `excerpt`, `cover_image_url`, `author_label`, `is_published`, `published_at`.
- `announcements`: `title`, `slug`, `body`, optional `severity` (`info|important|urgent`), `starts_at`, `ends_at`, `is_published`, `published_at`.
- `academic-agenda`: `title`, `slug`, required `starts_at`, optional `description`, `ends_at`, `location`, `is_published`, `published_at`.
- `hero-banners`: `title`, required `image_url`, optional `subtitle`, `link_url`, `display_order`, `is_published`, `published_at`.

Unknown fields and server-managed IDs/timestamps are rejected. URLs must be HTTP(S), and text fields have field-specific length bounds.

## Security and operations

- Configure exact CORS origins in `FRONTEND_ORIGINS` (comma-separated); requests carrying any other browser `Origin` are rejected. Requests without an `Origin` header remain usable for server-side clients.
- `TRUST_PROXY` is unset by default. Set it only to the known number of trusted proxy hops; never trust arbitrary forwarded IP values.
- Helmet security headers, a 128 KiB JSON request-body cap, strict request schemas, UUID path validation, rate limits, bounded upstream timeouts, and non-sensitive structured request logs are enabled.
- Responses and logs omit database/provider exception details, tokens, query strings, request bodies, and chat prompts. Logs include request ID, method, path, status, and duration only.
- Configure TLS at the edge, rotate Supabase service credentials, restrict production network access, and monitor `/health`, 4xx/5xx rates, provider availability, and database health.
- Chat provider calls receive the question and a fixed minimal school-profile knowledge base; keep API keys backend-only. If unset/misconfigured, the chat endpoint returns `503`.
- Chat analytics are append-only to the API's service client and inaccessible to anon/authenticated roles. Apply an operational retention period appropriate to school policy.

## Schema

- `cms_news`
- `cms_announcements`
- `cms_academic_agenda`
- `cms_hero_banners`
- `cms_user_roles` (role source of truth; references `auth.users`)
- `cms_chatbot_analytics` (no prompt, reply, user, or network identifier columns)

RLS permits public reads only for published, currently eligible records. Editors/admins can insert/update; only admins can delete. `cms_user_roles` is not client-writable, and chatbot analytics have no anon/authenticated grants. The Express API uses service-role access only after its own Supabase identity and database-role checks.
