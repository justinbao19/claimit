import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CodeCopyButton } from "./code-copy-button";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
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
        <Button asChild size="lg" variant="secondary" className="justify-between">
          <Link href={ctaHref}>
            {ctaLabel}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
