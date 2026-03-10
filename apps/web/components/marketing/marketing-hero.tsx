import { ArrowRight, CheckCircle2, MonitorSmartphone, Terminal } from "lucide-react";
import Link from "next/link";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type HeroBadge = {
  label: string;
  variant?: "default" | "accent";
};

type HeroProofStat = {
  value: string;
  label: string;
  description: string;
};

type HeroPreviewTab = {
  value: string;
  label: string;
  headline: string;
  description: string;
  kind: "terminal" | "surface";
  lines: string[];
  details: string[];
};

export function MarketingHero({
  eyebrow,
  title,
  description,
  badges,
  primaryCta,
  secondaryCta,
  previewTitle,
  previewDescription,
  previewTabs,
  proofStats,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badges: HeroBadge[];
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  previewTitle: string;
  previewDescription: string;
  previewTabs: HeroPreviewTab[];
  proofStats: HeroProofStat[];
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card variant="elevated" padding="lg" className="overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-[42%] bg-[radial-gradient(circle_at_top,rgba(196,162,123,0.08),transparent_50%),radial-gradient(circle_at_bottom,rgba(96,117,138,0.06),transparent_52%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between gap-10">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">{eyebrow}</p>
              <div className="flex flex-wrap items-center gap-3">
                {badges.map((badge) => (
                  <Badge key={badge.label} variant={badge.variant ?? "default"}>
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="max-w-3xl space-y-4">
              <h2 className="text-4xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-5xl lg:text-6xl">{title}</h2>
              <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">{description}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={primaryCta.href}>
                  {primaryCta.label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {proofStats.map((item, index) => (
              <div
                key={`${item.value}-${item.label}`}
                className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4 shadow-[0_10px_22px_-20px_var(--shadow-color)]"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--text-tertiary)]">0{index + 1}</p>
                <p className="mt-4 text-3xl font-semibold text-[color:var(--text-primary)]">{item.value}</p>
                <p className="mt-2 text-sm font-semibold text-[color:var(--text-primary)]">{item.label}</p>
                <p className="mt-2 text-xs leading-5 text-[color:var(--text-secondary)]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card variant="glass" padding="lg" className="overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,162,123,0.14),transparent_48%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent)] dark:bg-[radial-gradient(circle_at_top,rgba(196,162,123,0.08),transparent_48%),linear-gradient(135deg,rgba(255,255,255,0.03),transparent)]" />
        <div className="relative z-10 flex h-full flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-tertiary)]">{previewTitle}</p>
              <h3 className="mt-3 text-2xl font-semibold text-[color:var(--text-primary)]">{previewDescription}</h3>
            </div>
            <div className="flex size-12 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-elevated)] text-[color:var(--text-primary)]">
              <Terminal className="size-5" />
            </div>
          </div>

          <Tabs defaultValue={previewTabs[0]?.value} className="space-y-4">
            <TabsList>
              {previewTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {previewTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="space-y-4">
                <div>
                  <p className="text-lg font-semibold text-[color:var(--text-primary)]">{tab.headline}</p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">{tab.description}</p>
                </div>

                <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[0_24px_64px_-34px_var(--shadow-color)]">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-[rgba(255,92,92,0.88)]" />
                    <span className="size-2.5 rounded-full bg-[rgba(255,189,46,0.9)]" />
                    <span className="size-2.5 rounded-full bg-[rgba(39,201,63,0.88)]" />
                    <span className="ml-2 text-xs text-[color:var(--text-tertiary)]">claimit</span>
                    <span className="ml-auto text-xs text-[color:var(--text-tertiary)]">
                      {tab.kind === "terminal" ? <Terminal className="size-4" /> : <MonitorSmartphone className="size-4" />}
                    </span>
                  </div>

                  {tab.kind === "terminal" ? (
                    <div className="space-y-3 font-mono text-sm text-[color:var(--text-primary)]">
                      {tab.lines.map((line) => (
                        <div key={line} className="flex gap-3">
                          <span className="shrink-0 text-[color:var(--accent)]">$</span>
                          <span className="break-all">{line}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {tab.lines.map((line) => (
                        <div
                          key={line}
                          className="flex items-center gap-3 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-4 py-3 text-sm text-[color:var(--text-primary)]"
                        >
                          <CheckCircle2 className="size-4 shrink-0 text-[color:var(--success)]" />
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {tab.details.map((detail) => (
                    <Badge key={detail}>{detail}</Badge>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </Card>
    </section>
  );
}
