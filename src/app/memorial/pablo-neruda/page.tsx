import Image from "next/image";
import Link from "next/link";
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
      <div className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-[#e3d2b9] bg-white/80 p-8 text-center text-[#2f261f]">
        <h1 className="text-3xl font-serif text-[#2b2018]">Memorial privado de Pablo Neruda</h1>
        <p>Inicia sesión para acceder a esta vista curada.</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-full border border-[#c9a36a]/70 px-5 py-3 text-[11px] uppercase tracking-[0.35em] text-[#7b5b3d]"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-14 text-[#2f261f]">
      <section className="relative overflow-hidden rounded-[40px] border border-[#e3d2b9] bg-[#0f0c0a] text-[#f7efe2] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-[#0f0c0a]" />
        </div>
        <div className="relative px-6 pb-8 pt-4 sm:px-10">
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#f0d7b2]/80">
            <span className="rounded-full border border-[#f0d7b2]/40 px-4 py-1">Memorial privado</span>
            <span className="rounded-full border border-[#f0d7b2]/40 px-4 py-1">Solo familia y admins</span>
          </div>
          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-[#f0d7b2]/60 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
                <Image src={profile.avatar} alt={profile.name} fill className="object-cover" unoptimized sizes="96px" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-serif text-[#f8efe0] sm:text-4xl">{profile.name}</h1>
                <p className="text-sm text-[#eadbc7]">{profile.tagline}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.35em]">
              <a
                href="#muro"
                className="rounded-full bg-[#f0d7b2] px-5 py-3 font-semibold text-[#2f261f] shadow-[0_18px_40px_rgba(0,0,0,0.3)] transition hover:-translate-y-[1px]"
              >
                Escribir mensaje
              </a>
              <Link
                href="/login"
                className="rounded-full border border-[#f0d7b2]/60 px-5 py-3 text-[#f7efe2] transition hover:bg-white/10"
              >
                Copiar enlace
              </Link>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#f0d7b2]/35 bg-white/5 p-4 text-sm text-[#eadbc7]">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#e3c89e]/90">Mensajes</p>
              <p className="text-2xl font-serif text-[#f8efe0]">328</p>
              <p>Condolencias y recuerdos moderados.</p>
            </div>
            <div className="rounded-2xl border border-[#f0d7b2]/35 bg-white/5 p-4 text-sm text-[#eadbc7]">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#e3c89e]/90">Lectores</p>
              <p className="text-2xl font-serif text-[#f8efe0]">+12k</p>
              <p>Visitantes únicos del memorial.</p>
            </div>
            <div className="rounded-2xl border border-[#f0d7b2]/35 bg-white/5 p-4 text-sm text-[#eadbc7]">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#e3c89e]/90">Hitos guardados</p>
              <p className="text-2xl font-serif text-[#f8efe0]">18</p>
              <p>Fechas y objetos importantes.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="muro" className="space-y-6">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#a07c55]">
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
          <span>Muro de mensajes</span>
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-[#eadfcd] bg-white/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#a07c55]">Escribir</p>
            <p className="text-sm text-[#3a2d22]">Deja un mensaje privado. Solo la familia y admins lo verán tras moderación.</p>
            <form className="mt-3 space-y-3">
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full rounded-2xl border border-[#eadfcd] bg-white px-4 py-3 text-sm text-[#2f261f] outline-none focus:border-[#c9a36a] focus:ring-2 focus:ring-[#c9a36a]/40"
              />
              <textarea
                placeholder="Escribe un recuerdo, una frase o unas líneas de cariño..."
                rows={4}
                className="w-full rounded-2xl border border-[#eadfcd] bg-white px-4 py-3 text-sm text-[#2f261f] outline-none focus:border-[#c9a36a] focus:ring-2 focus:ring-[#c9a36a]/40"
              />
              <button
                type="button"
                className="w-full rounded-2xl bg-gradient-to-r from-[#f0d7b2] to-[#d7b07a] px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#2f261f] shadow-[0_18px_45px_rgba(0,0,0,0.1)]"
              >
                Enviar (modo demo)
              </button>
            </form>
          </div>

          <div className="space-y-4">
            {wallPosts.map((post, index) => (
              <article
                key={post.id}
                className="rounded-3xl border border-[#eadfcd] bg-white/95 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.06)]"
                style={{ animationDelay: `${0.04 * index}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3e6d4] text-sm font-semibold text-[#5e4430]">
                    {post.author[0]}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[#2b2018]">{post.author}</p>
                      <span className="rounded-full bg-[#f0e0c8] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[#5e4430]">
                        {post.relation}
                      </span>
                      <span className="text-xs uppercase tracking-[0.25em] text-[#a07c55]">{post.date}</span>
                    </div>
                    <p className="text-[#3a2d22]">{post.message}</p>
                    {post.photo && (
                      <div className="relative mt-3 h-48 overflow-hidden rounded-2xl border border-[#eadfcd]">
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
                    <div className="mt-3 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.3em] text-[#a07c55]">
                      <span className="rounded-full bg-[#f3e6d4] px-3 py-1 text-[#5e4430]">♥ 128</span>
                      <span className="rounded-full bg-[#f3e6d4] px-3 py-1 text-[#5e4430]">Velas 36</span>
                      <span className="rounded-full bg-[#f3e6d4] px-3 py-1 text-[#5e4430]">Compartido 12</span>
                    </div>
                    <div className="mt-3 space-y-2 rounded-2xl border border-[#eadfcd] bg-[#fbf5ed] p-3">
                      {post.comments.map((comment) => (
                        <p key={comment.text} className="text-sm text-[#3a2d22]">
                          <span className="font-semibold text-[#2b2018]">{comment.author}:</span> {comment.text}
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
        <div className="space-y-4 rounded-[32px] border border-[#e3d2b9] bg-gradient-to-br from-white via-[#fbf5ed] to-[#f3e6d4] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
          <p className="text-[10px] uppercase tracking-[0.42em] text-[#a07c55]">Galería íntima</p>
          <h2 className="text-3xl font-serif text-[#2b2018]">Casas, mar y manuscritos</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {gallery.map((item) => (
              <div key={item.src} className="relative h-40 overflow-hidden rounded-2xl border border-[#eadfcd] shadow-[0_16px_50px_rgba(0,0,0,0.05)]">
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

        <div className="space-y-4 rounded-[32px] border border-[#e3d2b9] bg-white/90 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
          <p className="text-[10px] uppercase tracking-[0.42em] text-[#a07c55]">Poemas y hitos</p>
          <h2 className="text-3xl font-serif text-[#2b2018]">Línea de vida</h2>
          <div className="space-y-3">
            {timeline.map((item) => (
              <div key={item.title} className="rounded-2xl border border-[#eadfcd] bg-[#fbf5ed] px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#2b2018]">{item.title}</p>
                  <span className="text-[11px] uppercase tracking-[0.3em] text-[#a07c55]">{item.date}</span>
                </div>
                <p className="text-sm text-[#3a2d22]">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-3 rounded-2xl border border-[#eadfcd] bg-gradient-to-br from-white via-[#fbf5ed] to-[#f3e6d4] p-4">
            {poems.map((poem) => (
              <div key={poem.title} className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#a07c55]">{poem.title}</p>
                <p className="text-lg font-serif text-[#2b2018]">“{poem.fragment}”</p>
                <p className="text-xs text-[#5e4430]">{poem.context}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-[#e3d2b9] bg-gradient-to-br from-white via-[#fbf5ed] to-[#f3e6d4] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.42em] text-[#a07c55]">Privado y compartible</p>
            <h2 className="text-3xl font-serif text-[#2b2018]">Mantén vivo el enlace</h2>
            <p className="max-w-3xl text-[#3a2d22]">
              Envía este memorial a quienes aman su poesía. Pueden dejar mensajes moderados y encender velas digitales durante treinta días.
            </p>
          </div>
          <Link
            href="/login"
            className="rounded-full border border-[#c9a36a]/70 px-5 py-3 text-[11px] uppercase tracking-[0.35em] text-[#7b5b3d]"
          >
            Copiar enlace
          </Link>
        </div>
      </section>
    </div>
  );
}
