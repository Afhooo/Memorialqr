import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const SUPABASE_URL = 'https://jvtrmtoqvmxxhjdszlck.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2dHJtdG9xdm14eGhqZHN6bGNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDMzMjE0NSwiZXhwIjoyMDc5OTA4MTQ1fQ.qOVMSbxUU1mBVoqwB8smTA5WIc0p2juzNXVojjGxaxQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
    console.log('Seeding authentic elegant data...');

    // 1. Create or get user
    let ownerId;
    const { data: existingUsers, error: fetchErr } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', 'demo@recuerdame.cl');

    if (fetchErr) {
        console.error('Error fetching admin_users', fetchErr);
        return;
    }

    if (existingUsers && existingUsers.length > 0) {
        ownerId = existingUsers[0].id;
    } else {
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync('DemoPremium123!', salt);

        const { data: newUser, error: createError } = await supabase
            .from('admin_users')
            .insert({
                email: 'demo@recuerdame.cl',
                password_hash: passwordHash,
                role: 'owner'
            })
            .select('id')
            .single();

        if (createError) {
            console.error('Error creating user', createError);
            return;
        }
        ownerId = newUser.id;
    }

    // 2. Upsert Memorial
    const memorialId = '123e4567-e89b-12d3-a456-426614174000';

    const { error: memorialErr } = await supabase
        .from('memorials')
        .upsert({
            id: memorialId,
            owner_id: ownerId,
            name: 'Isabella Montesínos',
            description: 'Una vida entrelazada con el arte, las flores y el amor incondicional. En este santuario preservamos el eco de tu voz y la luz eterna de tu sonrisa. Tu legado florece en cada uno de nosotros.',
            birth_date: '1952-05-12',
            death_date: '2023-09-08',
            cover_media_url: '/demo/scenic.png',
            avatar_media_url: '/demo/portrait.png'
        });

    if (memorialErr) {
        console.error('Error upserting memorial', memorialErr);
        return;
    }

    console.log('Successfully set up the main memorial profile!');
}

seed();
