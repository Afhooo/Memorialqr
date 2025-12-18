-- Seed demo (ventas + clientes + memoriales) para que el dashboard se vea “real” con datos en DB.
-- Ejecuta esto SOLO en un entorno de demo/staging.
--
-- Requisitos: haber ejecutado `supabase-setup-real.sql` y tener las tablas:
-- - public.admin_users, public.memorials, public.memories, public.sales_orders

create extension if not exists pgcrypto;

-- 1) Crear clientes demo con password conocido (para loguear y crear memoriales).
--    Password: Demo1234!
insert into public.admin_users (email, password_hash, role)
select
  format('cliente%02s@demo.recuerdame.cl', i),
  crypt('Demo1234!', gen_salt('bf')),
  'owner'
from generate_series(1, 30) as i
on conflict (email) do nothing;

-- 2) Crear memoriales demo para un subset de clientes.
with owners as (
  select id, email
  from public.admin_users
  where role = 'owner'
  order by email asc
  limit 22
),
owner_memorials as (
  select
    o.id as owner_id,
    gen_random_uuid() as memorial_id,
    split_part(o.email, '@', 1) as slug
  from owners o
  cross join generate_series(1, 2) as j
)
insert into public.memorials (id, owner_id, name, description, birth_date, death_date)
select
  m.memorial_id,
  m.owner_id,
  initcap(replace(m.slug, 'cliente', 'Cliente ')) || ' · Memorial ' || row_number() over (partition by m.owner_id order by m.memorial_id),
  'Memorial de demostración con narrativa, fotos y condolencias. Dataset para presentaciones internas y QA.',
  date '1948-01-01' + (random() * 16000)::int,
  date '2023-01-01' + (random() * 700)::int
from owner_memorials m
on conflict (id) do nothing;

-- 3) Crear memorias (activaciones) para una parte de memoriales.
with m as (
  select id as memorial_id
  from public.memorials
  order by random()
),
rows as (
  select memorial_id, gen_random_uuid() as id
  from m
  where random() < 0.78
)
insert into public.memories (id, memorial_id, title, content, media_url, created_at)
select
  r.id,
  r.memorial_id,
  'Primer recuerdo',
  'Mensaje inicial de la familia. Texto de ejemplo para emular uso real del producto (feed social).',
  null,
  now() - ((random() * 180)::int || ' days')::interval - ((random() * 10)::int || ' hours')::interval
from rows r
on conflict (id) do nothing;

-- 4) Seed de ventas pagadas por canal con distribución mensual (últimos 6 meses).
-- Canales esperados por el dashboard:
-- - presencial, contact_center, web, convenios
with buyers as (
  select id
  from public.admin_users
  where role = 'owner'
  order by random()
  limit 30
),
mems as (
  select id, owner_id
  from public.memorials
),
month_buckets as (
  select date_trunc('month', now()) - (n || ' months')::interval as month_start,
         (case n
           when 5 then 520
           when 4 then 560
           when 3 then 610
           when 2 then 680
           when 1 then 720
           else 780
         end) as total
  from generate_series(0, 5) as n
),
channels as (
  select * from (values
    ('presencial', 0.52, 2999000),
    ('contact_center', 0.28, 2999000),
    ('web', 0.15, 2799000),
    ('convenios', 0.05, 2599000)
  ) as c(channel, pct, amount_cents)
),
expanded as (
  select
    mb.month_start,
    c.channel,
    c.amount_cents,
    generate_series(1, greatest(1, floor(mb.total * c.pct)::int)) as seq
  from month_buckets mb
  join channels c on true
),
picked as (
  select
    e.month_start,
    e.channel,
    e.amount_cents,
    (select id from buyers order by random() limit 1) as buyer_id,
    e.seq
  from expanded e
)
insert into public.sales_orders (buyer_id, memorial_id, channel, status, amount_cents, currency, external_ref, created_at)
select
  p.buyer_id,
  (select m.id from mems m where m.owner_id = p.buyer_id order by random() limit 1),
  p.channel,
  'paid',
  p.amount_cents,
  'CLP',
  'SRV-' || to_char(p.month_start, 'YYMM') || '-' || lpad(p.seq::text, 5, '0'),
  p.month_start + (random() * interval '27 days') + (random() * interval '18 hours')
from picked p;

