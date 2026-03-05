-- Seed Premium Demo Memorial

create extension if not exists pgcrypto;

-- 1) Create admin/owner for demo
insert into public.admin_users (email, password_hash, role)
values ('demo@recuerdame.cl', crypt('DemoPremium123!', gen_salt('bf')), 'owner')
on conflict (email) do nothing;

-- 2) Insert Premium Memorial with a fixed UUID to easily access it via /memorial/<uuid>
DO $$
DECLARE
  v_owner_id uuid;
  v_memorial_id uuid := '123e4567-e89b-12d3-a456-426614174000';
BEGIN
  -- Get the owner ID
  select id into v_owner_id from public.admin_users where email = 'demo@recuerdame.cl';

  -- Upsert memorial
  insert into public.memorials (
    id, owner_id, name, description, birth_date, death_date,
    cover_media_url, avatar_media_url
  )
  values (
    v_memorial_id,
    v_owner_id,
    'Elena Valdés',
    'Un ejemplo premium del poder de los recuerdos compartidos. Elena fue luz, amor y alegría para todos nosotros.',
    '1948-03-15',
    '2023-11-20',
    '/demo/scenic.png',
    '/demo/portrait.png'
  )
  on conflict (id) do update set
    name = excluded.name,
    description = excluded.description,
    cover_media_url = excluded.cover_media_url,
    avatar_media_url = excluded.avatar_media_url;

  -- Delete existing memories for this memorial to avoid duplicates if run multiple times
  delete from public.memories where memorial_id = v_memorial_id;

  -- Insert Premium Memories
  insert into public.memories (memorial_id, title, content, media_url, created_at)
  values 
    (v_memorial_id, 'Un día de verano en el sur', 'Siempre recordaremos este hermoso día de vacaciones. Tu sonrisa iluminaba todo a tu alrededor.', '/demo/family.png', now() - interval '2 days'),
    (v_memorial_id, 'Tus propias palabras', 'Encontramos esta carta que nos dejaste. Cada palabra nos da consuelo y nos recuerda tu infinita sabiduría.', '/demo/letter.png', now() - interval '1 day'),
    (v_memorial_id, 'Tu mejor legado', 'Tu legado no es lo material, es lo que dejaste en nuestros corazones: una familia unida que te amará siempre. Gracias por todo.', null, now());

END $$;
