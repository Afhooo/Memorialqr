import Image from "next/image";
import Link from "next/link";
import { HeroBackgroundVideo } from "@/components/HeroBackgroundVideo";
import { getServerSession } from "@/lib/serverSession";

const memorialHighlights = [
  {
    title: "Un espacio privado",
    body: "Un lugar donde la familia puede volver cuando lo necesite, con acceso protegido por sesión.",
  },
  {
    title: "Crear el memorial",
    body: "Completa nombre, fechas, portada y relato. Guarda y continúa después, a tu ritmo.",
  },
  {
    title: "Añadir recuerdos",
    body: "Publica recuerdos y mensajes dentro del memorial para ir construyendo su historia con el tiempo.",
  },
  {
    title: "Fotos y videos",
    body: "Puedes sumar imágenes o videos para acompañar cada recuerdo, si lo necesitas.",
  },
  {
    title: "Compartir el enlace",
    body: "Copia el enlace del memorial y compártelo con tu familia por chat o correo.",
  },
  {
    title: "Escaneo QR o NFC",
    body: "Si tienes un QR o un token, puedes escanearlo para abrir un memorial específico.",
  },
  {
    title: "Volver cuando haga falta",
    body: "El memorial queda disponible para revisar, editar y leer con calma cuando lo necesites.",
  },
];

const serviceCommitments = [
  {
    title: "Hecho para la familia",
    body: "Un flujo simple para crear el perfil, sumar recuerdos y compartir el acceso sin enredos.",
  },
  {
    title: "Privado por defecto",
    body: "El acceso está protegido por sesión: ves y editas solo tus propios memoriales.",
  },
  {
    title: "Compartir y escaneo",
    body: "Comparte por enlace y usa escaneo QR/NFC cuando tengas un código o token asociado.",
  },
];

const howItWorks = [
  {
    title: "Inicia sesión",
    body: "Entra con tu cuenta para acceder a tu espacio.",
  },
  {
    title: "Entra a tu panel",
    body: "Desde ahí puedes ver tus memoriales o crear el primero.",
  },
  {
    title: "Crea un memorial",
    body: "Completa nombre, fechas, relato y portada. Guarda y vuelve después si lo necesitas.",
  },
  {
    title: "Abre el perfil",
    body: "Entra al memorial para revisar el contenido y navegar los recuerdos publicados.",
  },
  {
    title: "Publica recuerdos",
    body: "Añade mensajes y recuerdos dentro del memorial para ir construyendo la historia con el tiempo.",
  },
  {
    title: "Comparte o escanea",
    body: "Copia el enlace para compartir, o usa escaneo QR/NFC cuando tengas un código asociado.",
  },
];

const differentiators = [
  {
    title: "Un camino simple",
    body: "Panel → memorial → recuerdos: un flujo claro para lo esencial.",
  },
  {
    title: "Privado por sesión",
    body: "El acceso está protegido: solo ves y editas tus propios memoriales.",
  },
  {
    title: "Para volver cuando lo necesites",
    body: "Un espacio pensado para leerse con calma, hoy o más adelante.",
  },
  {
    title: "Compartir en segundos",
    body: "Copia el enlace del memorial y compártelo con tu familia fácilmente.",
  },
  {
    title: "Acceso por escaneo",
    body: "Escanea un QR o usa NFC cuando tengas un código o token asociado.",
  },
  {
    title: "Sin anuncios",
    body: "Un espacio limpio, sin banners ni trackers publicitarios metidos en el memorial.",
  },
];

const highlightTags = ["Privado", "Perfil", "Recuerdos", "Multimedia", "Acceso", "Compartir", "Escaneo", "Volver"];

const homeHeroVideos = ["/m1.mp4", "/m2.mp4", "/a1.mp4"];

