"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Focus, Coffee, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/focus", label: "Focus", icon: Focus },
  { href: "/dashboard/break", label: "Break", icon: Coffee },
  { href: "/dashboard/history", label: "History", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 border-r bg-card">
      <div className="flex flex-col w-full p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">FocusFlow</h1>
        </div>
        <nav className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                pathname === route.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              <route.icon className="h-5 w-5" />
              <span>{route.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
