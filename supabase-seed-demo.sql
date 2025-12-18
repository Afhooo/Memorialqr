-- Seed demo (ventas + clientes + memoriales + uso) para que el dashboard comercial se vea con dataset robusto.
-- Ejecuta esto SOLO en un entorno de demo/staging.
--
-- Requisitos: haber ejecutado `supabase-setup-real.sql` y tener las tablas:
-- - public.admin_users, public.memorials, public.memories, public.sales_orders

create extension if not exists pgcrypto;

-- Password para clientes demo: Demo1234!
-- 1) Crear clientes demo (120) para loguear y crear memoriales.
insert into public.admin_users (email, password_hash, role)
select
  format('cliente%03s@demo.recuerdame.cl', i),
  crypt('Demo1234!', gen_salt('bf')),
  'owner'
from generate_series(1, 120) as i
on conflict (email) do nothing;

-- 2) Crear 1 memorial por cliente + 2do memorial para ~35% (para emular multi-servicio).
with owners as (
  select id, email
  from public.admin_users
  where role = 'owner' and email like 'cliente%@demo.recuerdame.cl'
  order by email asc
),
base as (
  select
    o.id as owner_id,
    gen_random_uuid() as memorial_id,
    split_part(o.email, '@', 1) as slug,
    1 as seq
  from owners o
  union all
  select
    o.id as owner_id,
    gen_random_uuid() as memorial_id,
    split_part(o.email, '@', 1) as slug,
    2 as seq
  from owners o
  where random() < 0.35
)
insert into public.memorials (id, owner_id, name, description, birth_date, death_date)
select
  b.memorial_id,
  b.owner_id,
  initcap(replace(b.slug, 'cliente', 'Cliente ')) || ' · Memorial ' || b.seq,
  'Memorial con narrativa, fotos y condolencias. Dataset para presentaciones internas, QA y training.',
  date '1948-01-01' + (random() * 16000)::int,
  date '2023-01-01' + (random() * 700)::int
from base b
on conflict (id) do nothing;

-- 3) Seed de ventas diarias (últimos 180 días) con crecimiento + estacionalidad semanal.
-- Canales esperados por el dashboard:
-- - presencial, contact_center, web, convenios
with buyers as (
  select id
  from public.admin_users
  where role = 'owner' and email like 'cliente%@demo.recuerdame.cl'
),
mems as (
  select id, owner_id
  from public.memorials
),
days as (
  select
    (current_date - (n || ' days')::interval)::date as day,
    n as day_index,
    (1 - (n / 179.0)) as progress -- 0 (hace 180d) -> 1 (hoy)
  from generate_series(0, 179) as n
),
day_totals as (
  select
    d.day,
    d.progress,
    greatest(
      0,
      round(
        (14 + (d.progress * 18)) -- crecimiento base
        * (case extract(dow from d.day)
            when 0 then 0.78 -- domingo
            when 6 then 0.88 -- sábado
            else 1.0
          end)
        + (random() * 4) -- ruido
      )
    )::int as total
  from days d
),
expanded as (
  select
    dt.day,
    dt.progress,
    generate_series(1, dt.total) as seq
  from day_totals dt
),
picked as (
  select
    e.day,
    e.progress,
    e.seq,
    b.id as buyer_id,
    (select m.id from mems m where m.owner_id = b.id order by random() limit 1) as memorial_id,
    case
      when random() < (0.10 + 0.10 * e.progress) then 'web'
      when random() < (0.10 + 0.10 * e.progress) + (0.22 - 0.04 * e.progress) then 'contact_center'
      when random() < (0.10 + 0.10 * e.progress) + (0.22 - 0.04 * e.progress) + 0.05 then 'convenios'
      else 'presencial'
    end as channel
  from expanded e
  cross join lateral (select id from buyers order by random() limit 1) b
)
insert into public.sales_orders (buyer_id, memorial_id, channel, status, amount_cents, currency, external_ref, created_at)
select
  p.buyer_id,
  p.memorial_id,
  p.channel,
  'paid',
  case p.channel
    when 'web' then (2699000 + (random() * 500000))::int
    when 'contact_center' then (2899000 + (random() * 550000))::int
    when 'convenios' then (2499000 + (random() * 450000))::int
    else (2999000 + (random() * 650000))::int
  end,
  'CLP',
  'SRV-' || to_char(p.day, 'YYMMDD') || '-' || lpad(p.seq::text, 5, '0'),
  (p.day::timestamptz + (random() * interval '23 hours') + (random() * interval '59 minutes'))
from picked p;

-- 4) Activaciones: primer recuerdo (con lag desde venta) + recuerdos extra para engagement.
with first_sale as (
  select
    memorial_id,
    min(created_at) as sold_at
  from public.sales_orders
  where status = 'paid' and memorial_id is not null
  group by memorial_id
),
activated as (
  select
    memorial_id,
    sold_at,
    gen_random_uuid() as memory_id,
    (sold_at + (random() * interval '16 days') + (random() * interval '20 hours')) as first_memory_at
  from first_sale
  where random() < 0.76
)
insert into public.memories (id, memorial_id, title, content, media_url, created_at)
select
  a.memory_id,
  a.memorial_id,
  'Primer recuerdo',
  'Mensaje inicial de la familia. Texto de ejemplo para emular uso real del producto (feed social).',
  null,
  a.first_memory_at
from activated a
on conflict (id) do nothing;

with first_memory as (
  select memorial_id, min(created_at) as first_at
  from public.memories
  group by memorial_id
),
extras as (
  select
    fm.memorial_id,
    generate_series(1, (case when random() < 0.30 then 8 else 3 end)) as seq
  from first_memory fm
  where random() < 0.62
)
insert into public.memories (id, memorial_id, title, content, media_url, created_at)
select
  gen_random_uuid(),
  e.memorial_id,
  'Recuerdo',
  (array[
    'Foto compartida por la familia.',
    'Condolencia de un amigo cercano.',
    'Audio breve recordando una anécdota.',
    'Hito importante: trabajo, viaje o celebración.',
    'Mensaje de apoyo para la familia.'
  ])[1 + floor(random() * 5)::int],
  null,
  (fm.first_at + (random() * interval '80 days') + (random() * interval '20 hours'))
from extras e
join first_memory fm on fm.memorial_id = e.memorial_id;
