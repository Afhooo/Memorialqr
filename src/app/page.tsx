import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";
import { HeroBackgroundVideo } from "@/components/HeroBackgroundVideo";
import type { Memorial } from "@/lib/types";

const memorialHighlights = [
  {
    title: "Esquela digital lista para avisar",
    body: "Publica la noticia del fallecimiento con horarios y ubicación completos, sin limitarte al espacio de un periódico.",
  },
  {
    title: "Obituario que explica quién fue",
    body: "Relata la vida con contexto, logros y anécdotas que se leen como un perfil editorial profundo.",
  },
  {
    title: "Libro de condolencias cuidado",
    body: "Cada mensaje se revisa antes de mostrarse para mantener la serenidad y el tono empático del homenaje.",
  },
  {
    title: "Fotografías y videos que reviven momentos",
    body: "Sube imágenes, clips y audios para acompañar el duelo de quienes no pueden estar presentes.",
  },
  {
    title: "Línea de vida con hitos",
    body: "Organiza fechas, lugares y comentarios en una sola columna clara que muestra cada capítulo con calma.",
  },
  {
    title: "Detalles virtuales que acompañan",
    body: "Activa flores, velas o una paloma ascendente; las Flaming Candles de Memento permanecen encendidas treinta días.",
  },
  {
    title: "Comparte con un enlace",
    body: "Envía el memorial por mensaje, correo o redes sociales y todos llegarán al mismo espacio íntimo.",
  },
  {
    title: "Código QR para el lugar de descanso",
    body: "Descarga un QR listo para imprimir o grabar en una placa, la urna o la lápida, y conecta el mundo físico con el digital.",
  },
];

const serviceCommitments = [
  {
    title: "Memorial digital gratuito durante 30 días",
    body: "Memento crea un espacio activo y accesible sin coste ni compromiso inicial; no necesitas tarjeta para comenzar.",
  },
  {
    title: "Módulo de esquela sin coste",
    body: "Informa y convoca a la familia con un texto amplio que incluye horarios, ubicación y deseos especiales.",
  },
  {
    title: "Obituario digital gratuito",
    body: "Redacta un obituario significativo que se comparte en línea para avisar a amistades sin importar dónde estén.",
  },
  {
    title: "Libro de condolencias y mensajes",
    body: "Administra cada mensaje recibido y conserva el archivo completo para volver a leerlo cuando lo necesites.",
  },
];

const howItWorks = [
  {
    title: "Completa el memorial en minutos",
    body: "Un asistente editorial te guía paso a paso para llenar el perfil del ser querido; puedes editar todo en cualquier momento.",
  },
  {
    title: "Personaliza cada capítulo",
    body: "Añade el texto principal, sube fotografías, videos y crea una línea de vida visual con los hitos más significativos.",
  },
  {
    title: "Comparte el enlace",
    body: "El memorial funciona como una esquela moderna sin coste; envías el enlace por mensajería, correo o redes.",
  },
  {
    title: "Recibe condolencias",
    body: "Familiares y amistades dejan mensajes. Tú decides cuáles se muestran públicamente y cuáles permanecen privados.",
  },
  {
    title: "Conserva recuerdos y QR",
    body: "Genera un código QR descargable para colocar en la urna, la lápida o un objeto significativo y mantén vivo el acceso.",
  },
  {
    title: "Activa recordatorios",
    body: "Programa alertas para cada aniversario del fallecimiento y reúne a todos nuevamente en la fecha que importa.",
  },
  {
    title: "Enciende su memoria con un detalle",
    body: "Cualquier visitante puede dejar flores virtuales, una vela ardiente o un símbolo espiritual durante treinta días.",
  },
];

