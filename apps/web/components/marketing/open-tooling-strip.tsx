import {
  siFramer,
  siGit,
  siGithub,
  siJson,
  siMarkdown,
  siNextdotjs,
  siNodedotjs,
  siPnpm,
  siRadixui,
  siReact,
  siTailwindcss,
  siTypescript,
} from "simple-icons";
import { Dot } from "lucide-react";

import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

const toolingIcons = [
  siPnpm,
  siNodedotjs,
  siTypescript,
  siReact,
  siNextdotjs,
  siTailwindcss,
  siFramer,
  siRadixui,
  siGit,
  siGithub,
  siMarkdown,
  siJson,
] as const;

function isLowContrastHex(hex: string) {
  const normalized = hex.trim().replace("#", "");
  if (normalized.length !== 6) {
    return false;
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  return luminance < 0.28;
}

export function OpenToolingStrip({
  eyebrow,
  title,
  description,
  badge,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <section className="space-y-6">
      <Card variant="elevated" padding="lg" className="overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,162,123,0.14),transparent_44%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
        <div className="relative z-10">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">{eyebrow}</p>
              <Badge>{badge}</Badge>
            </div>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">{title}</h3>
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[color:var(--text-secondary)] sm:text-base">
              <span>{description}</span>
              <Dot className="size-4 text-[color:var(--text-tertiary)]" />
              <span>CLI</span>
              <Dot className="size-4 text-[color:var(--text-tertiary)]" />
              <span>Web</span>
              <Dot className="size-4 text-[color:var(--text-tertiary)]" />
              <span>Local-first</span>
            </div>
          </div>

          <div className="mt-6 rounded-[30px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[0_28px_64px_-34px_var(--shadow-color)]">
            <div className="overflow-hidden">
              <div className="logo-marquee-track flex w-max gap-3 pr-3">
                {[...toolingIcons, ...toolingIcons].map((icon, index) => {
                  const lowContrast = isLowContrastHex(icon.hex);

                  return (
                    <div
                      key={`${icon.title}-${index}`}
                      className="flex min-w-[196px] items-center gap-4 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-4 py-3 shadow-[0_16px_32px_-28px_var(--shadow-color)]"
                      aria-hidden={index >= toolingIcons.length}
                    >
                      <div
                        className={`flex size-12 shrink-0 items-center justify-center rounded-full border ${
                          lowContrast
                            ? "border-[rgba(0,0,0,0.08)] bg-white text-black shadow-[0_8px_20px_-16px_rgba(0,0,0,0.25)]"
                            : "border-[color:var(--border)] bg-[color:var(--surface)]"
                        }`}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className={`size-6 ${lowContrast ? "text-black" : ""}`}>
                          <path d={icon.path} fill={lowContrast ? "currentColor" : `#${icon.hex}`} />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[color:var(--text-primary)]">{icon.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--text-tertiary)]">open tooling</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
