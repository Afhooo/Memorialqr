import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jvtrmtoqvmxxhjdszlck.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2dHJtdG9xdm14eGhqZHN6bGNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDMzMjE0NSwiZXhwIjoyMDc5OTA4MTQ1fQ.qOVMSbxUU1mBVoqwB8smTA5WIc0p2juzNXVojjGxaxQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function enrichDemo() {
    console.log('Injecting authentic memories...');

    const memorialId = '123e4567-e89b-12d3-a456-426614174000';

    const { error: deleteErr } = await supabase
        .from('memories')
        .delete()
        .eq('memorial_id', memorialId);

    if (deleteErr) {
        console.warn('Error deleting memories', deleteErr);
    }

    const now = Date.now();
    const daysAgo = (days) => new Date(now - days * 24 * 60 * 60 * 1000).toISOString();

    const memoriesToInsert = [
        {
            memorial_id: memorialId,
            title: 'Tardes de sol en el parque',
            content: 'Todavía recuerdo como si fuera ayer esta tarde en el parque. Tenías esa habilidad única para detener el tiempo con una sola carcajada. Eras pura luz, pura energía que contagiaba a quien se cruzara en tu camino. Esta foto captura exactamente tu esencia libre.',
            media_url: '/demo/youth.png',
            created_at: daysAgo(120)
        },
        {
            memorial_id: memorialId,
            title: 'El aroma de las mañanas de domingo',
            content: 'Hoy me animé a buscar tu viejo recetario de madera. Al encontrar la receta de este bizcocho, pude jurar que sentía el aroma dulce de la canela inundando la casa. Hornearlo fue como tenerte a mi lado de nuevo, guiando cada uno de mis pasos.',
            media_url: '/demo/recipe.png',
            created_at: daysAgo(85)
        },
        {
            memorial_id: memorialId,
            title: 'Tu sabiduría inagotable',
            content: 'Más de cuarenta años compartiendo confidencias, cafés y silencios cómplices. Recuerdo cómo siempre tenías la palabra exacta para apaciguar cualquier tormenta. No eras solo mi hermana mayor, eras mi ancla. A veces me descubro hablando sola esperando escuchar tu consejo de vuelta.',
            media_url: null,
            created_at: daysAgo(60)
        },
        {
            memorial_id: memorialId,
            title: 'Donde el tiempo se detiene',
            content: 'El jardín por el que tanto trabajaste amaneció hoy espectacular. Las rosas que plantaste con tus propias manos están en su máximo esplendor. Este siempre será tu santuario, el lugar donde el viento todavía susurra tu nombre al pasar sobre las ramas lavanda.',
            media_url: '/demo/garden.png',
            created_at: daysAgo(42)
        },
        {
            memorial_id: memorialId,
            title: 'Un brindis por tu vida',
            content: 'Ayer nos encontramos todos. Hablamos de ti recordando tus anécdotas, aquellas historias repetidas que contabas mejor que nadie y que nunca dejaban de hacernos llorar de la risa. Brindamos mirando al cielo, sabiendo que nos observabas desde el rincón más hermoso del universo.',
            media_url: null,
            created_at: daysAgo(25)
        },
        {
            memorial_id: memorialId,
            title: 'Tu última gran lección',
            content: 'Abuelita hermosa, repasar tus cartas se ha convertido en mi refugio absoluto. La paz inquebrantable con la que enfrentaste todo es la lección más grande de vida que me pudiste heredar. Toco tu letra en el papel y siento una calma inmensa envolviéndome.',
            media_url: '/demo/letter.png',
            created_at: daysAgo(15)
        },
        {
            memorial_id: memorialId,
            title: 'Siempre fuiste nuestro faro',
            content: 'Es imposible medir el vacío que dejaste, pero es aún más inmensa la gratitud que sentimos por haberte tenido. Nos enseñaste el significado del amor incondicional, a no rendirnos jamás. Tu legado vive en nuestras reuniones familiares, que nunca dejaremos de organizar en tu honor.',
            media_url: null,
            created_at: daysAgo(7)
        },
        {
            memorial_id: memorialId,
            title: 'Hasta siempre, mi alma gemela',
            content: 'Las estaciones seguirán cambiando, pero tú permanecerás intacta en esta familia. No te fuiste del todo, simplemente aprendiste a caminar invisible a nuestro lado. Prometo mantener vivo tu recuerdo hasta que el destino nos vuelva a juntar.',
            media_url: '/demo/family.png',
            created_at: daysAgo(1)
        }
    ];

    const { error: insertErr } = await supabase
        .from('memories')
        .insert(memoriesToInsert);

    if (insertErr) {
        console.error('Error inserting memories', insertErr);
        return;
    }

    console.log('Successfully enriched authentic memories!');
}

enrichDemo();
