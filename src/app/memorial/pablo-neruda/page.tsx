import Image from "next/image";
import Link from "next/link";
import { CreateDemoMemorialButton } from "@/components/CreateDemoMemorialButton";
import { getServerSession } from "@/lib/serverSession";

const profile = {
  name: "Pablo Neruda",
  avatar: "https://upload.wikimedia.org/wikipedia/commons/7/70/Neruda_1966.jpg",
  cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
  tagline: "Poeta del Pacífico, Nobel 1971. Aquí guardamos su voz y las cartas que siguen llegando.",
};

const wallPosts = [
  {
    id: "matilde",
    author: "Matilde Urrutia",
    relation: "Esposa",
    date: "Hace 2 horas",
    message:
      "Pablo, el mar sigue golpeando Isla Negra. Hoy dejé flores naranjas en la mesa donde escribías. Gracias por enseñarme a mirar lo cotidiano con ternura.",
    photo: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    comments: [
      { author: "Isabel Allende", text: "Gracias por abrirnos tu casa y tus palabras, Matilde." },
      { author: "Fundación Neruda", text: "Guardamos tu mensaje en el archivo con cariño." },
    ],
  },
  {
    id: "gabriela",
    author: "Gabriela Mistral",
    relation: "Colega y maestra",
    date: "Ayer",
    message:
      "Muchacho de Parral, tus odas a la cebolla y al pan siguen siendo oración diaria para quienes trabajamos la tierra y la palabra.",
    photo: null,
    comments: [{ author: "Mario Benedetti", text: "Qué hermoso leerte aquí, Gabriela." }],
  },
  {
    id: "compa",
    author: "Luis Reyes",
    relation: "Vecino de Temuco",
    date: "Hace 3 días",
    message:
      "Tu libro con dedicatoria aún está en la biblioteca del barrio. Lo prestamos como se comparte el pan. Tus versos llegaron a quienes nunca pisaron un teatro.",
    photo: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
    comments: [
      { author: "Fundación Neruda", text: "Gracias por mantener esa biblioteca viva." },
      { author: "Carolina R.", text: "Mis padres lo leían en voz alta los domingos." },
    ],
  },
];

