import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jvtrmtoqvmxxhjdszlck.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2dHJtdG9xdm14eGhqZHN6bGNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDMzMjE0NSwiZXhwIjoyMDc5OTA4MTQ1fQ.qOVMSbxUU1mBVoqwB8smTA5WIc0p2juzNXVojjGxaxQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function fix() {
    const memorialId = '123e4567-e89b-12d3-a456-426614174000';

    // Get all users
    const { data: users, error: userErr } = await supabase.from('admin_users').select('id, email');
    if (userErr) {
        console.error(userErr);
        return;
    }

    console.log(`Found ${users.length} users. Giving them all access to the demo memorial...`);

    for (const user of users) {
        // Add to members if they are not the owner
        const { error: memberErr } = await supabase.from('memorial_members').upsert({
            memorial_id: memorialId,
            user_id: user.id
        }, { onConflict: 'memorial_id, user_id' });

        if (memberErr) {
            console.log(`Could not add ${user.email}:`, memberErr.message);
        } else {
            console.log(`Added access for ${user.email}`);
        }
    }
}

fix();
