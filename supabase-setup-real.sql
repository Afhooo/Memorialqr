-- Supabase setup (bucket + roles + sales analytics)
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase.

-- 1) Storage bucket privado para media del memorial.
--    Nota: `id` y `name` suelen ser el mismo string en Supabase Storage.
insert into storage.buckets (id, name, public)
values ('memorial-media', 'memorial-media', false)
on conflict (id) do nothing;

-- 2) Extender memorials para portada/avatar + template (sin romper los URLs externos).
alter table if exists public.memorials
  add column if not exists cover_media_url text,
  add column if not exists cover_media_path text,
  add column if not exists avatar_media_url text,
  add column if not exists avatar_media_path text,
  add column if not exists template_id text,
  add column if not exists facebook_url text,
  add column if not exists instagram_url text;

-- 3) Extender memories para soportar media subida a Storage (path) además de URLs externas.
alter table if exists public.memories
  add column if not exists media_path text;

create index if not exists memories_memorial_id_created_at_idx
  on public.memories (memorial_id, created_at desc);

-- 3.1) Usuarios agregados al memorial (familiares/colaboradores).
create table if not exists public.memorial_members (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid not null references public.memorials(id) on delete cascade,
  user_id uuid not null references public.admin_users(id) on delete cascade,
  added_by uuid null references public.admin_users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (memorial_id, user_id)
);

create index if not exists memorial_members_memorial_id_idx on public.memorial_members (memorial_id);
create index if not exists memorial_members_user_id_idx on public.memorial_members (user_id);

-- 4) Tabla real de compras/ventas (para análisis por canal y “clientes que compraron”).
create table if not exists public.sales_orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.admin_users(id) on delete cascade,
  memorial_id uuid null references public.memorials(id) on delete set null,
  channel text not null,
  status text not null default 'paid',
  amount_cents integer null,
  currency text not null default 'CLP',
  external_ref text null,
  created_at timestamptz not null default now()
);

create index if not exists sales_orders_buyer_id_idx on public.sales_orders (buyer_id);
create index if not exists sales_orders_channel_idx on public.sales_orders (channel);
create index if not exists sales_orders_created_at_idx on public.sales_orders (created_at desc);

-- Demo opcional:
-- Si necesitas ver el dashboard con datos llenos en un entorno de demo/staging,
-- ejecuta también `supabase-seed-demo.sql`.
