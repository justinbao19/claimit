import { ArrowUpRight, FolderKanban, LayoutTemplate, ScanSearch, Sparkles } from "lucide-react";
import Link from "next/link";

import { CodeCopyButton } from "./code-copy-button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

type QuickStartStep = {
  label: string;
  title: string;
  description: string;
};

export function QuickStartSection({
  eyebrow,
  title,
  description,
  badge,
  terminalLabel,
  commandBlock,
  copyLabel,
  copiedLabel,
  steps,
  ctaLabel,
  ctaHref,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
  terminalLabel: string;
  commandBlock: string;
  copyLabel: string;
  copiedLabel: string;
  steps: QuickStartStep[];
  ctaLabel: string;
  ctaHref: string;
}) {
  const launchStep = steps.at(-1);

  return (
    <section id="quick-start" className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card variant="elevated" padding="lg" className="overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,162,123,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">{eyebrow}</p>
            <Badge variant="accent">{badge}</Badge>
          </div>
          <div className="max-w-2xl">
            <h3 className="text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">{title}</h3>
            <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">{description}</p>
          </div>
          <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[0_24px_64px_-34px_var(--shadow-color)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[rgba(255,92,92,0.88)]" />
                <span className="size-2.5 rounded-full bg-[rgba(255,189,46,0.9)]" />
                <span className="size-2.5 rounded-full bg-[rgba(39,201,63,0.88)]" />
                <span className="ml-2 text-xs text-[color:var(--text-tertiary)]">{terminalLabel}</span>
              </div>
              <CodeCopyButton value={commandBlock} label={copyLabel} copiedLabel={copiedLabel} />
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-7 text-[color:var(--text-primary)]">
              <code>{commandBlock}</code>
            </pre>
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        <Card variant="panel" padding="lg">
          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={step.label}
                className={`rounded-[22px] px-1 py-1 ${index >= 2 ? "sm:border-t sm:border-[color:var(--border)] sm:pt-5" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--field-border)] bg-[color:var(--panel)] text-xs font-semibold text-[color:var(--text-primary)]">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--text-tertiary)]">{step.label}</p>
                    <h4 className="mt-2 text-base font-semibold text-[color:var(--text-primary)]">{step.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Link
          href={ctaHref}
          className="group relative overflow-hidden rounded-[30px] border border-[color:var(--border)] bg-[linear-gradient(145deg,var(--panel-strong),var(--surface-elevated))] p-5 shadow-[0_18px_42px_-28px_var(--shadow-color)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[color:var(--field-border)] hover:shadow-[0_26px_56px_-30px_rgba(112,82,56,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] sm:p-6"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,162,123,0.18),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_35%)] opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex h-full flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="accent">{launchStep?.label ?? badge}</Badge>
              <span className="rounded-full border border-[color:var(--field-border)] bg-[color:var(--panel)] px-3 py-1 font-mono text-[11px] text-[color:var(--text-tertiary)]">
                {ctaHref}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[rgba(196,162,123,0.24)] bg-[linear-gradient(145deg,rgba(196,162,123,0.2),rgba(196,162,123,0.08))] text-[color:var(--accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]">
                    <Sparkles className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--text-tertiary)]">
                      {launchStep?.title ?? badge}
                    </p>
                    <h4 className="mt-1 text-lg font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-xl">
                      {ctaLabel}
                    </h4>
                  </div>
                </div>
                <p className="max-w-xl text-sm leading-6 text-[color:var(--text-secondary)]">
                  {launchStep?.description ?? description}
                </p>
              </div>

              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--field-border)] bg-[color:var(--surface)] text-[color:var(--text-primary)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowUpRight className="size-5" />
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
                <FolderKanban className="size-4 text-[color:var(--accent)]" />
                <div className="mt-4 space-y-2">
                  <div className="h-2 w-11 rounded-full bg-[color:var(--text-primary)]/10" />
                  <div className="h-2 w-full rounded-full bg-[color:var(--text-primary)]/8" />
                  <div className="h-2 w-4/5 rounded-full bg-[color:var(--text-primary)]/8" />
                </div>
              </div>
              <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
                <ScanSearch className="size-4 text-[color:var(--accent)]" />
                <div className="mt-4 space-y-2">
                  <div className="h-2 w-10 rounded-full bg-[color:var(--text-primary)]/10" />
                  <div className="h-2 w-full rounded-full bg-[color:var(--text-primary)]/8" />
                  <div className="h-2 w-3/5 rounded-full bg-[color:var(--text-primary)]/8" />
                </div>
              </div>
              <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
                <LayoutTemplate className="size-4 text-[color:var(--accent)]" />
                <div className="mt-4 space-y-2">
                  <div className="h-2 w-12 rounded-full bg-[color:var(--text-primary)]/10" />
                  <div className="h-2 w-full rounded-full bg-[color:var(--text-primary)]/8" />
                  <div className="h-2 w-2/3 rounded-full bg-[color:var(--text-primary)]/8" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