const differentiators = [
  {
    title: "Facilidad de uso",
    body: "La interfaz lineal de Memento evita menús saturados y mantiene cada paso claro.",
  },
  {
    title: "Interacción viva",
    body: "Activa velas, flores o símbolos animados para que cada gesto permanezca treinta días y pueda reactivarse.",
  },
  {
    title: "Alternativa moderna",
    body: "Sustituye la esquela u obituario tradicional y funciona como velatorio digital accesible.",
  },
  {
    title: "Foto animación opcional",
    body: "Añade movimiento realista a la fotografía del homenajeado para crear un recuerdo vivo.",
  },
  {
    title: "Acceso 24/7",
    body: "Visita el memorial en cualquier momento y desde cualquier lugar.",
  },
  {
    title: "Asequible",
    body: "Honrar su memoria no debería implicar otro gasto; mantenemos una opción gratuita y flexible.",
  },
];

const highlightTags = ["Esencial", "Perfil", "Cuidado", "Memoria", "Hitos", "Detalle", "Acceso", "Presencia"];

const homeHeroVideos = ["/m1.mp4", "/m2.mp4", "/a1.mp4"];

const formatDate = (value: string | null) => {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default async function HomePage() {
  const session = await getServerSession();
  let memorialList: Memorial[] = [];

  if (session) {
    const supabase = createSupabaseServerClient();
    const { data: memorials, error } = await supabase
      .from("memorials")
      .select("id, name, birth_date, death_date, description")
      .eq("owner_id", session.user.id)
      .order("name", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    memorialList = memorials ?? [];
  }

  return (
    <main className="relative mx-auto max-w-6xl space-y-16 px-4 pb-14 text-[#2f261f]" id="principal">
      <section className="relative isolate -mx-[calc((100vw-100%)/2)] w-screen overflow-hidden bg-gradient-to-br from-[#0f0c0a] via-[#171018] to-[#1f1711] px-6 py-14 text-[#f7efe2] sm:px-10">
        <HeroBackgroundVideo sources={homeHeroVideos} roundedClass="" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,225,180,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.07),transparent_30%)]" />
        <div className="relative z-10 mx-auto max-w-6xl space-y-8">
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#f0d7b2]/80">
            <span className="rounded-full border border-[#f0d7b2]/40 px-4 py-1">Círculo íntimo</span>
            <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#f0d7b2] to-transparent" />
            <span className="text-[#e3c89e]">Acompañar a distancia</span>
            <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#f0d7b2] to-transparent" />
            <span className="rounded-full border border-white/10 px-4 py-1">Sin anuncios</span>
          </div>
          <div className="space-y-4 lg:max-w-4xl">
            <h1 className="text-4xl font-serif leading-tight text-[#f8efe0] md:text-5xl lg:text-6xl">
              Un memorial vivo para seguir cerca de quien amas
            </h1>
            <p className="text-lg leading-relaxed text-[#eadbc7]">
              Reúne sus fotos, cartas y su historia en un espacio sereno. Sin prisa, sin publicidad, con moderación
              cuidada para que cada palabra acompañe. Comparte con quienes no pudieron estar y regresen cuando necesiten.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.4em]">
            <Link
              href="/login"
              className="rounded-full bg-[#f0d7b2] px-6 py-3 font-semibold text-[#2f261f] shadow-[0_18px_40px_rgba(0,0,0,0.25)] transition hover:translate-y-[-2px]"
            >
              Crear memorial
            </Link>
            <Link
              href="#inventario"
              className="rounded-full border border-[#f0d7b2]/60 px-6 py-3 text-[#f7efe2] transition hover:bg-white/10"
            >
              Ver mis memoriales
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#f0d7b2]/35 bg-black/35 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#e3c89e]">Presencias activas</p>
              <p className="mt-2 text-3xl font-serif text-[#f8efe0]">{session ? memorialList.length : "—"}</p>
              <p className="text-sm text-[#eadbc7]">
                {session ? "Memoriales vivos que puedes abrir cuando quieras" : "Inicia sesión para ver los tuyos"}
              </p>
            </div>
            <div className="rounded-2xl border border-[#f0d7b2]/35 bg-black/35 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#e3c89e]">30 días sin coste</p>
              <p className="mt-2 text-2xl font-serif text-[#f8efe0]">Sin tarjeta</p>
              <p className="text-sm text-[#eadbc7]">Empieza ahora, edita con calma y decide después</p>
            </div>
            <div className="rounded-2xl border border-[#f0d7b2]/35 bg-black/35 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#e3c89e]">Un solo enlace</p>
              <p className="mt-2 text-2xl font-serif text-[#f8efe0]">Para la familia</p>
              <p className="text-sm text-[#eadbc7]">Los que están lejos también pueden dejar su cariño</p>
            </div>
          </div>
        </div>
      </section>

      <section id="crear" className="animate-fade-rise space-y-8">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#a07c55]">
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
          <span>¿Qué incluye un memorial?</span>
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
        </div>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[32px]">
            <Image
              src="/llama.png"
              alt="Llama encendida como símbolo de memoria"
              width={1100}
              height={720}
              className="h-full w-full object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/55 via-black/35 to-transparent" />
            <div className="absolute bottom-6 left-6 max-w-md space-y-2 text-white drop-shadow-lg">
              <p className="text-[11px] uppercase tracking-[0.38em] text-white/80">Mantener la llama encendida</p>
              <p className="text-2xl font-serif leading-snug">
                Un memorial vivo con fotos, notas de voz y cartas moderadas para que la familia regrese cuando necesite
                sentirse cerca.
              </p>
            </div>
          </div>

          <div className="space-y-4 border-l border-[#e3d2b9] pl-6">
            {serviceCommitments.map((item, index) => (
              <div key={item.title} className="group space-y-1 transition" style={{ animationDelay: `${0.05 * index}s` }}>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-[#a07c55]">
                  <span className="h-[2px] w-8 bg-gradient-to-r from-[#c9a36a] via-[#e3d2b9] to-transparent" />
                  <span>Incluye</span>
                </div>
                <h3 className="text-xl font-serif text-[#2b2018] group-hover:text-[#6b4a2f]">{item.title}</h3>
                <p className="text-[#3a2d22]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="animate-fade-rise space-y-6">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#a07c55]">
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
          <span>Componentes vivos</span>
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
        </div>
        <div className="relative overflow-hidden rounded-[32px] border border-[#e3d2b9]/60 bg-gradient-to-br from-white via-[#fbf5ed] to-[#f3e6d4]/70 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.05)]">
          <div className="pointer-events-none absolute left-[-10%] top-[-20%] h-64 w-64 rounded-full bg-[#c9a36a]/20 blur-[120px]" />
          <div className="pointer-events-none absolute right-[-5%] bottom-[-10%] h-56 w-56 rounded-full bg-[#f0d7b2]/25 blur-[120px]" />
          <div className="relative grid gap-8 lg:grid-cols-2">
            {memorialHighlights.map((item, index) => (
              <div
                key={item.title}
                className="relative flex gap-4 border-b border-[#e8dac5] pb-6 last:border-none"
                style={{ animationDelay: `${0.04 * index}s` }}
              >
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c9a36a] to-[#8a6a4a] text-[11px] font-semibold text-white shadow-[0_12px_35px_rgba(0,0,0,0.15)]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[#a07c55]">
                    <span className="rounded-full bg-[#c9a36a]/15 px-3 py-1">{highlightTags[index % highlightTags.length]}</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-[#c9a36a] via-[#e3d2b9] to-transparent" />
                  </div>
                  <h3 className="text-xl font-serif text-[#2b2018]">{item.title}</h3>
                  <p className="text-[#3a2d22]">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="animate-fade-rise rounded-[28px] border border-[#e3d2b9]/80 bg-gradient-to-r from-white via-[#fbf5ed] to-[#f6ead8] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#a07c55]">Detalles y comparativa</p>
            <p className="text-xl font-serif text-[#2b2018]">Ver todos los beneficios y cómo se diferencia un memorial digital.</p>
          </div>
          <Link
            href="/beneficios"
            className="rounded-full bg-[#c9a36a] px-5 py-3 text-[11px] uppercase tracking-[0.35em] text-white shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition hover:translate-y-[-2px]"
          >
            Abrir detalles
          </Link>
        </div>
      </section>

      <section className="animate-fade-rise space-y-6 rounded-[32px] border border-[#e3d2b9] bg-gradient-to-br from-white via-[#fbf5ed] to-[#f3e6d4] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#a07c55]">Pasos guiados</p>
            <h2 className="text-3xl font-serif text-[#2b2018]">Cómo funciona Memento</h2>
            <p className="max-w-3xl text-[#3a2d22]">
              Un flujo lineal que te acompaña desde la esquela hasta el QR. Puedes editar todo en cualquier momento.
            </p>
          </div>
          <Link href="/login" className="text-[11px] uppercase tracking-[0.35em] text-[#7b5b3d] underline">
            Empezar ahora
          </Link>
        </div>
        <ol className="grid gap-4 md:grid-cols-2">
          {howItWorks.map((step, index) => (
            <li
              key={step.title}
              className="rounded-3xl border border-[#eadfcd] bg-white/80 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.06)]"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-[#a07c55]">
                <span>Paso {index + 1}</span>
                <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
              </div>
              <p className="mt-2 text-xl font-serif text-[#2b2018]">{step.title}</p>
              <p className="text-[#3a2d22]">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="animate-fade-rise space-y-5 rounded-[32px] border border-[#e3d2b9] bg-white/80 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#a07c55]">
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
          <span>Detalles que nos diferencian</span>
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((item, index) => (
            <article
              key={item.title}
              className="rounded-3xl border border-[#eadfcd] bg-gradient-to-br from-white via-[#faf2e7] to-[#f0e0c8] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)]"
              style={{ animationDelay: `${0.04 * index}s` }}
            >
              <h3 className="text-lg font-serif text-[#2b2018]">{item.title}</h3>
              <p className="mt-2 text-[#3a2d22]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="inventario"
        className="animate-fade-rise space-y-6 rounded-[32px] border border-[#e3d2b9] bg-gradient-to-br from-white via-[#fbf5ed] to-[#f3e6d4] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#a07c55]">Inventario</p>
            <h2 className="text-3xl font-serif text-[#2b2018]">Tus memoriales activos</h2>
          </div>
          <Link
            href="/login"
            className="rounded-full border border-[#c9a36a]/60 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-[#7b5b3d]"
          >
            {session ? "Crear otro memorial" : "Iniciar sesión"}
          </Link>
        </div>
        {session ? (
          memorialList.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#d8c6a4] bg-white/80 px-5 py-6 text-[#3a2d22]">
              No hay memoriales conectados todavía. Crea uno y aparecerá aquí listo para compartir o editar.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {memorialList.map((memorial) => (
                <article
                  key={memorial.id}
                  className="rounded-3xl border border-[#eadfcd] bg-white/90 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.06)]"
                >
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#a07c55]">
                    {formatDate(memorial.birth_date)} — {formatDate(memorial.death_date)}
                  </p>
                  <h3 className="mt-2 text-xl font-serif text-[#2b2018]">{memorial.name}</h3>
                  <p className="mt-1 text-sm text-[#3a2d22] line-clamp-2">
                    {memorial.description || "Memorial listo para compartir y seguir editando."}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm text-[#7b5b3d]">
                    <Link href={`/memorial/${memorial.id}`} className="font-semibold underline">
                      Abrir memorial
                    </Link>
                    <span className="rounded-full bg-[#f0e0c8] px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-[#5e4430]">
                      Activo
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : (
          <div className="rounded-3xl border border-dashed border-[#d8c6a4] bg-white/80 px-5 py-6 text-[#3a2d22]">
            Este espacio es privado. Inicia sesión para ver o editar los memoriales que has creado.
          </div>
        )}
      </section>
    </main>
  );
}
