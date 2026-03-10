"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, FileStack, LayoutTemplate, Sparkles, Wand2 } from "lucide-react";

import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

type ShowcaseCard = {
  badge: string;
  title: string;
  description: string;
};

type ShowcaseMetric = {
  value: string;
  label: string;
};

function parseMetricValue(rawValue: string) {
  const match = rawValue.match(/^(\d+)(.*)$/);

  if (!match) {
    return null;
  }

  const numericPart = match[1] ?? "";
  const suffixPart = match[2] ?? "";

  return {
    base: Number(numericPart),
    digits: numericPart.length,
    suffix: suffixPart,
  };
}

export function ProductShowcaseSection({
  eyebrow,
  title,
  description,
  badge,
  cli,
  cliWindowLabel,
  cliLines,
  cliChecks,
  workspace,
  workspaceWindowLabel,
  workspaceSidebar,
  workspaceMetrics,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
  cli: ShowcaseCard;
  cliWindowLabel: string;
  cliLines: string[];
  cliChecks: string[];
  workspace: ShowcaseCard;
  workspaceWindowLabel: string;
  workspaceSidebar: string[];
  workspaceMetrics: ShowcaseMetric[];
}) {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAnimationPhase((current) => current + 1);
    }, 140);

    return () => window.clearInterval(timer);
  }, []);

  const animatedMetrics = useMemo(
    () =>
      workspaceMetrics.map((metric, index) => {
        const parsed = parseMetricValue(metric.value);

        if (!parsed) {
          return metric.value;
        }

        const maxByDigits = Math.max(0, 10 ** parsed.digits - 1);
        const floorSpan = Math.max(2, Math.ceil(parsed.base * 0.24));
        const ceilingSpan = Math.max(8, Math.ceil(parsed.base * 0.82) + index * 2);
        const minValue = Math.max(0, parsed.base - floorSpan);
        const maxValue = Math.min(maxByDigits, parsed.base + ceilingSpan);
        const carrier = (Math.sin((animationPhase + index * 7) * 0.29) + 1) / 2;
        const modulation = (Math.sin((animationPhase + index * 11) * 0.1 + 0.6) + 1) / 2;
        const jitter = (Math.sin((animationPhase + index * 5) * 0.67) + 1) / 2;
        const blended = carrier * 0.58 + modulation * 0.27 + jitter * 0.15;
        const nextValue = Math.round(minValue + blended * (maxValue - minValue));
        const formatted = String(nextValue).padStart(parsed.digits, "0");

        return `${formatted}${parsed.suffix}`;
      }),
    [animationPhase, workspaceMetrics],
  );

  const progressValue = useMemo(() => {
    const cycle = ((animationPhase * 1.85) % 92) + 6;
    const wave = Math.sin(animationPhase * 0.22) * 3 + Math.sin(animationPhase * 0.11 + 1.4) * 1.6;

    return Math.max(8, Math.min(97, cycle + wave));
  }, [animationPhase]);

  const shimmerPosition = useMemo(() => `${(animationPhase * 7) % 180}% 0`, [animationPhase]);

  return (
    <section className="space-y-6">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">{eyebrow}</p>
          <Badge variant="accent">{badge}</Badge>
        </div>
        <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">{title}</h3>
        <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">{description}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card variant="elevated" padding="lg" className="overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,162,123,0.14),transparent_44%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
          <div className="relative z-10 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-tertiary)]">{cli.badge}</p>
                <h4 className="mt-3 text-2xl font-semibold text-[color:var(--text-primary)]">{cli.title}</h4>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)]">{cli.description}</p>
              </div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-3 py-2 text-xs text-[color:var(--text-secondary)]">
                claimer@local
              </div>
            </div>

            <div className="rounded-[28px] border border-[color:var(--border)] bg-[rgba(18,22,26,0.96)] p-5 text-[color:var(--accent-contrast)] shadow-[0_28px_64px_-34px_rgba(0,0,0,0.65)]">
              <div className="mb-4 flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[rgba(255,92,92,0.88)]" />
                <span className="size-2.5 rounded-full bg-[rgba(255,189,46,0.9)]" />
                <span className="size-2.5 rounded-full bg-[rgba(39,201,63,0.88)]" />
                <span className="ml-2 text-xs text-[rgba(255,255,255,0.52)]">{cliWindowLabel}</span>
              </div>

              <div className="space-y-3 font-mono text-sm">
                {cliLines.map((line) => (
                  <div key={line} className="flex gap-3">
                    <span className="shrink-0 text-[color:var(--accent)]">$</span>
                    <span className="break-all text-[rgba(255,255,255,0.92)]">{line}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {cliChecks.map((item) => (
                  <div
                    key={item}
                    className="rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[rgba(255,255,255,0.82)]"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-[rgba(111,209,146,0.95)]" />
                      <span>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card variant="glass" padding="lg" className="overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,117,138,0.12),transparent_46%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent)]" />
          <div className="relative z-10 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-tertiary)]">{workspace.badge}</p>
              <h4 className="mt-3 text-2xl font-semibold text-[color:var(--text-primary)]">{workspace.title}</h4>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)]">{workspace.description}</p>
            </div>

            <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-[0_28px_64px_-34px_var(--shadow-color)]">
              <div className="mb-4 flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[rgba(255,92,92,0.88)]" />
                <span className="size-2.5 rounded-full bg-[rgba(255,189,46,0.9)]" />
                <span className="size-2.5 rounded-full bg-[rgba(39,201,63,0.88)]" />
                <span className="ml-2 text-xs text-[color:var(--text-tertiary)]">{workspaceWindowLabel}</span>
              </div>

              <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--panel)] p-4">
                  <div className="space-y-3">
                    {workspaceSidebar.map((item, index) => {
                      const Icon = index === 0 ? FileStack : index === 1 ? Sparkles : index === 2 ? Wand2 : LayoutTemplate;

                      return (
                        <div
                          key={item}
                          className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm ${
                            index === 0
                              ? "bg-[color:var(--surface-elevated)] text-[color:var(--text-primary)]"
                              : "text-[color:var(--text-secondary)]"
                          }`}
                        >
                          <Icon className="size-4" />
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">
                    {workspaceMetrics.map((metric, index) => (
                      <div
                        key={metric.label}
                        className="relative overflow-hidden rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4"
                      >
                        <div
                          className="pointer-events-none absolute inset-0 opacity-45"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 86% 12%,rgba(196,162,123,0.22),transparent 44%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent)",
                          }}
                        />
                        <span
                          className="pointer-events-none absolute right-3 top-3 size-1.5 rounded-full bg-[color:var(--accent)]"
                          style={{
                            opacity: 0.42 + ((Math.sin((animationPhase + index * 4) * 0.45) + 1) / 2) * 0.56,
                            boxShadow: "0 0 14px color-mix(in srgb, var(--accent) 72%, transparent)",
                          }}
                        />
                        <p className="relative text-2xl font-semibold tabular-nums tracking-[0.03em] text-transparent transition-all duration-200 [background-image:linear-gradient(135deg,var(--text-primary),var(--accent))] bg-clip-text">
                          {animatedMetrics[index] ?? metric.value}
                        </p>
                        <p className="relative mt-2 break-words text-xs uppercase tracking-[0.18em] text-[color:var(--text-tertiary)]">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--text-secondary)]">
                      <span className="rounded-full bg-[color:var(--surface)] px-3 py-1.5">Evidence synced</span>
                      <span className="rounded-full bg-[color:var(--surface)] px-3 py-1.5">Assistant ready</span>
                      <span className="rounded-full bg-[color:var(--surface)] px-3 py-1.5">PDF preview live</span>
                    </div>
                    <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-[rgba(96,117,138,0.14)]">
                      <div
                        className="pointer-events-none absolute inset-0 opacity-55"
                        style={{
                          backgroundImage:
                            "linear-gradient(120deg,transparent 18%,rgba(255,255,255,0.42) 50%,transparent 82%)",
                          backgroundSize: "180% 100%",
                          backgroundPosition: shimmerPosition,
                        }}
                      />
                      <div
                        className="relative h-full rounded-full transition-[width,background-position] duration-150 ease-linear"
                        style={{
                          width: `${progressValue}%`,
                          backgroundImage: "linear-gradient(90deg,var(--accent),var(--field-focus),var(--accent))",
                          backgroundSize: "240% 100%",
                          backgroundPosition: `${progressValue}% 0`,
                          boxShadow:
                            "0 0 14px color-mix(in srgb, var(--field-focus) 58%, transparent), 0 0 24px color-mix(in srgb, var(--accent) 44%, transparent)",
                        }}
                      >
                        <div className="absolute inset-y-0 right-0 w-8 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.56))]" />
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-[color:var(--text-secondary)]">Workspace flow is ready for the final pass.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
