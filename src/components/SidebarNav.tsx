"use client";

import type { MouseEvent } from "react";

type NavItem = {
  label: string;
  targetId: string;
};

interface SidebarNavProps {
  items: NavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="flex flex-col gap-2 text-sm text-[#0f172a]">
      {items.map((item) => (
        <a
          key={item.targetId}
          href={`#${item.targetId}`}
          onClick={(event) => handleClick(event, item.targetId)}
          className="group relative overflow-hidden rounded-xl border border-[#e6e8ef] bg-[#f8fafc] px-3 py-2 font-semibold transition hover:-translate-y-[1px] hover:border-[#e87422]/70 hover:bg-white"
        >
          <span className="absolute left-0 top-0 h-full w-1 bg-[#e87422] opacity-0 transition group-hover:opacity-100" />
          <span className="relative">{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
