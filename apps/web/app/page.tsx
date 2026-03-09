import Link from "next/link";
import { initVault, listVariants, loadBaseResume } from "@claimit/core";
import { ArrowRight, Bot, FileStack, FolderKanban, LayoutTemplate, Sparkles, Wand2 } from "lucide-react";

import { PageIntro } from "../components/layout/page-intro";
import { AnimatedNumber } from "../components/ui/animated-number";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { getServerI18n } from "../lib/i18n";

export default async function HomePage() {
  await initVault();
  const [resume, variants] = await Promise.all([loadBaseResume(), listVariants()]);
  const { t } = await getServerI18n();

  const workflow = [
    { label: t("home.workflow.import.label"), icon: FileStack, description: t("home.workflow.import.description") },
    { label: t("home.workflow.memory.label"), icon: FolderKanban, description: t("home.workflow.memory.description") },
    { label: t("home.workflow.assistant.label"), icon: Bot, description: t("home.workflow.assistant.description") },
    { label: t("home.workflow.variants.label"), icon: Wand2, description: t("home.workflow.variants.description") },
    { label: t("home.workflow.render.label"), icon: LayoutTemplate, description: t("home.workflow.render.description") },
  ];

  const stats = [
    { label: t("home.stats.experience"), value: resume.experience.length },
    { label: t("home.stats.achievements"), value: resume.achievements.length },
    { label: t("home.stats.claims"), value: resume.claims.length },
    { label: t("home.stats.variants"), value: variants.length },
  ];

  const workspaceHealth = Math.min(
    96,
    28 +
      resume.experience.length * 10 +
      resume.achievements.length * 12 +
      resume.claims.length * 6 +
      variants.length * 4,
  );

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow={t("home.intro.eyebrow")}
        title={t("home.intro.title")}
        description={
          resume.basics.summary ?? t("home.intro.description")
        }
        icon={Sparkles}
        badge={t("home.intro.badge")}
      />

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <Card variant="elevated" padding="lg" className="overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-[42%] bg-[radial-gradient(circle_at_top,rgba(196,162,123,0.16),transparent_52%),radial-gradient(circle_at_bottom,rgba(116,133,154,0.14),transparent_55%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="accent">{t("home.hero.badgePrimary")}</Badge>
                <Badge>{t("home.hero.badgeSecondary")}</Badge>
              </div>
              <div className="max-w-3xl space-y-4">
                <h3 className="text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">
                  {t("home.hero.title")}
                </h3>
                <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">{t("home.hero.description")}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/import">
                    {t("home.hero.importAction")}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/assistant">{t("home.hero.assistantAction")}</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-5">
              {workflow.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-overlay)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-[color:var(--surface)] text-[color:var(--text-primary)]">
                        <Icon className="size-4" />
                      </div>
                      <span className="text-[11px] font-medium text-[color:var(--text-tertiary)]">0{index + 1}</span>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-[color:var(--text-primary)]">{item.label}</p>
                    <p className="mt-2 text-xs leading-5 text-[color:var(--text-secondary)]">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <div className="grid gap-6">
          <Card variant="glass" padding="lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[color:var(--text-secondary)]">{t("home.health.title")}</p>
                <div className="mt-3 flex items-end gap-3">
                  <span className="text-5xl font-semibold text-[color:var(--text-primary)]">
                    <AnimatedNumber value={workspaceHealth} />
                  </span>
                  <span className="pb-2 text-sm text-[color:var(--text-secondary)]">{t("home.health.suffix")}</span>
                </div>
              </div>
              <div className="rounded-2xl border border-[rgba(69,106,90,0.2)] bg-[rgba(69,106,90,0.08)] px-3 py-2 text-xs font-medium text-[color:var(--success)]">
                {t("home.health.status")}
              </div>
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-[rgba(116,133,154,0.12)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--field-focus))]"
                style={{ width: `${workspaceHealth}%` }}
              />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--text-tertiary)]">{t("home.currentBaseResume.title")}</p>
                <p className="mt-3 text-lg font-semibold text-[color:var(--text-primary)]">{resume.basics.name}</p>
                <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
                  {resume.experience.length > 0
                    ? t("home.currentBaseResume.filled", { count: resume.experience.length })
                    : t("home.currentBaseResume.empty")}
                </p>
              </div>
              <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--text-tertiary)]">{t("home.recommendedNextStep.title")}</p>
                <p className="mt-3 text-lg font-semibold text-[color:var(--text-primary)]">
                  {resume.achievements.length === 0
                    ? t("home.recommendedNextStep.emptyHeadline")
                    : t("home.recommendedNextStep.filledHeadline")}
                </p>
                <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
                  {resume.achievements.length === 0
                    ? t("home.recommendedNextStep.emptyDescription")
                    : t("home.recommendedNextStep.filledDescription")}
                </p>
              </div>
            </div>
          </Card>

          <Card variant="panel" padding="lg">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-tertiary)]">{t("home.quickAccess.title")}</p>
            <div className="mt-5 space-y-3">
              <Link
                href="/memory"
                className="flex items-center justify-between rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-4 py-4 text-sm text-[color:var(--text-primary)] transition hover:-translate-y-0.5 hover:border-[color:var(--field-border)] hover:shadow-[0_18px_46px_-30px_var(--shadow-color)]"
              >
                <span>{t("home.quickAccess.library")}</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/variants"
                className="flex items-center justify-between rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-4 py-4 text-sm text-[color:var(--text-primary)] transition hover:-translate-y-0.5 hover:border-[color:var(--field-border)] hover:shadow-[0_18px_46px_-30px_var(--shadow-color)]"
              >
                <span>{t("home.quickAccess.variants")}</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/render"
                className="flex items-center justify-between rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-4 py-4 text-sm text-[color:var(--text-primary)] transition hover:-translate-y-0.5 hover:border-[color:var(--field-border)] hover:shadow-[0_18px_46px_-30px_var(--shadow-color)]"
              >
                <span>{t("home.quickAccess.render")}</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} variant="interactive" padding="default">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-tertiary)]">{stat.label}</p>
            <p className="mt-4 text-4xl font-semibold text-[color:var(--text-primary)]">
              <AnimatedNumber value={stat.value} />
            </p>
            <p className="mt-3 text-sm text-[color:var(--text-secondary)]">{t("home.hero.badgeSecondary")}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card variant="glass" padding="lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-tertiary)]">{t("home.operationalLoop.title")}</p>
              <h3 className="mt-3 text-2xl font-semibold text-[color:var(--text-primary)]">{t("home.operationalLoop.headline")}</h3>
            </div>
            <Badge>{t("home.operationalLoop.badge")}</Badge>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-5">
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">{t("home.operationalLoop.memoryTitle")}</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">{t("home.operationalLoop.memoryDescription")}</p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-5">
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">{t("home.operationalLoop.assistantTitle")}</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">{t("home.operationalLoop.assistantDescription")}</p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-5">
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">{t("home.operationalLoop.variantsTitle")}</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">{t("home.operationalLoop.variantsDescription")}</p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-5">
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">{t("home.operationalLoop.renderTitle")}</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">{t("home.operationalLoop.renderDescription")}</p>
            </div>
          </div>
        </Card>

        <Card variant="panel" padding="lg">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-tertiary)]">{t("home.snapshot.title")}</p>
          <h3 className="mt-3 text-2xl font-semibold text-[color:var(--text-primary)]">{t("home.snapshot.headline")}</h3>
          <Separator className="my-5 bg-[color:var(--border)]" />
          <div className="space-y-4 text-sm text-[color:var(--text-secondary)]">
            <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4">
              <p className="font-medium text-[color:var(--text-primary)]">{t("home.snapshot.baseSummaryTitle")}</p>
              <p className="mt-2 leading-6">
                {resume.basics.summary ?? t("home.snapshot.baseSummaryEmpty")}
              </p>
            </div>
            <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4">
              <p className="font-medium text-[color:var(--text-primary)]">{t("home.snapshot.variantCoverageTitle")}</p>
              <p className="mt-2 leading-6">
                {variants.length > 0
                  ? t("home.snapshot.variantCoverageFilled", { count: variants.length })
                  : t("home.snapshot.variantCoverageEmpty")}
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