export default async function HomePage() {
  const session = await getServerSession();
  const role = session?.user?.role ?? null;
  const isAdmin = role === "admin";
  const hasSession = Boolean(session);
  const primaryHref = hasSession ? (isAdmin ? "/admin" : "/panel") : "/login?from=/elige-perfil";
  const primaryLabel = hasSession ? (isAdmin ? "Volver al panel admin" : "Ir a mi panel") : "Crear memorial";
  const secondaryHref = hasSession ? (isAdmin ? "/" : "/memorial") : "/login?from=/panel";
  const secondaryLabel = hasSession ? (isAdmin ? "Seguir en inicio" : "Ver mis memoriales") : "Ver mis memoriales";

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
              Un espacio privado donde la familia puede crear el memorial, sumar recuerdos y compartir el acceso con quienes lo
              necesiten. Para volver cuando haga falta, con calma.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.4em]">
            <Link
              href={primaryHref}
              className="rounded-full bg-[#e87422] px-6 py-3 font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition hover:translate-y-[-2px]"
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="rounded-full border border-white/25 px-6 py-3 text-white transition hover:border-[#e87422] hover:text-[#e87422]"
            >
              {secondaryLabel}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#ff9800]">Privado</p>
              <p className="mt-2 text-xl font-serif text-white">Por sesión</p>
              <p className="text-sm text-white/80">Acceso protegido</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#ff9800]">Recuerdos</p>
              <p className="mt-2 text-xl font-serif text-white">En un lugar</p>
              <p className="text-sm text-white/80">Texto y multimedia</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#ff9800]">Un solo enlace</p>
              <p className="mt-2 text-xl font-serif text-white">Para la familia</p>
              <p className="text-sm text-white/80">Copia y comparte el memorial</p>
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
                Un perfil que se mantiene disponible para volver cuando la familia lo necesite: editar, leer y sumar recuerdos.
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
                El memorial se recorre como un solo hilo: perfil, recuerdos y acceso rápido para compartir. Entra desde el panel,
                abre el memorial y publica en el mismo lugar.
              </p>
              <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.32em] text-[#e87422]">
                <span className="rounded-full bg-[#e87422]/12 px-3 py-1">Perfil</span>
                <span className="rounded-full bg-[#4caf50]/12 px-3 py-1 text-[#2e7d32]">Recuerdos</span>
                <span className="rounded-full bg-[#e87422]/12 px-3 py-1">Compartir</span>
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
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#e87422]">Cómo funciona</p>
            <p className="text-xl font-serif text-[#333333]">Una vista simple del flujo y la privacidad del memorial.</p>
          </div>
          <Link
            href="/beneficios"
            className="rounded-full bg-[#e87422] px-5 py-3 text-[11px] uppercase tracking-[0.35em] text-white shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition hover:translate-y-[-2px]"
          >
            Ver cómo funciona
          </Link>
        </div>
      </section>

      <section className="animate-fade-rise -mx-4 px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="mx-auto max-w-[1400px] space-y-3 px-2 sm:px-0">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.45em] text-[#e87422]">Pasos guiados</p>
              <h2 className="text-2xl font-serif text-[#333333]">Cómo funciona Recuerdame</h2>
              <p className="max-w-3xl text-sm text-[#4a4a4a] sm:text-base">
                Una línea editorial que avanza paso a paso. No son tarjetas: es un carril donde ves de un vistazo qué sigue.
              </p>
            </div>
            <Link
              href={hasSession ? primaryHref : "/login"}
              className="text-[11px] uppercase tracking-[0.35em] text-[#e87422] underline"
            >
              {hasSession ? primaryLabel : "Empezar ahora"}
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
            <h2 className="text-3xl font-serif text-[#333333]">
              {hasSession ? (isAdmin ? "Acceso administrativo" : "Tus memoriales activos") : "Tus memoriales activos"}
            </h2>
          </div>
          <Link
            href={primaryHref}
            className="rounded-full border border-[#e87422] px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-[#e87422]"
          >
            {primaryLabel}
          </Link>
        </div>
        <div className="rounded-3xl border border-dashed border-[#d5d5d5] bg-white/85 px-5 py-6 text-[#4a4a4a]">
          {hasSession
            ? isAdmin
              ? "Estás con acceso administrativo. Usa el panel admin para gestión y métricas."
              : "Entra al panel para ver o editar los memoriales que has creado."
            : "Este espacio es privado. Inicia sesión para ver o editar los memoriales que has creado."}
        </div>
      </section>
    </main>
  );
}
