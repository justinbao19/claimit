"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  FilePlus2,
  FileUser,
  FolderKanban,
  LayoutDashboard,
  Palette,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/import", label: "Import", icon: FilePlus2 },
  { href: "/memory", label: "Memory", icon: FolderKanban },
  { href: "/assistant", label: "Assistant", icon: Bot },
  { href: "/variants", label: "Variants", icon: Wand2 },
  { href: "/render", label: "Render", icon: Palette },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(238,242,255,0.98))] text-slate-700 shadow-[0_18px_48px_-22px_rgba(15,23,42,0.2)] ring-1 ring-slate-200 dark:bg-[linear-gradient(135deg,rgba(99,102,241,1),rgba(45,212,191,0.9))] dark:text-white dark:shadow-[0_20px_55px_-22px_rgba(56,189,248,0.8)] dark:ring-0">
          <FileUser className="size-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600/70 dark:text-violet-200/70">Claimit</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">Resume workspace</h1>
            <Badge variant="accent">CV workspace</Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <nav className="flex flex-wrap gap-2 rounded-[22px] border border-slate-200/80 bg-white/80 p-2 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition duration-300",
                active ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
              )}
            >
              <AnimatePresence>
                {active ? (
                  <motion.span
                    layoutId="nav-highlight"
                    className="absolute inset-0 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.08] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                ) : null}
              </AnimatePresence>
              <span className="relative z-10">
                <Icon className="size-4" />
              </span>
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
        </nav>
        <ThemeToggle />
      </div>
    </div>
  );
}
