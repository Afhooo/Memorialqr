"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function logoutClient(router: AppRouterInstance, redirectTo = "/login") {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    await fetch("/api/session", { method: "DELETE", cache: "no-store", signal: controller.signal });
  } catch {
    // Siempre intentamos redirigir aunque el request falle o quede colgado.
  } finally {
    clearTimeout(timeout);
  }

  try {
    router.replace(redirectTo);
    router.refresh();
  } catch {
    window.location.assign(redirectTo);
  }
}

