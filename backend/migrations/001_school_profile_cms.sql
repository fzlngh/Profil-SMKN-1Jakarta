-- Additive CMS schema for the public school profile.
-- This migration creates only cms_* objects; it does not modify or delete existing application data.

create table if not exists public.cms_user_roles (
  user_id uuid primary key references auth.users (id),
  role text not null check (role in ('admin_it', 'editor_guru_staf')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_news (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 160),
  excerpt text check (excerpt is null or char_length(excerpt) <= 500),
  body text not null check (char_length(body) between 1 and 50000),
  cover_image_url text,
  author_label text check (author_label is null or char_length(author_label) <= 120),
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 160),
  body text not null check (char_length(body) between 1 and 20000),
  severity text not null default 'info' check (severity in ('info', 'important', 'urgent')),
  starts_at timestamptz,
  ends_at timestamptz,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at >= starts_at)
);

create table if not exists public.cms_academic_agenda (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 160),
  description text check (description is null or char_length(description) <= 5000),
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text check (location is null or char_length(location) <= 250),
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);

create table if not exists public.cms_hero_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  subtitle text check (subtitle is null or char_length(subtitle) <= 500),
  image_url text not null,
  link_url text,
  display_order integer not null default 0 check (display_order between 0 and 10000),
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Analytics intentionally exclude question text, user IDs, IP addresses, and conversation data.
create table if not exists public.cms_chatbot_analytics (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in (
    'academic_agenda', 'announcement', 'news', 'academic_program', 'school_profile', 'other'
  )),
  outcome text not null check (outcome in ('resolved', 'fallback', 'unavailable')),
  model text check (model is null or char_length(model) <= 120),
  created_at timestamptz not null default now()
);

create index if not exists cms_news_published_idx
  on public.cms_news (published_at desc nulls last, created_at desc)
  where is_published = true;
create index if not exists cms_announcements_published_idx
  on public.cms_announcements (published_at desc nulls last, starts_at, ends_at)
  where is_published = true;
create index if not exists cms_academic_agenda_published_idx
  on public.cms_academic_agenda (starts_at)
  where is_published = true;
create index if not exists cms_hero_banners_published_idx
  on public.cms_hero_banners (display_order, created_at desc)
  where is_published = true;
create index if not exists cms_chatbot_analytics_created_idx
  on public.cms_chatbot_analytics (created_at desc);
create index if not exists cms_user_roles_role_idx
  on public.cms_user_roles (role);

create or replace function public.cms_set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

do $triggers$
declare
  table_name text;
begin
  foreach table_name in array array[
    'cms_user_roles', 'cms_news', 'cms_announcements', 'cms_academic_agenda', 'cms_hero_banners'
  ] loop
    if not exists (
      select 1 from pg_trigger
      where tgname = table_name || '_updated_at'
        and tgrelid = ('public.' || table_name)::regclass
        and not tgisinternal
    ) then
      execute format(
        'create trigger %I before update on public.%I for each row execute function public.cms_set_updated_at()',
        table_name || '_updated_at', table_name
      );
    end if;
  end loop;
end
$triggers$;

