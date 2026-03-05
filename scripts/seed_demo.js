require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MEMORIAL_ID = '376dfb6e-8a6a-48c4-adb2-e1bf46372613';

// To attribute memories, we need a user id. 
// Just get the owner of the memorial or any user.
async function main() {
    const { data: memorial } = await supabase
        .from('memorials')
        .select('owner_id')
        .eq('id', MEMORIAL_ID)
        .single();

    const userId = memorial?.owner_id || null;

    const memories = [
        {
            memorial_id: MEMORIAL_ID,
            user_id: userId,
            title: 'Aquel verano inolvidable',
            content: 'Todavía recuerdo las risas en la casa del lago. Las tardes eternas conversando sobre nada y todo a la vez. Esa cena fue especial, la comida de la abuela y todos reunidos bajo la luz cálida del comedor. Gracias por tantos momentos hermosos que ahora atesoramos más que nunca.',
            media_url: '/demo/family.png',
            is_approved: true,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
        },
        {
            memorial_id: MEMORIAL_ID,
            user_id: userId,
            title: 'Tus atardeceres favoritos',
            content: 'Siempre decías que no había nada como la paz del lago al atardecer. Hoy vine a sentarme en tu muelle, el cielo se pintó de naranja y dorado, como a ti te gustaba. Fue imposible no sentirte sentado al lado, en silencio, disfrutando el final del día.',
            media_url: '/demo/scenic.png',
            is_approved: true,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        },
        {
            memorial_id: MEMORIAL_ID,
            user_id: userId,
            title: 'Esa sonrisa que iluminaba todo',
            content: 'Encontré esta foto de nuestro viaje a la capital en 2018. Qué manera de reírnos aquel día. Tu energía era contagiosa, y esa carcajada franca que tenías es exactamente como quiero recordarte para siempre. Eres enorme.',
            media_url: '/demo/portrait.png',
            is_approved: true,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
        },
        {
            memorial_id: MEMORIAL_ID,
            user_id: userId,
            title: 'Tus sabias palabras',
            content: 'Guardé cada carta que me escribiste. Esta en particular, con tu caligrafía perfecta, me ha dado mucha paz en estos días difíciles. "El tiempo no borra el afecto que construimos", escribiste. Y tenías toda la razón. Te extrañamos inmensamente.',
            media_url: '/demo/letter.png',
            is_approved: true,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        }
    ];

    for (const memory of memories) {
        const { error } = await supabase.from('memories').insert(memory);
        if (error) {
            console.error('Error inserting memory:', error.message);
        } else {
            console.log('Inserted memory:', memory.title);
        }
    }

    console.log('Done!');
}

main().catch(console.error);
