"use client";

type NavItem = {
  label: string;
  targetId: string;
};

interface SidebarNavProps {
  items: NavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="flex flex-col gap-2 text-sm text-[#4a4a4a]">
      {items.map((item) => (
        <a
          key={item.targetId}
          href={`#${item.targetId}`}
          onClick={(event) => handleClick(event, item.targetId)}
          className="rounded-lg px-3 py-2 transition hover:bg-[#f6f6f6]"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
