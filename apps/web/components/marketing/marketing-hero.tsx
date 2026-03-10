import { ArrowRight, CheckCircle2, MonitorSmartphone, Sparkles, Terminal } from "lucide-react";
import Link from "next/link";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type HeroBadge = {
  label: string;
  variant?: "default" | "accent";
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
}) {
  return (
    <section>
      <Card variant="elevated" padding="lg" className="overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,162,123,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(96,117,138,0.1),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
        <div className="relative z-10 space-y-8">
          <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
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

            <div className="group/hero relative">
              <div className="absolute inset-x-6 top-6 h-40 rounded-full bg-[radial-gradient(circle,rgba(196,162,123,0.22),transparent_70%)] blur-3xl hero-glow-pulse" />
              <div className="relative mx-auto max-w-[560px] pr-2 pt-6 sm:pr-6">
                <div className="hero-float absolute right-0 top-4 z-20 w-[190px] rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4 shadow-[0_20px_44px_-28px_var(--shadow-color)] transition-transform duration-500 ease-out group-hover/hero:translate-x-1 group-hover/hero:-translate-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-tertiary)]">Role Match</p>
                    <div className="hero-chip-glow rounded-full bg-[rgba(69,106,90,0.12)] px-2.5 py-1 text-xs font-semibold text-[color:var(--success)]">
                      92%
                    </div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[rgba(96,117,138,0.14)]">
                    <div className="hero-progress-sheen h-full w-[92%] rounded-full bg-[linear-gradient(90deg,var(--accent),var(--field-focus),var(--accent))]" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-[color:var(--text-secondary)]">
                    <span className="rounded-full bg-[color:var(--surface)] px-2.5 py-1 transition-transform duration-300 group-hover/hero:-translate-y-0.5">ATS</span>
                    <span className="rounded-full bg-[color:var(--surface)] px-2.5 py-1 transition-transform duration-300 group-hover/hero:-translate-y-0.5">PM</span>
                    <span className="rounded-full bg-[color:var(--surface)] px-2.5 py-1 transition-transform duration-300 group-hover/hero:-translate-y-0.5">Growth</span>
                  </div>
                </div>

                <div className="hero-breathe relative rounded-[30px] border border-[rgba(0,0,0,0.05)] bg-white p-5 shadow-[0_32px_72px_-36px_rgba(0,0,0,0.28)] transition-transform duration-500 ease-out group-hover/hero:-translate-x-1 group-hover/hero:translate-y-1 dark:border-[rgba(255,255,255,0.08)] dark:bg-[color:var(--surface)]">
                  <div className="pointer-events-none absolute inset-x-6 top-0 h-20 rounded-full bg-[radial-gradient(circle,rgba(196,162,123,0.16),transparent_68%)] blur-2xl" />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xl font-semibold text-[#1f2937] dark:text-[color:var(--text-primary)]">Alex Morgan</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#6b7280] dark:text-[color:var(--text-tertiary)]">
                        Product Manager Resume
                      </p>
                    </div>
                    <div className="hero-chip-glow rounded-full bg-[#f3f4f6] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4b5563] dark:bg-[color:var(--surface-elevated)] dark:text-[color:var(--text-secondary)]">
                      Tailored
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
                    <div className="space-y-4">
                      <div className="rounded-[22px] border border-[#e5e7eb] p-4 dark:border-[color:var(--border)]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af] dark:text-[color:var(--text-tertiary)]">
                          Summary
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="hero-skeleton-line h-2 rounded-full bg-[#d1d5db] dark:bg-[rgba(255,255,255,0.12)]" />
                          <div className="hero-skeleton-line h-2 w-[86%] rounded-full bg-[#e5e7eb] dark:bg-[rgba(255,255,255,0.08)]" />
                          <div className="hero-skeleton-line h-2 w-[74%] rounded-full bg-[#e5e7eb] dark:bg-[rgba(255,255,255,0.08)]" />
                        </div>
                      </div>

                      <div className="rounded-[22px] border border-[#e5e7eb] p-4 dark:border-[color:var(--border)]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af] dark:text-[color:var(--text-tertiary)]">
                          Experience
                        </p>
                        <div className="mt-3 space-y-3">
                          <div className="rounded-2xl bg-[#f8fafc] p-3 dark:bg-[color:var(--surface-elevated)]">
                            <div className="hero-skeleton-line h-2 w-[48%] rounded-full bg-[#cbd5e1] dark:bg-[rgba(255,255,255,0.14)]" />
                            <div className="hero-skeleton-line mt-2 h-2 w-[84%] rounded-full bg-[#e2e8f0] dark:bg-[rgba(255,255,255,0.08)]" />
                            <div className="hero-skeleton-line mt-2 h-2 w-[68%] rounded-full bg-[#e2e8f0] dark:bg-[rgba(255,255,255,0.08)]" />
                          </div>
                          <div className="rounded-2xl bg-[#f8fafc] p-3 dark:bg-[color:var(--surface-elevated)]">
                            <div className="hero-skeleton-line h-2 w-[52%] rounded-full bg-[#cbd5e1] dark:bg-[rgba(255,255,255,0.14)]" />
                            <div className="hero-skeleton-line mt-2 h-2 w-[78%] rounded-full bg-[#e2e8f0] dark:bg-[rgba(255,255,255,0.08)]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[22px] border border-[#e5e7eb] p-4 dark:border-[color:var(--border)]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af] dark:text-[color:var(--text-tertiary)]">
                          Highlights
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-xs text-[#4b5563] dark:bg-[color:var(--surface-elevated)] dark:text-[color:var(--text-secondary)]">
                            Growth
                          </span>
                          <span className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-xs text-[#4b5563] dark:bg-[color:var(--surface-elevated)] dark:text-[color:var(--text-secondary)]">
                            SQL
                          </span>
                          <span className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-xs text-[#4b5563] dark:bg-[color:var(--surface-elevated)] dark:text-[color:var(--text-secondary)]">
                            Platform
                          </span>
                          <span className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-xs text-[#4b5563] dark:bg-[color:var(--surface-elevated)] dark:text-[color:var(--text-secondary)]">
                            ATS
                          </span>
                        </div>
                      </div>

                      <div className="rounded-[22px] border border-[#e5e7eb] p-4 dark:border-[color:var(--border)]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af] dark:text-[color:var(--text-tertiary)]">
                          Templates
                        </p>
                        <div className="mt-3 grid gap-2">
                          <div className="flex items-center justify-between rounded-2xl bg-[#f8fafc] px-3 py-2 text-sm dark:bg-[color:var(--surface-elevated)]">
                            <span className="text-[#374151] dark:text-[color:var(--text-primary)]">ATS Minimal</span>
                            <CheckCircle2 className="size-4 text-[color:var(--success)]" />
                          </div>
                          <div className="flex items-center justify-between rounded-2xl bg-[#f8fafc] px-3 py-2 text-sm dark:bg-[color:var(--surface-elevated)]">
                            <span className="text-[#6b7280] dark:text-[color:var(--text-secondary)]">Modern Clean</span>
                            <span className="text-xs text-[#9ca3af] dark:text-[color:var(--text-tertiary)]">ready</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-[color:var(--border)] bg-[color:var(--panel)] p-5 shadow-[0_24px_56px_-34px_var(--shadow-color)] backdrop-blur-xl">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-tertiary)]">{previewTitle}</p>
                <h3 className="mt-3 text-2xl font-semibold text-[color:var(--text-primary)]">{previewDescription}</h3>
              </div>
              <div className="flex size-12 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-elevated)] text-[color:var(--text-primary)]">
                <Terminal className="size-5" />
              </div>
            </div>

            <Tabs defaultValue={previewTabs[0]?.value} className="mt-5 space-y-4">
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
                      <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
                        <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--panel)] p-4">
                          <div className="space-y-2">
                            {tab.lines.map((line, index) => (
                              <div
                                key={line}
                                className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm ${
                                  index === 0
                                    ? "bg-[color:var(--surface-elevated)] text-[color:var(--text-primary)]"
                                    : "text-[color:var(--text-secondary)]"
                                }`}
                              >
                                <CheckCircle2 className="size-4 shrink-0 text-[color:var(--success)]" />
                                <span>{line}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.65),rgba(255,255,255,0.18))] p-4 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]">
                          <div className="mx-auto max-w-[260px] rounded-[22px] border border-[rgba(0,0,0,0.06)] bg-white p-4 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.22)] dark:border-[rgba(255,255,255,0.08)] dark:bg-[color:var(--surface)]">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-base font-semibold text-[#1f2937] dark:text-[color:var(--text-primary)]">Alex Morgan</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#6b7280] dark:text-[color:var(--text-tertiary)]">
                                  Product Manager
                                </p>
                              </div>
                              <div className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4b5563] dark:bg-[color:var(--surface-elevated)] dark:text-[color:var(--text-secondary)]">
                                ATS
                              </div>
                            </div>

                            <div className="mt-4 space-y-3">
                              <div className="h-2 rounded-full bg-[#e5e7eb] dark:bg-[rgba(255,255,255,0.08)]" />
                              <div className="h-2 w-[82%] rounded-full bg-[#e5e7eb] dark:bg-[rgba(255,255,255,0.08)]" />
                            </div>

                            <div className="mt-5 grid gap-3">
                              <div className="rounded-2xl border border-[#e5e7eb] p-3 dark:border-[color:var(--border)]">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af] dark:text-[color:var(--text-tertiary)]">
                                  Experience
                                </p>
                                <div className="mt-3 space-y-2">
                                  <div className="h-2 rounded-full bg-[#d1d5db] dark:bg-[rgba(255,255,255,0.12)]" />
                                  <div className="h-2 w-[88%] rounded-full bg-[#e5e7eb] dark:bg-[rgba(255,255,255,0.08)]" />
                                  <div className="h-2 w-[72%] rounded-full bg-[#e5e7eb] dark:bg-[rgba(255,255,255,0.08)]" />
                                </div>
                              </div>

                              <div className="rounded-2xl border border-[#e5e7eb] p-3 dark:border-[color:var(--border)]">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9ca3af] dark:text-[color:var(--text-tertiary)]">
                                  Highlights
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <span className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-xs text-[#4b5563] dark:bg-[color:var(--surface-elevated)] dark:text-[color:var(--text-secondary)]">
                                    Growth
                                  </span>
                                  <span className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-xs text-[#4b5563] dark:bg-[color:var(--surface-elevated)] dark:text-[color:var(--text-secondary)]">
                                    Analytics
                                  </span>
                                  <span className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-xs text-[#4b5563] dark:bg-[color:var(--surface-elevated)] dark:text-[color:var(--text-secondary)]">
                                    Platform
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
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
        </div>
      </Card>
    </section>
  );
}
