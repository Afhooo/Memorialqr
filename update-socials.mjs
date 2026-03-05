import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jvtrmtoqvmxxhjdszlck.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2dHJtdG9xdm14eGhqZHN6bGNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDMzMjE0NSwiZXhwIjoyMDc5OTA4MTQ1fQ.qOVMSbxUU1mBVoqwB8smTA5WIc0p2juzNXVojjGxaxQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    const memorialId = '123e4567-e89b-12d3-a456-426614174000';
    await supabase.from('memorials').update({
        facebook_url: 'https://facebook.com/ximena.montesinos',
        instagram_url: 'https://instagram.com/isabella.m.art'
    }).eq('id', memorialId);
    console.log('Socials updated');
}
run();
