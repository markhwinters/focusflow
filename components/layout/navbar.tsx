"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Focus, Coffee, BarChart3, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";

const routes = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/focus", label: "Focus", icon: Focus },
  { href: "/dashboard/break", label: "Break", icon: Coffee },
  { href: "/dashboard/history", label: "History", icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-white dark:bg-gray-900 dark:border-gray-800 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <MobileNav />
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-gray-50"
            >
              <Focus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>FocusFlow</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === route.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  <span>{route.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}
