"use client";

import type { Resume } from "@claimit/core";
import { Mail, MapPin, Phone } from "lucide-react";

import { useTranslations } from "../layout/locale-provider";
import { Card } from "../ui/card";
import { ExperienceSection } from "./ExperienceSection";
import { SkillsSection } from "./SkillsSection";

export function ResumePreview({ resume }: { resume: Resume }) {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text-tertiary)]">{t("memoryPage.preview.eyebrow")}</p>
            <h2 className="mt-3 text-3xl font-semibold text-[color:var(--text-primary)]">{resume.basics.name}</h2>
          </div>
          <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-4 py-3 text-xs text-[color:var(--text-secondary)]">
            {t("memoryPage.preview.badge")}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[color:var(--text-secondary)]">
          {resume.basics.email ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-3 py-1.5">
              <Mail className="size-4" />
              {resume.basics.email}
            </span>
          ) : null}
          {resume.basics.phone ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-3 py-1.5">
              <Phone className="size-4" />
              {resume.basics.phone}
            </span>
          ) : null}
          {resume.basics.location ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-3 py-1.5">
              <MapPin className="size-4" />
              {resume.basics.location}
            </span>
          ) : null}
        </div>
        {resume.basics.summary ? <p className="mt-5 text-sm leading-7 text-[color:var(--text-secondary)]">{resume.basics.summary}</p> : null}
      </Card>

      <Card variant="glass" padding="lg">
        <h3 className="mb-4 text-lg font-semibold text-[color:var(--text-primary)]">{t("memoryPage.preview.experience")}</h3>
        <ExperienceSection experience={resume.experience} />
      </Card>

      <Card variant="glass" padding="lg">
        <h3 className="mb-4 text-lg font-semibold text-[color:var(--text-primary)]">{t("memoryPage.preview.skills")}</h3>
        <SkillsSection skills={resume.skills} />
      </Card>
    </div>
  );
}
