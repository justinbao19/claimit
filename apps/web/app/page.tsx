import Link from "next/link";
import { initVault, listVariants, loadBaseResume } from "@claimit/core";
import { ArrowRight, Bot, FileStack, FolderKanban, LayoutTemplate, Sparkles, Wand2 } from "lucide-react";

import { PageIntro } from "../components/layout/page-intro";
import { AnimatedNumber } from "../components/ui/animated-number";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

const workflow = [
  { label: "Import", icon: FileStack, description: "Parse resume files into structured memory." },
  { label: "Memory", icon: FolderKanban, description: "Capture facts, tags, tools, and supporting evidence." },
  { label: "Assistant", icon: Bot, description: "Identify weak spots and fill the highest-impact gaps." },
  { label: "Variants", icon: Wand2, description: "Tailor the resume toward role-specific narratives." },
  { label: "Render", icon: LayoutTemplate, description: "Preview polished templates and export instantly." },
];

export default async function HomePage() {
  await initVault();
  const [resume, variants] = await Promise.all([loadBaseResume(), listVariants()]);

  const stats = [
    { label: "Experience", value: resume.experience.length },
    { label: "Achievements", value: resume.achievements.length },
    { label: "Claims", value: resume.claims.length },
    { label: "Variants", value: variants.length },
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
        eyebrow="Workspace"
        title="Build a living resume system, not a static file"
        description={
          resume.basics.summary ??
          "Capture achievements, let the assistant expose weak spots, and turn your base resume into polished, role-specific variants with a smoother editing workflow."
        }
        icon={Sparkles}
        badge="Editor workspace"
      />

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <Card variant="elevated" padding="lg" className="overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-[42%] bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_50%),radial-gradient(circle_at_bottom,rgba(139,92,246,0.12),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_50%),radial-gradient(circle_at_bottom,rgba(139,92,246,0.18),transparent_55%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="accent">AI-assisted editing</Badge>
                <Badge>Vault-backed data</Badge>
              </div>
              <div className="max-w-3xl space-y-4">
                <h3 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                  Claimit keeps your achievements structured, adaptable, and always export-ready.
                </h3>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                  Move fluidly from import, to memory capture, to assistant gap-fill, to tailored variants and final
                  render, without losing the factual backbone behind every bullet.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/import">
                    Import resume
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/assistant">Run assistant</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-5">
              {workflow.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-slate-200 bg-white/75 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] dark:border-white/10 dark:bg-white/[0.05] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-white/[0.08] dark:text-white">
                        <Icon className="size-4" />
                      </div>
                      <span className="text-[11px] font-medium text-slate-500">0{index + 1}</span>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">{item.label}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.description}</p>
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
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Workspace health</p>
                <div className="mt-3 flex items-end gap-3">
                  <span className="text-5xl font-semibold text-slate-950 dark:text-white">
                    <AnimatedNumber value={workspaceHealth} />
                  </span>
                  <span className="pb-2 text-sm text-slate-500 dark:text-slate-400">/ 100</span>
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                Healthy editing flow
              </div>
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(56,189,248,0.95),rgba(139,92,246,0.95))]"
                style={{ width: `${workspaceHealth}%` }}
              />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Current base resume</p>
                <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{resume.basics.name}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {resume.experience.length > 0
                    ? `${resume.experience.length} experience entries are connected to the vault.`
                    : "No experience entries imported yet."}
                </p>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Recommended next step</p>
                <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                  {resume.achievements.length === 0 ? "Start capturing achievements" : "Tailor a new variant"}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {resume.achievements.length === 0
                    ? "Turn raw experience bullets into structured, reusable facts."
                    : "Use the existing memory layer to create a job-specific narrative."}
                </p>
              </div>
            </div>
          </Card>

          <Card variant="panel" padding="lg">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Quick access</p>
            <div className="mt-5 space-y-3">
              <Link
                href="/memory"
                className="flex items-center justify-between rounded-[22px] border border-slate-200/80 bg-white px-4 py-4 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
              >
                <span>Open achievements library</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/variants"
                className="flex items-center justify-between rounded-[22px] border border-slate-200/80 bg-white px-4 py-4 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
              >
                <span>Create targeted variants</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/render"
                className="flex items-center justify-between rounded-[22px] border border-slate-200/80 bg-white px-4 py-4 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
              >
                <span>Preview final output</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} variant="interactive" padding="default">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">{stat.label}</p>
            <p className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white">
              <AnimatedNumber value={stat.value} />
            </p>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Structured and ready for downstream editing and rendering.</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card variant="glass" padding="lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Operational loop</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Your editing workflow, organized as a system</h3>
            </div>
            <Badge>Always-ready output</Badge>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Memory layer</p>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Capture achievements once, then reuse them across different role narratives, claims, and export formats.
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Assistant guidance</p>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Surface gaps in metrics, scope, and clarity before a resume variant goes out the door.
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Role variants</p>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Reframe the same factual record for different jobs without rewriting from scratch.
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Render pipeline</p>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Move from structured JSON to polished ATS-friendly output with minimal formatting friction.
              </p>
            </div>
          </div>
        </Card>

        <Card variant="panel" padding="lg">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Workspace snapshot</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-900">What is already in motion</h3>
          <Separator className="my-5 bg-slate-200/80" />
          <div className="space-y-4 text-sm text-slate-600">
            <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 p-4">
              <p className="font-medium text-slate-900">Base summary</p>
              <p className="mt-2 leading-6">
                {resume.basics.summary ?? "No summary yet. Use the assistant to transform your experience into a sharper narrative."}
              </p>
            </div>
            <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 p-4">
              <p className="font-medium text-slate-900">Variant coverage</p>
              <p className="mt-2 leading-6">
                {variants.length > 0
                  ? `${variants.length} tailored variants are saved and ready for refinement.`
                  : "No variants yet. Create one once the base resume is stable."}
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
