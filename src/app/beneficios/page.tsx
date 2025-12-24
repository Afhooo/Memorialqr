import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "@/lib/serverSession";

export const metadata: Metadata = {
  title: "Cómo funciona | Recuerdame",
  description: "Un espacio privado para crear memoriales, guardar recuerdos y compartir el acceso con tu familia.",
};

export default async function BenefitsPage() {
  const session = await getServerSession();
  const role = session?.user?.role ?? null;
  const isAdmin = role === "admin";
  const hasSession = Boolean(session);
  const primaryHref = hasSession ? (isAdmin ? "/admin" : "/panel") : "/login?from=/elige-perfil";
  const primaryLabel = hasSession ? (isAdmin ? "Ir al panel admin" : "Ir a mi panel") : "Iniciar sesión";

  const familyFeatures = [
    {
      title: "Tu panel de memoriales",
      body: "Entra a tu panel para ver tus memoriales, continuar la edición y volver cuando lo necesites.",
      href: hasSession ? "/panel" : "/login?from=/panel",
      cta: "Abrir mi panel",
      badge: "Familia",
    },
    {
      title: "Crear el perfil del memorial",
      body: "Crea un perfil con nombre, relato, fechas, portada y avatar. Puedes guardar y seguir después.",
      href: hasSession ? "/crear-memorial" : "/login?from=/crear-memorial",
      cta: "Crear memorial",
      badge: "Familia",
    },
    {
      title: "Añadir recuerdos",
      body: "Publica recuerdos dentro del memorial (texto y multimedia) desde la vista del perfil.",
      href: hasSession ? "/memorial" : "/login?from=/memorial",
      cta: "Ver memoriales",
      badge: "Familia",
    },
    {
      title: "Acceso por QR o NFC",
      body: "Escanea un código para abrir un memorial específico desde tu sesión.",
      href: hasSession ? "/scan" : "/login?from=/scan",
      cta: "Ir a escaneo",
      badge: "Acceso",
    },
  ];

  const adminFeatures = [
    {
      title: "Panel de administración",
      body: "Accede a métricas y a la operación del servicio desde un panel separado del flujo de memoriales.",
      href: "/admin",
      cta: "Abrir panel admin",
      badge: "Equipo",
    },
    {
      title: "Gestión de usuarios",
      body: "Crea cuentas de clientes y staff, y revisa el estado operativo desde la vista de usuarios.",
      href: "/admin/usuarios",
      cta: "Ir a usuarios",
      badge: "Equipo",
    },
  ];

  const features = isAdmin ? adminFeatures : familyFeatures;

  const faq = [
    {
      q: "¿Quién puede ver un memorial?",
      a: "El acceso está protegido por sesión: la familia puede ver y editar sus memoriales. El equipo de administración se limita al panel administrativo.",
    },
    {
      q: "¿Cómo empiezo si aún no tengo memorial?",
      a: "Inicia sesión y entra a “Crear memorial”. Si ya tienes uno, lo encontrarás desde tu panel.",
    },
    {
      q: "¿Qué hago si un enlace me manda a una ruta incorrecta?",
      a: "El login respeta la ruta solicitada cuando corresponde a tu perfil. Si te redirige a otra pantalla, es porque esa ruta no coincide con tus permisos.",
    },
    {
      q: "¿Puedo usar QR/NFC desde el celular?",
      a: "Sí: en “Escaneo” puedes usar lector QR o NFC. Si el QR tiene un token, el sistema lo resuelve y abre el memorial correspondiente.",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl space-y-14 px-4 py-12 text-[#333333]">
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#1f1f1f] via-[#2a2a2a] to-[#1a1a1a] px-6 py-12 text-white shadow-[0_36px_120px_rgba(0,0,0,0.35)] sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(76,175,80,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(232,116,34,0.16),transparent_32%)]" />
        <div className="relative space-y-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-[#ff9800]">Un espacio privado</p>
          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl font-serif leading-tight text-white md:text-4xl">
              Un lugar privado para recordar
            </h1>
            <p className="text-base leading-relaxed text-white/85">
              Recuerdame es un espacio privado donde la familia puede crear el memorial, sumar recuerdos y compartir el acceso
              con quienes lo necesiten. Todo queda protegido por sesión.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.38em]">
            <Link
              href={primaryHref}
              className="rounded-full bg-[#e87422] px-6 py-3 font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.3)] transition hover:translate-y-[-2px]"
            >
              {primaryLabel}
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/25 px-5 py-3 text-white transition hover:border-[#e87422] hover:text-[#e87422]"
            >
              Volver a inicio
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-[32px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-[#e87422]">
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
          <span>{isAdmin ? "Herramientas para el equipo" : "Lo esencial para la familia"}</span>
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((item) => {
            return (
              <article
                key={item.title}
                className="rounded-3xl border border-[#e0e0e0] bg-white/90 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.06)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[#e87422]">
                    <span className="rounded-full bg-[#e87422]/10 px-3 py-1 text-[#e87422]">{item.badge}</span>
                  </div>
                  <Link
                    href={item.href}
                    className="rounded-full border border-[#e87422] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#e87422] transition hover:bg-[#e87422] hover:text-white"
                  >
                    {item.cta}
                  </Link>
                </div>
                <h3 className="mt-4 text-xl font-serif text-[#333333]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#4a4a4a]">{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      {!isAdmin && (
        <section className="space-y-5 rounded-[32px] border border-[#e0e0e0] bg-white/90 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#e87422]">
            <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
            <span>Un camino simple</span>
            <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Entra a tu panel",
                body: "Inicia sesión para ver tus memoriales o crear el primero.",
                href: primaryHref,
                cta: primaryLabel,
              },
              {
                step: "02",
                title: "Crea el perfil",
                body: "Completa los datos principales y guarda. Puedes volver después.",
                href: hasSession ? "/crear-memorial" : "/login?from=/crear-memorial",
                cta: "Crear memorial",
              },
              {
                step: "03",
                title: "Suma recuerdos",
                body: "Entra al memorial y agrega mensajes, fotos o videos cuando lo necesites.",
                href: hasSession ? "/memorial" : "/login?from=/memorial",
                cta: "Abrir memoriales",
              },
            ].map((item) => (
              <article
                key={item.step}
                className="rounded-3xl border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#0f172a]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#0f172a]">
                    {item.step}
                  </span>
                  <Link
                    href={item.href}
                    className="rounded-full border border-[#e87422] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#e87422] transition hover:bg-[#e87422] hover:text-white"
                  >
                    {item.cta}
                  </Link>
                </div>
                <h3 className="mt-4 text-lg font-serif text-[#333333]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#4a4a4a]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-5 rounded-[32px] border border-[#e0e0e0] bg-white/90 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#e87422]">
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
          <span>Privacidad y permisos</span>
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Familia (dueño del memorial)",
              body: "Puede crear memoriales, verlos y publicar recuerdos solo en sus propios espacios.",
            },
            {
              title: "Equipo (admin)",
              body: "Accede al panel administrativo. No entra a memoriales de familias.",
            },
            {
              title: "Rutas protegidas",
              body: "Si intentas abrir una ruta que no corresponde a tu perfil, el sistema te lleva al lugar correcto.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.06)]"
            >
              <h3 className="text-lg font-serif text-[#333333]">{item.title}</h3>
              <p className="mt-2 text-sm text-[#4a4a4a]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5 rounded-[32px] border border-[#e0e0e0] bg-white/90 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#e87422]">
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
          <span>Preguntas frecuentes</span>
          <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
        </div>
        <div className="space-y-3">
          {faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-3xl border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.06)]"
            >
              <summary className="cursor-pointer list-none">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-semibold text-[#0f172a]">{item.q}</p>
                  <span className="shrink-0 rounded-full bg-[#0f172a]/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#0f172a]/70 transition group-open:bg-[#e87422]/15 group-open:text-[#e87422]">
                    Ver
                  </span>
                </div>
              </summary>
              <p className="mt-3 text-sm text-[#4a4a4a]">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#e0e0e0] bg-gradient-to-r from-white via-[#f7f7f7] to-[#eef2ef] p-7 text-[#333333] shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#e87422]">Siguiente paso</p>
            <p className="text-xl font-serif text-[#333333]">
              {hasSession ? "Entra al panel y continúa cuando lo necesites." : "Inicia sesión para entrar a tu espacio."}
            </p>
          </div>
          <Link
            href={primaryHref}
            className="rounded-full bg-[#e87422] px-5 py-3 text-[11px] uppercase tracking-[0.35em] text-white shadow-[0_15px_40px_rgba(0,0,0,0.2)] transition hover:translate-y-[-2px]"
          >
            {primaryLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}
