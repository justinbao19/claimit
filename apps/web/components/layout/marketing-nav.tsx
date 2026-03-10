"use client";

import Link from "next/link";

import { ClaimitMark } from "../brand/claimit-mark";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslations } from "./locale-provider";

const navAnchors = [
  { href: "#quick-start", key: "marketing.nav.quickStart" },
  { href: "#capabilities", key: "marketing.nav.capabilities" },
  { href: "#testimonials", key: "marketing.nav.testimonials" },
] as const;

export function MarketingNav() {
  const t = useTranslations();

  return (
    <div className="relative flex flex-col gap-4 pr-18 lg:flex-row lg:items-center lg:justify-between lg:pr-20">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex size-16 shrink-0 items-center justify-center rounded-[24px] bg-[linear-gradient(145deg,var(--accent-strong),var(--accent))] text-[color:var(--accent-contrast)] shadow-[0_18px_46px_-24px_rgba(112,82,56,0.55)] ring-1 ring-[rgba(255,255,255,0.12)]">
          <ClaimitMark className="size-[3.1rem]" accentClassName="fill-transparent" />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent)]/85">{t("common.appName")}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-lg font-semibold text-[color:var(--text-primary)] sm:text-xl">{t("marketing.nav.title")}</h1>
            <Badge variant="accent">{t("marketing.nav.productBadge")}</Badge>
          </div>
        </div>
      </div>

      <div className="relative z-20 flex flex-wrap items-center gap-3">
        <nav className="flex flex-wrap gap-2 rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface)] p-2 shadow-[0_18px_42px_-28px_var(--shadow-color)] backdrop-blur-xl">
          {navAnchors.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center rounded-2xl px-4 py-2.5 text-sm font-medium text-[color:var(--text-secondary)] transition duration-300 hover:bg-[color:var(--surface-elevated)] hover:text-[color:var(--text-primary)]"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <Link href="/workspace">{t("marketing.nav.openWorkspace")}</Link>
        </Button>
        <Button asChild>
          <Link href="#quick-start">{t("marketing.nav.launchQuickStart")}</Link>
        </Button>
      </div>
      <div className="absolute right-0 top-0 z-30">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
