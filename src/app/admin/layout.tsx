import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/serverSession";
import { AdminSidebar } from "./AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?from=/admin");
  }
  if (session.user.role !== "admin") {
    redirect("/elige-perfil?denied=admin&from=/admin");
  }

  return (
    <div className="mx-auto w-full max-w-[1680px] min-w-0 py-6">
      <div className="flex min-w-0 gap-6">
        <AdminSidebar userEmail={session.user.email} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

