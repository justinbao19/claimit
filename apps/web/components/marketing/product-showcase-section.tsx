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
                  <div className="grid gap-3 sm:grid-cols-3">
                    {workspaceMetrics.map((metric) => (
                      <div key={metric.label} className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4">
                        <p className="text-2xl font-semibold text-[color:var(--text-primary)]">{metric.value}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[color:var(--text-tertiary)]">{metric.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--text-secondary)]">
                      <span className="rounded-full bg-[color:var(--surface)] px-3 py-1.5">Evidence synced</span>
                      <span className="rounded-full bg-[color:var(--surface)] px-3 py-1.5">Assistant ready</span>
                      <span className="rounded-full bg-[color:var(--surface)] px-3 py-1.5">PDF preview live</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[rgba(96,117,138,0.14)]">
                      <div className="h-full w-[78%] rounded-full bg-[linear-gradient(90deg,var(--accent),var(--field-focus))]" />
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
