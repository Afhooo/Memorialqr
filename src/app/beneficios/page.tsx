import Link from "next/link";

const benefits = [
  {
    title: "Memorial vivo y sin anuncios",
    body: "Un espacio íntimo que se mantiene limpio de publicidad para leer, recordar y sumar memorias con calma.",
  },
  {
    title: "Historias moderadas con respeto",
    body: "Cartas, notas de voz y fotos se revisan antes de publicarse para cuidar el tono y la serenidad del homenaje.",
  },
  {
    title: "Un solo enlace para toda la familia",
    body: "Comparte por mensaje, correo o QR y todos llegan al mismo lugar, incluso si están lejos o en otro horario.",
  },
  {
    title: "Línea de vida y archivo seguro",
    body: "Fechas, hitos, galerías y videos ordenados en un solo lugar para que no se pierdan con el tiempo.",
  },
  {
    title: "Rituales simbólicos",
    body: "Velas, flores o una paloma ascendente que se pueden encender en fechas especiales o cuando alguien lo necesite.",
  },
  {
    title: "Tiempo para decidir",
    body: "La opción gratuita permite crear, editar y compartir sin presión económica durante treinta días.",
  },
];

const comparison = [
  {
    aspect: "Avisar y convocar",
    before: "Una esquela impresa breve con alcance local y fechas fijas.",
    now: "Esquela digital ampliada y editable, lista para compartir por enlace o QR en minutos.",
    gain: "Quien no pudo estar se entera a tiempo y sabe cómo acompañar.",
  },
  {
    aspect: "Participar y aportar",
    before: "Solo quienes asisten físicamente pueden despedirse.",
    now: "Familiares y amistades colaboran desde cualquier ciudad con mensajes, fotos y notas de voz.",
    gain: "Cada persona puede expresar su cariño sin importar la distancia.",
  },
  {
    aspect: "Duración del homenaje",
    before: "La esquela desaparece al terminar el funeral.",
    now: "El memorial sigue vivo, renovable o perpetuo según la familia.",
    gain: "La memoria permanece accesible y puede crecer con el tiempo.",
  },
  {
    aspect: "Cuidado del tono",
    before: "Mensajes públicos sin filtro que pueden incomodar.",
    now: "Moderación previa para que solo se publiquen palabras serenas y empáticas.",
    gain: "Un ambiente protegido para leer sin sobresaltos.",
  },
  {
    aspect: "Presencia y rituales",
    before: "Hay que ir al cementerio para dejar flores o velas.",
    now: "Velas digitales y símbolos encendidos 24/7, además de recordatorios para aniversarios.",
    gain: "Presencia constante aunque la familia esté lejos.",
  },
  {
    aspect: "Costo y espacio",
    before: "Avisos impresos caros y con límite de caracteres.",
    now: "Texto amplio, multimedia y opción gratuita inicial sin tarjeta.",
    gain: "Más contexto y cariño sin sumar presión económica.",
  },
];

export default function BenefitsPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-14 px-4 py-12 text-[#2f261f]">
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#0f0c0a] via-[#161018] to-[#1f1711] px-6 py-12 text-[#f7efe2] shadow-[0_36px_120px_rgba(0,0,0,0.35)] sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,225,180,0.22),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_32%)]" />
        <div className="relative space-y-6">
          <p className="text-[11px] uppercase tracking-[0.42em] text-[#f0d7b2]/85">Beneficios</p>
          <div className="space-y-3 max-w-3xl">
            <h1 className="text-4xl font-serif leading-tight md:text-5xl">Un memorial cuidado, pensado para acompañar</h1>
            <p className="text-lg leading-relaxed text-[#eadbc7]">
              Creamos un espacio sereno para avisar, compartir recuerdos y volver cuando duela. Sin anuncios, con moderación y con
              gestos simbólicos que mantienen viva la presencia de quien amas.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.38em]">
            <Link
              href="/"
              className="rounded-full border border-[#f0d7b2]/70 px-5 py-3 text-[#f7efe2] transition hover:bg-white/10"
            >
              Volver a inicio
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-[#f0d7b2] px-6 py-3 font-semibold text-[#2f261f] shadow-[0_18px_40px_rgba(0,0,0,0.25)] transition hover:translate-y-[-2px]"
            >
              Crear un memorial
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-[32px] border border-[#e3d2b9] bg-gradient-to-br from-white via-[#fbf5ed] to-[#f3e6d4]/80 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#a07c55]">
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
          <span>Beneficios clave</span>
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {benefits.map((item, index) => (
            <article
              key={item.title}
              className="rounded-3xl border border-[#eadfcd] bg-white/80 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.06)]"
              style={{ animationDelay: `${0.04 * index}s` }}
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[#a07c55]">
                <span className="rounded-full bg-[#c9a36a]/15 px-3 py-1">{String(index + 1).padStart(2, "0")}</span>
                <span>Para la familia</span>
              </div>
              <h3 className="mt-3 text-xl font-serif text-[#2b2018]">{item.title}</h3>
              <p className="mt-2 text-[#3a2d22]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5 rounded-[32px] border border-[#e3d2b9] bg-white/85 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#a07c55]">
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
          <span>Cómo cambia la experiencia</span>
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {comparison.map((item, index) => (
            <article
              key={item.aspect}
              className="rounded-3xl border border-[#eadfcd] bg-gradient-to-br from-white via-[#faf2e7] to-[#f0e0c8] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.06)]"
              style={{ animationDelay: `${0.03 * index}s` }}
            >
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.32em] text-[#a07c55]">
                <span>{item.aspect}</span>
                <span className="h-px w-8 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
              </div>
              <div className="mt-3 space-y-3 text-sm text-[#3a2d22]">
                <div className="rounded-2xl bg-white/80 p-3">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#8f7558]">Antes</p>
                  <p>{item.before}</p>
                </div>
                <div className="rounded-2xl bg-white/80 p-3">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#8f7558]">En un memorial digital</p>
                  <p>{item.now}</p>
                </div>
                <div className="rounded-2xl bg-[#c9a36a]/10 p-3">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#8f7558]">Lo que gana la familia</p>
                  <p>{item.gain}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#e3d2b9]/80 bg-gradient-to-r from-white via-[#fbf5ed] to-[#f6ead8] p-7 text-[#2f261f] shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#a07c55]">Listo para compartir</p>
            <p className="text-xl font-serif text-[#2b2018]">Crea el memorial y avisa a quienes no pudieron estar.</p>
          </div>
          <Link
            href="/login"
            className="rounded-full bg-[#c9a36a] px-5 py-3 text-[11px] uppercase tracking-[0.35em] text-white shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition hover:translate-y-[-2px]"
          >
            Empezar ahora
          </Link>
        </div>
      </section>
    </main>
  );
}
