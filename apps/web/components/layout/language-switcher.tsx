"use client";

import { Check, ChevronDown, Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "../../lib/utils";
import { localeOptions } from "./locale-provider";
import { useLocale, useTranslations } from "./locale-provider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeOption = localeOptions.find((option) => option.value === locale) ?? localeOptions[0];

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-[80]"
    >
      <button
        type="button"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-overlay)] px-3 text-sm text-[color:var(--text-primary)] shadow-[0_14px_32px_-24px_var(--shadow-color)] backdrop-blur transition hover:bg-[color:var(--surface-elevated)]"
        aria-label={t("language.label")}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Languages className="size-4 text-[color:var(--text-secondary)]" />
        <span className="min-w-[2.5rem] text-left text-xs font-medium tracking-[0.12em] uppercase">
          {activeOption.shortLabel}
        </span>
        <ChevronDown className={cn("size-4 text-[color:var(--text-secondary)] transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={t("language.label")}
          className="pointer-events-auto absolute right-0 top-full z-[90] mt-2 min-w-[11rem] rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-1.5 shadow-[0_24px_48px_-28px_var(--shadow-color)]"
        >
          {localeOptions.map((option) => {
            const active = option.value === locale;

            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setLocale(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition",
                  active
                    ? "bg-[color:var(--surface)] text-[color:var(--text-primary)]"
                    : "text-[color:var(--text-secondary)] hover:bg-[color:var(--surface)] hover:text-[color:var(--text-primary)]",
                )}
              >
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--text-tertiary)]">
                    {option.shortLabel}
                  </span>
                </span>
                <Check className={cn("size-4", active ? "opacity-100" : "opacity-0")} />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
