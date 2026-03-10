"use client";

import { Check, ChevronDown, Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "../../lib/utils";
import { localeOptions } from "./locale-provider";
import { useLocale, useTranslations } from "./locale-provider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const activeOption = localeOptions.find((option) => option.value === locale) ?? localeOptions[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      const clickedButton = containerRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);

      if (!clickedButton && !clickedMenu) {
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

  useEffect(() => {
    if (!open) {
      return;
    }

    function updateMenuPosition() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      const menuWidth = 176;
      const viewportPadding = 16;
      const left = Math.min(
        window.innerWidth - menuWidth - viewportPadding,
        Math.max(viewportPadding, rect.right - menuWidth),
      );

      setMenuPosition({
        top: rect.bottom + 8,
        left,
      });
    }

    updateMenuPosition();

    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-[color:var(--border)] bg-[rgba(255,255,255,0.78)] px-3 text-sm text-[color:var(--text-primary)] shadow-[0_10px_22px_-18px_var(--shadow-color)] backdrop-blur transition hover:bg-[rgba(255,255,255,0.9)]"
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

      {mounted && open
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              aria-label={t("language.label")}
              style={{
                position: "fixed",
                top: menuPosition.top,
                left: menuPosition.left,
              }}
              className="z-[200] min-w-[11rem] rounded-2xl border border-[color:var(--border)] bg-[rgba(255,255,255,0.96)] p-1.5 shadow-[0_18px_36px_-24px_var(--shadow-color)]"
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
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
