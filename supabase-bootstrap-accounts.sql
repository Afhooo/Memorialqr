-- Bootstrap accounts (admin + cliente) y memorial asociado.
-- Ejecuta esto en Supabase SQL Editor (idealmente en staging/demo).
--
-- Objetivo:
-- - Asegurar que `hh2fc24@gmail.com` sea rol `admin` (no cambia su password actual).
-- - Crear/actualizar cliente `lpincheira@memorial.cl` rol `owner` con password `Memorial2025`.
-- - Asociar a ese cliente un memorial "Pablo Neruda" (real en DB, no el demo hardcodeado).

create extension if not exists pgcrypto;

-- 1) Asegurar rol admin para hh2fc24@gmail.com (sin tocar password).
update public.admin_users
set role = 'admin'
where email = 'hh2fc24@gmail.com';

-- 2) Crear/actualizar cliente con password fijo.
insert into public.admin_users (email, password_hash, role)
values ('lpincheira@memorial.cl', crypt('Memorial2025', gen_salt('bf')), 'owner')
on conflict (email) do update
set
  password_hash = excluded.password_hash,
  role = excluded.role;

-- 3) Crear memorial real "Pablo Neruda" para ese owner (si no existe).
do $$
declare
  owner_uuid uuid;
  memorial_id uuid;
begin
  select id into owner_uuid
  from public.admin_users
  where email = 'lpincheira@memorial.cl'
  limit 1;

  if owner_uuid is null then
    raise exception 'No se encontró usuario owner lpincheira@memorial.cl';
  end if;

  select id into memorial_id
  from public.memorials
  where public.memorials.owner_id = owner_uuid and lower(trim(name)) = 'pablo neruda'
  limit 1;

  if memorial_id is null then
    memorial_id := gen_random_uuid();

    insert into public.memorials (id, owner_id, name, description, birth_date, death_date)
    values (
      memorial_id,
      owner_uuid,
      'Pablo Neruda',
      'Memorial asociado al cliente para que gestione y agregue recuerdos.',
      '1904-07-12',
      '1973-09-23'
    );

    insert into public.memories (id, memorial_id, title, content, media_url, created_at)
    values (
      gen_random_uuid(),
      memorial_id,
      'Bienvenida',
      'Este memorial fue creado por el equipo. Puedes editarlo y publicar recuerdos con fotos o videos.',
      null,
      now()
    );
  end if;
end $$;
