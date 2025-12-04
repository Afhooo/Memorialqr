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
    <main className="mx-auto max-w-6xl space-y-14 px-4 py-12 text-[#333333]">
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#1f1f1f] via-[#2a2a2a] to-[#1a1a1a] px-6 py-12 text-white shadow-[0_36px_120px_rgba(0,0,0,0.35)] sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(76,175,80,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(232,116,34,0.16),transparent_32%)]" />
        <div className="relative space-y-6">
          <p className="text-[11px] uppercase tracking-[0.42em] text-[#ff9800]">Beneficios</p>
          <div className="space-y-3 max-w-3xl">
            <h1 className="text-4xl font-serif leading-tight text-white md:text-5xl">Un memorial cuidado, pensado para acompañar</h1>
            <p className="text-lg leading-relaxed text-white/85">
              Creamos un espacio sereno para avisar, compartir recuerdos y volver cuando duela. Sin anuncios, con moderación y con
              gestos simbólicos que mantienen viva la presencia de quien amas.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.38em]">
            <Link
              href="/"
              className="rounded-full border border-white/25 px-5 py-3 text-white transition hover:border-[#e87422] hover:text-[#e87422]"
            >
              Volver a inicio
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-[#e87422] px-6 py-3 font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.3)] transition hover:translate-y-[-2px]"
            >
              Crear un memorial
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-[32px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#e87422]">
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
          <span>Beneficios clave</span>
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {benefits.map((item, index) => (
            <article
              key={item.title}
              className="rounded-3xl border border-[#e0e0e0] bg-white/90 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.06)]"
              style={{ animationDelay: `${0.04 * index}s` }}
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[#e87422]">
                <span className="rounded-full bg-[#e87422]/10 px-3 py-1 text-[#e87422]">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-[#4caf50]">Para la familia</span>
              </div>
              <h3 className="mt-3 text-xl font-serif text-[#333333]">{item.title}</h3>
              <p className="mt-2 text-[#4a4a4a]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5 rounded-[32px] border border-[#e0e0e0] bg-white/90 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#e87422]">
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
          <span>Cómo cambia la experiencia</span>
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {comparison.map((item, index) => (
            <article
              key={item.aspect}
              className="rounded-3xl border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.06)]"
              style={{ animationDelay: `${0.03 * index}s` }}
            >
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.32em] text-[#e87422]">
                <span>{item.aspect}</span>
                <span className="h-px w-8 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
              </div>
              <div className="mt-3 space-y-3 text-sm text-[#4a4a4a]">
                <div className="rounded-2xl bg-white/80 p-3">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Antes</p>
                  <p>{item.before}</p>
                </div>
                <div className="rounded-2xl bg-white/80 p-3">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">En un memorial digital</p>
                  <p>{item.now}</p>
                </div>
                <div className="rounded-2xl bg-[#4caf50]/10 p-3">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#2e7d32]">Lo que gana la familia</p>
                  <p>{item.gain}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#e0e0e0] bg-gradient-to-r from-white via-[#f7f7f7] to-[#eef2ef] p-7 text-[#333333] shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#e87422]">Listo para compartir</p>
            <p className="text-xl font-serif text-[#333333]">Crea el memorial y avisa a quienes no pudieron estar.</p>
          </div>
          <Link
            href="/login"
            className="rounded-full bg-[#e87422] px-5 py-3 text-[11px] uppercase tracking-[0.35em] text-white shadow-[0_15px_40px_rgba(0,0,0,0.2)] transition hover:translate-y-[-2px]"
          >
            Empezar ahora
          </Link>
        </div>
      </section>
    </main>
  );
}