const gallery = [
  { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80", label: "Isla Negra" },
  { src: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1200&q=80", label: "Valparaíso" },
  { src: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=1200&q=80", label: "Cuadernos y tinta" },
  { src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80", label: "Lecturas públicas" },
];

const timeline = [
  { title: "Parral", date: "12 jul 1904", detail: "Nace Ricardo Eliécer Neftalí Reyes Basoalto en una familia ferroviaria." },
  { title: "Veinte poemas", date: "1924", detail: "Publica 'Veinte poemas de amor y una canción desesperada'." },
  { title: "Exilio y retorno", date: "1939-1949", detail: "Labor diplomática, clandestinidad y regreso al país." },
  { title: "Nobel", date: "1971", detail: "Premio Nobel de Literatura por una obra continental." },
  { title: "Partida", date: "23 sep 1973", detail: "Fallece en Santiago; su casa en Isla Negra se vuelve lugar de memoria." },
];

const poems = [
  {
    title: "Poema 20",
    fragment: "Puedo escribir los versos más tristes esta noche...",
    context: "De 'Veinte poemas de amor y una canción desesperada'.",
  },
  {
    title: "Alturas de Macchu Picchu",
    fragment: "Sube conmigo, amor americano.",
    context: "Canto épico a la tierra y a los pueblos originarios.",
  },
  {
    title: "Oda al mar",
    fragment: "Aquí te quedas, quieto mar...",
    context: "Las odas elementales como oración a lo cotidiano.",
  },
];

export default async function PabloNerudaMemorialPage() {
  const session = await getServerSession();

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-[#e0e0e0] bg-white/80 p-8 text-center text-[#333333]">
        <h1 className="text-3xl font-serif text-[#333333]">Memorial privado de Pablo Neruda</h1>
        <p>Inicia sesión para acceder a esta vista curada.</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-full border border-[#e87422]/70 px-5 py-3 text-[11px] uppercase tracking-[0.35em] text-[#e87422]"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-14 text-[#333333]">
      <section className="relative overflow-hidden rounded-[40px] border border-[#e0e0e0] bg-gradient-to-b from-[#1f1f1f] via-[#2a2a2a] to-[#1a1a1a] text-white shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <div className="relative h-[220px] sm:h-[260px]">
          <Image
            src={profile.cover}
            alt="Mar de Isla Negra"
            fill
            className="object-cover"
            priority
            unoptimized
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-transparent" />
        </div>
        <div className="relative px-6 pb-8 pt-4 sm:px-10">
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-white/75">
            <span className="rounded-full border border-white/25 px-4 py-1">Memorial privado</span>
            <span className="rounded-full border border-white/25 px-4 py-1">Solo familia y admins</span>
          </div>
          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-[#e87422]/60 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
                <Image src={profile.avatar} alt={profile.name} fill className="object-cover" unoptimized sizes="96px" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-serif text-white sm:text-4xl">{profile.name}</h1>
                <p className="text-sm text-white/80">{profile.tagline}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.35em]">
              <a
                href="#muro"
                className="rounded-full bg-[#e87422] px-5 py-3 font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.3)] transition hover:-translate-y-[1px]"
              >
                Escribir mensaje
              </a>
              <Link
                href="/login"
                className="rounded-full border border-white/25 px-5 py-3 text-white transition hover:border-[#e87422]"
              >
                Copiar enlace
              </Link>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/80">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#ff9800]">Mensajes</p>
              <p className="text-2xl font-serif text-white">328</p>
              <p>Condolencias y recuerdos moderados.</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/80">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#ff9800]">Lectores</p>
              <p className="text-2xl font-serif text-white">+12k</p>
              <p>Visitantes únicos del memorial.</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/80">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#ff9800]">Hitos guardados</p>
              <p className="text-2xl font-serif text-white">18</p>
              <p>Fechas y objetos importantes.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="muro" className="space-y-6">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#e87422]">
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
          <span>Muro de mensajes</span>
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-[#e0e0e0] bg-white/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#e87422]">Escribir</p>
            <p className="text-sm text-[#4a4a4a]">
              Para publicar mensajes y verlos en el muro, crea tu memorial y escribe allí. Este espacio es una muestra estática.
            </p>
            <div className="mt-4">
              {session ? (
                <CreateDemoMemorialButton />
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-full border border-[#e87422] px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#e87422]"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {wallPosts.map((post, index) => (
              <article
                key={post.id}
                className="rounded-3xl border border-[#e0e0e0] bg-white/95 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.06)]"
                style={{ animationDelay: `${0.04 * index}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef2ef] text-sm font-semibold text-[#555555]">
                    {post.author[0]}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[#333333]">{post.author}</p>
                      <span className="rounded-full bg-[#f7f7f7] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[#555555]">
                        {post.relation}
                      </span>
                      <span className="text-xs uppercase tracking-[0.25em] text-[#e87422]">{post.date}</span>
                    </div>
                    <p className="text-[#4a4a4a]">{post.message}</p>
                    {post.photo && (
                      <div className="relative mt-3 h-48 overflow-hidden rounded-2xl border border-[#e0e0e0]">
                        <Image
                          src={post.photo}
                          alt={post.author}
                          fill
                          className="object-cover"
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.3em] text-[#e87422]">
                      <span className="rounded-full bg-[#eef2ef] px-3 py-1 text-[#555555]">♥ 128</span>
                      <span className="rounded-full bg-[#eef2ef] px-3 py-1 text-[#555555]">Velas 36</span>
                      <span className="rounded-full bg-[#eef2ef] px-3 py-1 text-[#555555]">Compartido 12</span>
                    </div>
                    <div className="mt-3 space-y-2 rounded-2xl border border-[#e0e0e0] bg-[#f7f7f7] p-3">
                      {post.comments.map((comment) => (
                        <p key={comment.text} className="text-sm text-[#4a4a4a]">
                          <span className="font-semibold text-[#333333]">{comment.author}:</span> {comment.text}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4 rounded-[32px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
          <p className="text-[10px] uppercase tracking-[0.42em] text-[#e87422]">Galería íntima</p>
          <h2 className="text-3xl font-serif text-[#333333]">Casas, mar y manuscritos</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {gallery.map((item) => (
              <div key={item.src} className="relative h-40 overflow-hidden rounded-2xl border border-[#e0e0e0] shadow-[0_16px_50px_rgba(0,0,0,0.05)]">
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  className="object-cover"
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                <p className="absolute bottom-2 left-3 text-xs text-white/85">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[32px] border border-[#e0e0e0] bg-white/90 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
          <p className="text-[10px] uppercase tracking-[0.42em] text-[#e87422]">Poemas y hitos</p>
          <h2 className="text-3xl font-serif text-[#333333]">Línea de vida</h2>
          <div className="space-y-3">
            {timeline.map((item) => (
              <div key={item.title} className="rounded-2xl border border-[#e0e0e0] bg-[#f7f7f7] px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#333333]">{item.title}</p>
                  <span className="text-[11px] uppercase tracking-[0.3em] text-[#e87422]">{item.date}</span>
                </div>
                <p className="text-sm text-[#4a4a4a]">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-3 rounded-2xl border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] p-4">
            {poems.map((poem) => (
              <div key={poem.title} className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">{poem.title}</p>
                <p className="text-lg font-serif text-[#333333]">“{poem.fragment}”</p>
                <p className="text-xs text-[#555555]">{poem.context}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.42em] text-[#e87422]">Privado y compartible</p>
            <h2 className="text-3xl font-serif text-[#333333]">Mantén vivo el enlace</h2>
            <p className="max-w-3xl text-[#4a4a4a]">
              Envía este memorial a quienes aman su poesía. Pueden dejar mensajes moderados y encender velas digitales durante treinta días.
            </p>
          </div>
          <Link
            href="/login"
            className="rounded-full border border-[#e87422]/70 px-5 py-3 text-[11px] uppercase tracking-[0.35em] text-[#e87422]"
          >
            Copiar enlace
          </Link>
        </div>
      </section>
    </div>
  );
}
