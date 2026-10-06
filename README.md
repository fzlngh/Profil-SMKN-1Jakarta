# Profil SMK Negeri 1 Jakarta

[![Node.js](https://img.shields.io/badge/Node.js->=20-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-blue.svg)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-blue.svg)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./frontend/LICENSE)

Aplikasi web profil sekolah dan chatbot informasi sekolah untuk SMK Negeri 1 Jakarta. Proyek ini dibangun dengan teknologi modern dan terdiri dari frontend Next.js dan backend Express CMS API yang terpisah.

## Daftar Isi

- [Deskripsi Proyek](#deskripsi-proyek)
- [Teknologi](#teknologi)
- [Struktur Proyek](#struktur-proyek)
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
  - [Setup Backend](#setup-backend)
  - [Setup Frontend](#setup-frontend)
- [Cara Menjalankan](#cara-menjalankan)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Endpoint API](#endpoint-api)
- [Fitur Utama](#fitur-utama)
- [Database Schema](#database-schema)
- [Keamanan](#keamanan)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## Deskripsi Proyek

**Profil SMK Negeri 1 Jakarta** adalah aplikasi web yang menyediakan:

- **Website Profil Sekolah**: Platform publik untuk menampilkan informasi lengkap tentang SMK Negeri 1 Jakarta, termasuk program studi, berita, pengumuman, dan agenda akademis
- **CMS Admin Panel**: Dashboard administrasi untuk mengelola konten secara dinamis dengan fitur draft, publikasi, dan manajemen peran pengguna
- **Chatbot Informasi Sekolah**: Bot AI yang dapat menjawab pertanyaan umum tentang sekolah dengan integrasi OpenRouter API
- **Analytics Chatbot**: Sistem analitik sederhana dan privacy-friendly untuk melacak penggunaan chatbot

Aplikasi ini menggantikan SIM-PKL (sistem yang lebih lama) dan menggunakan infrastruktur Supabase terpisah untuk menjaga keamanan dan ketenangan.

## Teknologi

### Backend
- **Node.js** 20+ - Runtime JavaScript server
- **Express.js** 5.1 - Web framework minimalis
- **Supabase** - Backend-as-a-Service dengan PostgreSQL
- **Zod** - Validasi schema TypeScript-first
- **Helmet** - Security HTTP headers
- **Express Rate Limit** - Rate limiting middleware

### Frontend
- **Next.js** 14.2 - React framework dengan SSR/SSG
- **React** 18.3 - UI library
- **TypeScript** 5.5 - Type safety
- **Tailwind CSS** 3.4 - Utility-first CSS framework
- **Supabase JS Client** - Client library untuk Supabase

### Database
- **PostgreSQL** (via Supabase) - Relational database
- Schema khusus CMS dengan Row Level Security (RLS)

## Struktur Proyek

```
Profil-SMKN-1Jakarta-main/
├── backend/                           # Express API & CMS
│   ├── src/
│   │   ├── app.mjs                   # Express app configuration
│   │   ├── chat.mjs                  # Chatbot logic
│   │   └── service.mjs               # Database service layer
│   ├── migrations/
│   │   └── 001_school_profile_cms.sql # Database schema
│   ├── test/
│   │   ├── app.test.mjs              # API tests
│   │   └── service.test.mjs          # Service layer tests
│   ├── openapi.yaml                  # OpenAPI specification
│   ├── server.mjs                    # Entry point
│   ├── package.json                  # Dependencies
│   ├── .env.example                  # Environment template
│   └── README.md                     # Backend documentation
│
└── frontend/                          # Next.js website & admin
    ├── src/
    │   ├── app/
    │   │   ├── (public)/             # Public routes
    │   │   ├── admin/                # Admin dashboard
    │   │   ├── api/                  # API routes (proxy)
    │   │   ├── layout.tsx            # Root layout
    │   │   └── globals.css           # Global styles
    │   ├── components/               # React components
    │   ├── lib/                      # Utility functions
    │   └── globals.d.ts              # Type definitions
    ├── public/                        # Static assets
    ├── next.config.mjs               # Next.js configuration
    ├── tailwind.config.ts            # Tailwind configuration
    ├── tsconfig.json                 # TypeScript configuration
    ├── package.json                  # Dependencies
    ├── .env.example                  # Environment template
    └── README.md                     # Frontend documentation
```

## Persyaratan

Sebelum memulai, pastikan Anda telah menginstal:

- **Node.js** versi 20 atau lebih tinggi
- **npm** atau **yarn** (included with Node.js)
- **Git** untuk version control
- **PostgreSQL** 14+ (jika menggunakan Supabase self-hosted)
- **Supabase Account** ([Sign up gratis](https://supabase.com))

Verifikasi instalasi:
```bash
node --version    # harus v20.0.0 atau lebih tinggi
npm --version     # atau yarn --version
git --version
```

## Instalasi

### Setup Backend

1. **Navigasi ke direktori backend:**
   ```bash
   cd backend
   ```

2. **Instal dependencies:**
   ```bash
   npm ci
   ```
   *(Gunakan `npm ci` bukan `npm install` untuk production-ready lockfile)*

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Edit file `.env` dan atur konfigurasi:**
   ```env
   # Supabase Configuration (wajib diisi)
   CMS_SUPABASE_URL=https://your-project.supabase.co
   CMS_SUPABASE_ANON_KEY=your-anon-key
   CMS_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # Frontend Configuration
   FRONTEND_ORIGINS=http://localhost:3000
   PORT=4000
   
   # Optional: Chatbot Configuration
   OPENROUTER_API_KEY=your-openrouter-key
   OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
   OPENROUTER_MODEL_1=qwen/qwen3.8-27b:free
   OPENROUTER_MODEL_2=google/gemma-4-31b-it:free
   OPENROUTER_MODEL_3=nvidia/nemotron-3.5-lightning:free
   ```

5. **Setup Database:**
   - Buka Supabase dashboard → SQL Editor
   - Jalankan script dari `migrations/001_school_profile_cms.sql`
   - Tambahkan admin pertama melalui SQL:
     ```sql
     insert into public.cms_user_roles (user_id, role)
     values ('<existing-auth.users-uuid>', 'admin_it');
     ```

6. **Jalankan tests (opsional):**
   ```bash
   npm test
   ```

### Setup Frontend

1. **Navigasi ke direktori frontend:**
   ```bash
   cd frontend
   ```

2. **Instal dependencies:**
   ```bash
   npm ci
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **Edit file `.env.local`:**
   ```env
   # Backend API URL
   NEXT_PUBLIC_CMS_API_URL=http://localhost:4000
   
   # Supabase Configuration (untuk admin panel)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Verifikasi konfigurasi TypeScript (opsional):**
   ```bash
   npm run lint
   ```

## 🚀 Cara Menjalankan

### Mode Development

**Terminal 1 - Jalankan Backend API:**
```bash
cd backend
npm run dev
```
Backend akan berjalan di `http://localhost:4000`

Output yang diharapkan:
```json
{"event":"server.started","port":4000}
```

**Terminal 2 - Jalankan Frontend:**
```bash
cd frontend
npm run dev
```
Frontend akan berjalan di `http://localhost:3000`

Akses aplikasi:
- Website publik: http://localhost:3000
- Admin panel: http://localhost:3000/admin
- API health check: http://localhost:4000/health

### Mode Production

**Build Backend:**
```bash
cd backend
npm run check  # Verify syntax
npm start      # Run production server
```

**Build Frontend:**
```bash
cd frontend
npm run build
npm start      # Run production server
```

## 🔧 Konfigurasi Environment

### Backend Variables (.env)

| Variable | Wajib | Deskripsi | Contoh |
|----------|:---:|-----------|---------|
| `CMS_SUPABASE_URL` | ✅ | Supabase project URL | `https://xxx.supabase.co` |
| `CMS_SUPABASE_ANON_KEY` | ✅ | Supabase anon key | `eyJhbGc...` |
| `CMS_SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key | `eyJhbGc...` |
| `FRONTEND_ORIGINS` | ✅ | CORS origins (comma-separated) | `http://localhost:3000` |
| `PORT` | ❌ | Server port | `4000` |
| `TRUST_PROXY` | ❌ | Proxy hops (hanya jika di belakang proxy) | `1` |
| `OPENROUTER_API_KEY` | ❌ | API key untuk chatbot | `sk-or-v1-xxx` |
| `OPENROUTER_BASE_URL` | ❌ | OpenRouter base URL | `https://openrouter.ai/api/v1` |
| `OPENROUTER_MODEL_1/2/3` | ❌ | Model IDs untuk chatbot | `qwen/qwen3.8-27b:free` |

### Frontend Variables (.env.local)

| Variable | Wajib | Deskripsi | Contoh |
|----------|:---:|-----------|---------|
| `NEXT_PUBLIC_CMS_API_URL` | ✅ | Backend API URL | `http://localhost:4000` |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key | `eyJhbGc...` |

## 📡 Endpoint API

### Public Endpoints (tanpa autentikasi)

```
GET  /health                              # Health check
GET  /api/public/news                     # Berita (published)
GET  /api/public/announcements            # Pengumuman (published)
GET  /api/public/academic-agenda          # Agenda akademis (published)
GET  /api/public/hero-banners             # Hero banners (published)
GET  /api/public/{resource}/{uuid}        # Detail single resource
POST /api/public/chat                     # Chatbot (AI reply)
```

**Query Parameters:**
- `limit` (1-100, default: 20) - Jumlah items per halaman
- `offset` (default: 0) - Offset pagination

**Contoh:**
```bash
curl http://localhost:4000/api/public/news?limit=10&offset=0
```

### Admin Endpoints (memerlukan Bearer token)

```
GET    /api/admin/me                                # Info user terautentikasi
GET    /api/admin/{news|announcements|...}         # Daftar (termasuk drafts)
GET    /api/admin/analytics                        # Chat analytics
POST   /api/admin/{resource}                       # Buat konten
PATCH  /api/admin/{resource}/{uuid}                # Update konten
DELETE /api/admin/{resource}/{uuid}                # Hapus konten (admin_it only)
PUT    /api/admin/users/{userId}/role              # Assign role (admin_it only)
```

**Header untuk Authenticated Requests:**
```bash
Authorization: Bearer <supabase-access-token>
```

**Contoh Create News:**
```bash
curl -X POST http://localhost:4000/api/admin/news \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Berita Terbaru",
    "slug": "berita-terbaru",
    "body": "Isi berita...",
    "excerpt": "Ringkasan",
    "is_published": false
  }'
```

### OpenAPI Documentation

Dokumentasi lengkap tersedia di `backend/openapi.yaml`

## Fitur Utama

### 1. Website Publik
- ✅ Halaman beranda dengan hero section
- ✅ Informasi program studi (RPL, TKJ, TKR, TOI)
- ✅ Berita dan pengumuman terbaru
- ✅ Agenda akademis
- ✅ Informasi organisasi
- ✅ Galeri foto kampus
- ✅ Responsive design (mobile-friendly)

### 2. Admin Dashboard
- ✅ Manajemen berita dengan draft & publish
- ✅ Manajemen pengumuman
- ✅ Manajemen agenda akademis
- ✅ Manajemen hero banners
- ✅ Kontrol akses berbasis role (admin_it, editor_guru_staf)
- ✅ Analytics chatbot (privacy-safe)
- ✅ User management

### 3. Chatbot AI
- ✅ Integrasi OpenRouter untuk multiple models
- ✅ Fallback ke model alternative jika timeout
- ✅ Rate limiting (20 requests per 15 menit per IP)
- ✅ Privacy-preserving analytics (tanpa simpan prompt/reply)
- ✅ Knowledge base sekolah built-in

### 4. Keamanan
- ✅ Supabase Authentication
- ✅ Row Level Security (RLS) pada database
- ✅ Role-based access control (RBAC)
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Input validation dengan Zod
- ✅ Rate limiting

## 📊 Database Schema

### Tables

**cms_news**
- `id` (uuid, primary key)
- `title` (text, required)
- `slug` (text, unique)
- `body` (text)
- `excerpt` (text)
- `cover_image_url` (text)
- `author_label` (text)
- `is_published` (boolean)
- `published_at` (timestamp)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**cms_announcements**
- `id` (uuid, primary key)
- `title` (text, required)
- `slug` (text, unique)
- `body` (text)
- `severity` (enum: info|important|urgent)
- `starts_at` (timestamp)
- `ends_at` (timestamp)
- `is_published` (boolean)
- `published_at` (timestamp)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**cms_academic_agenda**
- `id` (uuid, primary key)
- `title` (text, required)
- `slug` (text, unique)
- `description` (text)
- `starts_at` (timestamp, required)
- `ends_at` (timestamp)
- `location` (text)
- `is_published` (boolean)
- `published_at` (timestamp)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**cms_hero_banners**
- `id` (uuid, primary key)
- `title` (text, required)
- `subtitle` (text)
- `image_url` (text, required)
- `link_url` (text)
- `display_order` (integer)
- `is_published` (boolean)
- `published_at` (timestamp)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**cms_user_roles**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `role` (enum: admin_it|editor_guru_staf)
- `created_at` (timestamp)

**cms_chatbot_analytics**
- `id` (uuid, primary key)
- `category` (text)
- `outcome` (enum: resolved|fallback|unavailable)
- `model_used` (text)
- `created_at` (timestamp)

## Keamanan

### Best Practices yang Diterapkan

1. **Authentication & Authorization**
   - Supabase Authentication untuk akses admin
   - JWT token verification pada setiap request
   - Role-based access control (RBAC)
   - No self-role changes (prevent lockout)

2. **Data Protection**
   - Row Level Security (RLS) pada semua tables
   - Service-role key hanya di backend (never in browser)
   - HTTPS/TLS di production
   - Database backup regular

3. **API Security**
   - CORS configuration dengan exact origins
   - Helmet security headers
   - Rate limiting per endpoint
   - Request body size limit (128 KiB)
   - UUID path validation

4. **Privacy**
   - Chatbot analytics: tidak simpan prompt, reply, user ID, IP
   - Logs: hanya request ID, method, path, status, duration
   - No sensitive data di responses/logs
   - Provider calls hanya kirim question, bukan context

5. **Monitoring**
   - Health check endpoint
   - Request logging dengan correlation ID
   - Provider availability monitoring
   - Rate limit status tracking

## Development Workflow

### 1. Development Environment
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Database monitoring (optional)
# Gunakan Supabase dashboard
```

### 2. Testing
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run lint
npm run build  # Verify production build
```

### 3. Building for Production
```bash
# Backend
cd backend
npm run check
npm run build  # (jika ada script build)

# Frontend
cd frontend
npm run build
npm run start   # Verify production build
```

## Scripts yang Tersedia

### Backend
```bash
npm start          # Run production server
npm run dev        # Run with file watching
npm test           # Run test suite
npm run check      # Verify syntax
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run linter (ESLint)
```

## Troubleshooting

### Backend tidak bisa koneksi ke Supabase
- ✅ Pastikan `CMS_SUPABASE_URL` dan keys benar
- ✅ Periksa internet connection
- ✅ Pastikan Supabase project aktif
- ✅ Verify keys di Supabase dashboard (Settings > API)

### Frontend tidak bisa akses admin
- ✅ Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di `.env.local`
- ✅ Ensure Supabase Auth configured
- ✅ Clear browser cache/cookies

### Chatbot tidak merespon
- ✅ Pastikan `OPENROUTER_API_KEY` diset di backend `.env`
- ✅ Check API quota di OpenRouter
- ✅ Verify models yang dikonfigurasi available
- ✅ Check backend logs untuk error details

### Rate limiting
- ✅ Public endpoints: 120 per IP per 15 menit
- ✅ Chat endpoint: 20 per IP per 15 menit
- ✅ Wait 15 menit atau gunakan IP berbeda

## Dokumentasi Tambahan

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [OpenAPI Specification](./backend/openapi.yaml)

## Lisensi

Frontend: MIT License - lihat [LICENSE](./frontend/LICENSE) file

Backend: MIT License (Implicit)

## Support & Contact

Untuk pertanyaan atau issue:
1. Buka GitHub Issues
2. Hubungi administrator sekolah
3. Email: [support email jika ada]

## Ucapan Terima Kasih

Proyek ini dibangun oleh tim JOSJIS SMK Negeri 1 Jakarta dengan dukungan Supabase dan open-source community.

---

**Last Updated**: October 2026
**Version**: 1.0.0
**Status**: Production Ready