create or replace function public.cms_user_has_role(allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $function$
  select exists (
    select 1
    from public.cms_user_roles
    where user_id = auth.uid()
      and role = any (allowed_roles)
  );
$function$;

revoke all on function public.cms_user_has_role(text[]) from public, anon;
grant execute on function public.cms_user_has_role(text[]) to authenticated;

alter table public.cms_user_roles enable row level security;
alter table public.cms_news enable row level security;
alter table public.cms_announcements enable row level security;
alter table public.cms_academic_agenda enable row level security;
alter table public.cms_hero_banners enable row level security;
alter table public.cms_chatbot_analytics enable row level security;

grant select on public.cms_news, public.cms_announcements, public.cms_academic_agenda, public.cms_hero_banners to anon, authenticated;
grant insert, update, delete on public.cms_news, public.cms_announcements, public.cms_academic_agenda, public.cms_hero_banners to authenticated;
grant select on public.cms_user_roles to authenticated;
revoke all on public.cms_chatbot_analytics from anon, authenticated;
grant select, insert, update, delete on public.cms_news, public.cms_announcements, public.cms_academic_agenda, public.cms_hero_banners to service_role;
grant select, insert, update on public.cms_user_roles to service_role;
grant insert on public.cms_chatbot_analytics to service_role;

-- Conditionally create policies so rerunning this additive migration does not drop/replace policies.
do $policies$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_news' and policyname = 'cms_news_public_read') then
    create policy cms_news_public_read on public.cms_news for select to anon, authenticated
      using (is_published and (published_at is null or published_at <= now()));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_news' and policyname = 'cms_news_editor_insert') then
    create policy cms_news_editor_insert on public.cms_news for insert to authenticated
      with check (public.cms_user_has_role(array['admin_it', 'editor_guru_staf']));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_news' and policyname = 'cms_news_editor_update') then
    create policy cms_news_editor_update on public.cms_news for update to authenticated
      using (public.cms_user_has_role(array['admin_it', 'editor_guru_staf']))
      with check (public.cms_user_has_role(array['admin_it', 'editor_guru_staf']));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_news' and policyname = 'cms_news_admin_delete') then
    create policy cms_news_admin_delete on public.cms_news for delete to authenticated
      using (public.cms_user_has_role(array['admin_it']));
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_announcements' and policyname = 'cms_announcements_public_read') then
    create policy cms_announcements_public_read on public.cms_announcements for select to anon, authenticated
      using (is_published and (published_at is null or published_at <= now())
        and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at >= now()));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_announcements' and policyname = 'cms_announcements_editor_insert') then
    create policy cms_announcements_editor_insert on public.cms_announcements for insert to authenticated
      with check (public.cms_user_has_role(array['admin_it', 'editor_guru_staf']));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_announcements' and policyname = 'cms_announcements_editor_update') then
    create policy cms_announcements_editor_update on public.cms_announcements for update to authenticated
      using (public.cms_user_has_role(array['admin_it', 'editor_guru_staf']))
      with check (public.cms_user_has_role(array['admin_it', 'editor_guru_staf']));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_announcements' and policyname = 'cms_announcements_admin_delete') then
    create policy cms_announcements_admin_delete on public.cms_announcements for delete to authenticated
      using (public.cms_user_has_role(array['admin_it']));
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_academic_agenda' and policyname = 'cms_academic_agenda_public_read') then
    create policy cms_academic_agenda_public_read on public.cms_academic_agenda for select to anon, authenticated
      using (is_published and (published_at is null or published_at <= now()) and (ends_at is null or ends_at >= now()));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_academic_agenda' and policyname = 'cms_academic_agenda_editor_insert') then
    create policy cms_academic_agenda_editor_insert on public.cms_academic_agenda for insert to authenticated
      with check (public.cms_user_has_role(array['admin_it', 'editor_guru_staf']));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_academic_agenda' and policyname = 'cms_academic_agenda_editor_update') then
    create policy cms_academic_agenda_editor_update on public.cms_academic_agenda for update to authenticated
      using (public.cms_user_has_role(array['admin_it', 'editor_guru_staf']))
      with check (public.cms_user_has_role(array['admin_it', 'editor_guru_staf']));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_academic_agenda' and policyname = 'cms_academic_agenda_admin_delete') then
    create policy cms_academic_agenda_admin_delete on public.cms_academic_agenda for delete to authenticated
      using (public.cms_user_has_role(array['admin_it']));
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_hero_banners' and policyname = 'cms_hero_banners_public_read') then
    create policy cms_hero_banners_public_read on public.cms_hero_banners for select to anon, authenticated
      using (is_published and (published_at is null or published_at <= now()));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_hero_banners' and policyname = 'cms_hero_banners_editor_insert') then
    create policy cms_hero_banners_editor_insert on public.cms_hero_banners for insert to authenticated
      with check (public.cms_user_has_role(array['admin_it', 'editor_guru_staf']));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_hero_banners' and policyname = 'cms_hero_banners_editor_update') then
    create policy cms_hero_banners_editor_update on public.cms_hero_banners for update to authenticated
      using (public.cms_user_has_role(array['admin_it', 'editor_guru_staf']))
      with check (public.cms_user_has_role(array['admin_it', 'editor_guru_staf']));
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_hero_banners' and policyname = 'cms_hero_banners_admin_delete') then
    create policy cms_hero_banners_admin_delete on public.cms_hero_banners for delete to authenticated
      using (public.cms_user_has_role(array['admin_it']));
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cms_user_roles' and policyname = 'cms_user_roles_read_self_or_admin') then
    create policy cms_user_roles_read_self_or_admin on public.cms_user_roles for select to authenticated
      using (user_id = auth.uid() or public.cms_user_has_role(array['admin_it']));
  end if;
end
$policies$;
