import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";
import { HeroBackgroundVideo } from "@/components/HeroBackgroundVideo";
import { CreateDemoMemorialButton } from "@/components/CreateDemoMemorialButton";
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
      .select("id, name, birth_date, death_date, description, owner_id")
      .eq("owner_id", session.user.id)
      .order("name", { ascending: true });

    if (!error && memorials) {
      memorialList = memorials;
    }
  }

  const nerudaMemorial = memorialList.find(
    (memorial) => memorial.name?.trim().toLowerCase() === "pablo neruda",
  );
  const nerudaHref = nerudaMemorial ? `/memorial/${nerudaMemorial.id}` : "/memorial/pablo-neruda";

  return (
    <main className="relative mx-auto max-w-6xl space-y-16 px-4 pb-14 text-[#333333]" id="principal">
      <section className="relative isolate -mx-[calc((100vw-100%)/2)] w-screen overflow-hidden bg-gradient-to-br from-[#1f1f1f] via-[#2a2a2a] to-[#1a1a1a] px-6 py-14 text-white sm:px-10">
        <HeroBackgroundVideo sources={homeHeroVideos} roundedClass="" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(76,175,80,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(232,116,34,0.16),transparent_35%)]" />
        <div className="relative z-10 mx-auto max-w-6xl space-y-8">
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-white/70">
            <span className="rounded-full border border-white/25 px-4 py-1">Círculo íntimo</span>
            <span className="h-px w-10 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            <span className="text-[#ff9800]">Acompañar a distancia</span>
            <span className="h-px w-10 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            <span className="rounded-full border border-white/10 px-4 py-1">Sin anuncios</span>
          </div>
          <div className="space-y-4 lg:max-w-4xl">
            <h1 className="text-3xl font-serif leading-tight text-white md:text-4xl lg:text-5xl">
              Un memorial vivo para seguir cerca de quien amas
            </h1>
            <p className="text-base leading-relaxed text-white/85">
              Reúne sus fotos, cartas y su historia en un espacio sereno. Sin prisa, sin publicidad, con moderación
              cuidada para que cada palabra acompañe. Comparte con quienes no pudieron estar y regresen cuando necesiten.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.4em]">
            {session ? (
              <CreateDemoMemorialButton />
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-[#e87422] px-6 py-3 font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition hover:translate-y-[-2px]"
              >
                Crear memorial
              </Link>
            )}
            <Link
              href="#inventario"
              className="rounded-full border border-white/25 px-6 py-3 text-white transition hover:border-[#e87422] hover:text-[#e87422]"
            >
              Ver mis memoriales
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#ff9800]">Presencias activas</p>
              <p className="mt-2 text-2xl font-serif text-white">{session ? memorialList.length : "—"}</p>
              <p className="text-sm text-white/80">
                {session ? "Memoriales vivos que puedes abrir cuando quieras" : "Inicia sesión para ver los tuyos"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#ff9800]">30 días sin coste</p>
              <p className="mt-2 text-xl font-serif text-white">Sin tarjeta</p>
              <p className="text-sm text-white/80">Empieza ahora, edita con calma y decide después</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#ff9800]">Un solo enlace</p>
              <p className="mt-2 text-xl font-serif text-white">Para la familia</p>
              <p className="text-sm text-white/80">Los que están lejos también pueden dejar su cariño</p>
            </div>
          </div>
        </div>
      </section>

      <section id="crear" className="animate-fade-rise space-y-7">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#e87422]">
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
          <span>¿Qué incluye un memorial?</span>
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
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
              <p className="text-lg font-serif leading-snug">
                Un memorial vivo con fotos, notas de voz y cartas moderadas para que la familia regrese cuando necesite
                sentirse cerca.
              </p>
            </div>
          </div>

          <div className="space-y-4 border-l border-[#e0e0e0] pl-6">
            {serviceCommitments.map((item, index) => (
              <div key={item.title} className="group space-y-1 transition" style={{ animationDelay: `${0.05 * index}s` }}>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-[#e87422]">
                  <span className="h-[2px] w-8 bg-gradient-to-r from-[#e87422] via-[#e0e0e0] to-transparent" />
                  <span>Incluye</span>
                </div>
                <h3 className="text-lg font-serif text-[#333333] group-hover:text-[#e87422]">{item.title}</h3>
                <p className="text-[#4a4a4a]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="animate-fade-rise space-y-6">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#e87422]">
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
          <span>Componentes vivos</span>
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
        </div>
        <div className="relative overflow-hidden rounded-[32px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.05)]">
          <div className="pointer-events-none absolute left-[-10%] top-[-20%] h-64 w-64 rounded-full bg-[#4caf50]/14 blur-[130px]" />
          <div className="pointer-events-none absolute right-[-5%] bottom-[-10%] h-56 w-56 rounded-full bg-[#e87422]/16 blur-[130px]" />
          <div className="relative grid gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.38em] text-[#2e7d32]">Del altar al QR</p>
              <h3 className="text-3xl font-serif text-[#333333]">Un relato continuo, no una colección de tarjetas</h3>
              <p className="text-[#4a4a4a]">
                Las partes del memorial se leen como una línea de vida: obituario, condolencias moderadas, recuerdos multimedia
                y los símbolos que siguen encendidos. Explora el flujo de izquierda a derecha o baja por la línea.
              </p>
              <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.32em] text-[#e87422]">
                <span className="rounded-full bg-[#e87422]/12 px-3 py-1">Obituario</span>
                <span className="rounded-full bg-[#4caf50]/12 px-3 py-1 text-[#2e7d32]">Condolencias curadas</span>
                <span className="rounded-full bg-[#e87422]/12 px-3 py-1">Velas digitales</span>
              </div>
            </div>
            <ol className="relative space-y-6 border-l border-[#d8d8d8] pl-6">
              <div className="absolute left-[-11px] top-1 h-[calc(100%-4px)] w-[2px] bg-gradient-to-b from-[#e87422] via-[#ff9800] to-transparent" />
              {memorialHighlights.map((item, index) => (
                <li key={item.title} className="relative pl-6" style={{ animationDelay: `${0.04 * index}s` }}>
                  <span className="absolute left-[-13px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-white bg-[#e87422] text-[10px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[#2e7d32]">
                    <span className="rounded-full bg-[#4caf50]/14 px-3 py-1 text-[#2e7d32]">
                      {highlightTags[index % highlightTags.length]}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#e0e0e0] to-transparent" />
                  </div>
                  <h4 className="mt-2 text-xl font-serif text-[#333333]">{item.title}</h4>
                  <p className="text-[#4a4a4a]">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="animate-fade-rise rounded-[28px] border border-[#e0e0e0] bg-gradient-to-r from-white via-[#f7f7f7] to-[#eef2ef] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#e87422]">Detalles y comparativa</p>
            <p className="text-xl font-serif text-[#333333]">Ver todos los beneficios y cómo se diferencia un memorial digital.</p>
          </div>
          <Link
            href="/beneficios"
            className="rounded-full bg-[#e87422] px-5 py-3 text-[11px] uppercase tracking-[0.35em] text-white shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition hover:translate-y-[-2px]"
          >
            Abrir detalles
          </Link>
        </div>
      </section>

      <section className="animate-fade-rise -mx-4 px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="mx-auto max-w-[1400px] space-y-3 px-2 sm:px-0">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.45em] text-[#e87422]">Pasos guiados</p>
              <h2 className="text-2xl font-serif text-[#333333]">Cómo funciona Memento</h2>
              <p className="max-w-3xl text-sm text-[#4a4a4a] sm:text-base">
                Una línea editorial que avanza paso a paso. No son tarjetas: es un carril donde ves de un vistazo qué sigue.
              </p>
            </div>
            <Link href="/login" className="text-[11px] uppercase tracking-[0.35em] text-[#e87422] underline">
              Empezar ahora
            </Link>
          </div>
          <div className="relative overflow-x-auto pb-4">
            <div className="absolute left-2 right-2 top-9 hidden h-[1px] bg-gradient-to-r from-[#e87422] via-[#ff9800] to-[#4caf50] xl:block" />
            <ol className="flex flex-wrap gap-3 pr-4 xl:pr-0">
              {howItWorks.map((step, index) => (
                <li
                  key={step.title}
                  className="relative min-w-[180px] max-w-[220px] flex-1 rounded-2xl border border-[#e0e0e0] bg-white p-4 shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-[#e87422]">
                    <span>Paso {index + 1}</span>
                    <span className="h-7 w-7 rounded-full border border-[#e87422] bg-white text-center leading-7 text-[#e87422] shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-2 text-lg font-serif text-[#333333]">{step.title}</p>
                  <p className="text-sm text-[#4a4a4a] sm:text-base">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="animate-fade-rise space-y-5 rounded-[32px] border border-[#e0e0e0] bg-white/85 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#e87422]">
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
          <span>Detalles que nos diferencian</span>
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
        </div>
        <div className="space-y-3">
          {differentiators.map((item, index) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-[#e0e0e0] bg-gradient-to-r from-white via-[#f7f7f7] to-[#eef2ef] px-5 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
              style={{ animationDelay: `${0.03 * index}s` }}
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#e87422] via-[#ff9800] to-[#4caf50]" />
              <div className="flex items-start gap-3">
                <div className="mt-1 h-8 w-8 rounded-full bg-[#e87422]/15 text-center text-[11px] font-semibold uppercase leading-8 text-[#e87422]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-serif text-[#333333]">{item.title}</h3>
                  <p className="text-[#4a4a4a]">{item.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="inventario"
        className="animate-fade-rise space-y-6 rounded-[32px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#e87422]">Inventario</p>
            <h2 className="text-3xl font-serif text-[#333333]">Tus memoriales activos</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {session ? (
              <>
                <CreateDemoMemorialButton label="Crear memorial nuevo" variant="outline" />
                <Link
                  href={nerudaHref}
                  className="rounded-full border border-[#333333]/15 bg-white/80 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-[#333333] shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition hover:border-[#e87422] hover:text-[#e87422]"
                >
                  Abrir Pablo Neruda
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-[#e87422] px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-[#e87422]"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
        {session ? (
          memorialList.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#d5d5d5] bg-white/85 px-5 py-6 text-[#4a4a4a]">
              No hay memoriales conectados todavía. Crea uno y aparecerá aquí listo para compartir o editar.
            </div>
          ) : (
            <div className="space-y-3">
              {memorialList.map((memorial) => (
                <article
                  key={memorial.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e0e0e0] bg-white/95 px-4 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                >
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#e87422]">
                      {formatDate(memorial.birth_date)} — {formatDate(memorial.death_date)}
                    </p>
                    <h3 className="text-xl font-serif text-[#333333]">{memorial.name}</h3>
                    <p className="text-sm text-[#4a4a4a] line-clamp-2">
                      {memorial.description || "Memorial listo para compartir y seguir editando."}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-[#555555]">
                    <Link href={`/memorial/${memorial.id}`} className="rounded-full border border-[#e87422] px-3 py-1 text-[11px] uppercase tracking-[0.32em] text-[#e87422]">
                      Abrir
                    </Link>
                    <span className="rounded-full bg-[#e87422]/10 px-3 py-1 text-[11px] uppercase tracking-[0.32em] text-[#e87422]">
                      Activo
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : (
          <div className="rounded-3xl border border-dashed border-[#d5d5d5] bg-white/85 px-5 py-6 text-[#4a4a4a]">
            Este espacio es privado. Inicia sesión para ver o editar los memoriales que has creado.
          </div>
        )}
      </section>
    </main>
  );
}
