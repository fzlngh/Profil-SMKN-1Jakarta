-- Wilhel chatbot: output tahap NLP disimpan di sini, lalu LLM mengambilnya dari database.
-- Migrasi bersifat additive dan aman dijalankan ulang.
--
-- Privasi: tabel ini TIDAK menyimpan teks mentah pertanyaan, jawaban, user ID, atau IP.
-- Hanya intent, keyword hasil tokenisasi, entitas, rujukan dokumen publik, dan kutipan
-- konten publik terbit yang relevan. Baris kedaluwarsa dihapus oleh API (expires_at).

create table if not exists public.cms_chatbot_nlp_results (
  id uuid primary key default gen_random_uuid(),
  intent text not null check (intent in (
    'academic_agenda', 'announcement', 'news', 'academic_program', 'school_profile', 'other'
  )),
  confidence numeric(4, 3) not null check (confidence >= 0 and confidence <= 1),
  keywords text[] not null default '{}' check (cardinality(keywords) <= 30),
  entities jsonb not null default '{}'::jsonb,
  matched_refs jsonb not null default '[]'::jsonb,
  context text not null default '' check (char_length(context) <= 7000),
  nlp_version text not null check (char_length(nlp_version) <= 60),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);

create index if not exists cms_chatbot_nlp_results_expires_idx
  on public.cms_chatbot_nlp_results (expires_at);

alter table public.cms_chatbot_nlp_results enable row level security;

revoke all on public.cms_chatbot_nlp_results from anon, authenticated;
grant select, insert, delete on public.cms_chatbot_nlp_results to service_role;
