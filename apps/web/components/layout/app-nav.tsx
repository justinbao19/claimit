"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  FilePlus2,
  FolderKanban,
  LayoutDashboard,
  Palette,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "../../lib/utils";
import { ClaimitMark } from "../brand/claimit-mark";
import { Badge } from "../ui/badge";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslations } from "./locale-provider";

export function AppNav() {
  const pathname = usePathname();
  const t = useTranslations();
  const navItems = [
    { href: "/workspace", label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: "/import", label: t("nav.import"), icon: FilePlus2 },
    { href: "/memory", label: t("nav.memory"), icon: FolderKanban },
    { href: "/assistant", label: t("nav.assistant"), icon: Bot },
    { href: "/variants", label: t("nav.variants"), icon: Wand2 },
    { href: "/render", label: t("nav.render"), icon: Palette },
  ];

  return (
    <div className="relative flex flex-col gap-4 pr-18 lg:flex-row lg:items-center lg:justify-between lg:pr-20">
      <div className="flex items-center gap-4">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-[28px] bg-[linear-gradient(145deg,var(--accent-strong),var(--accent))] text-[color:var(--accent-contrast)] shadow-[0_18px_46px_-24px_rgba(112,82,56,0.55)] ring-1 ring-[rgba(255,255,255,0.12)]">
          <ClaimitMark className="size-[3.75rem]" accentClassName="fill-transparent" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent)]/85">{t("common.appName")}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-lg font-semibold text-[color:var(--text-primary)] sm:text-xl">{t("nav.workspaceTitle")}</h1>
            <Badge variant="accent">{t("nav.workspaceBadge")}</Badge>
          </div>
        </div>
      </div>

      <div className="relative z-20 flex flex-wrap items-center gap-3">
        <nav className="flex flex-wrap gap-2 rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface)] p-2 shadow-[0_18px_42px_-28px_var(--shadow-color)] backdrop-blur-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition duration-300",
                  active
                    ? "text-[color:var(--text-primary)]"
                    : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]",
                )}
              >
                <AnimatePresence>
                  {active ? (
                    <motion.span
                      layoutId="nav-highlight"
                      className="absolute inset-0 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-elevated)] shadow-[0_16px_30px_-22px_var(--shadow-color)]"
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
      </div>
      <div className="absolute right-0 top-0 z-30">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
