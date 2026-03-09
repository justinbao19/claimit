import type { Resume } from "@claimit/core";
import { Mail, MapPin, Phone } from "lucide-react";

import { Card } from "../ui/card";
import { ExperienceSection } from "./ExperienceSection";
import { SkillsSection } from "./SkillsSection";

export function ResumePreview({ resume }: { resume: Resume }) {
  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Resume preview</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{resume.basics.name}</h2>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
            Base resume
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
          {resume.basics.email ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.04]">
              <Mail className="size-4" />
              {resume.basics.email}
            </span>
          ) : null}
          {resume.basics.phone ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.04]">
              <Phone className="size-4" />
              {resume.basics.phone}
            </span>
          ) : null}
          {resume.basics.location ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.04]">
              <MapPin className="size-4" />
              {resume.basics.location}
            </span>
          ) : null}
        </div>
        {resume.basics.summary ? <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">{resume.basics.summary}</p> : null}
      </Card>

      <Card variant="glass" padding="lg">
        <h3 className="mb-4 text-lg font-semibold text-slate-950 dark:text-white">Experience</h3>
        <ExperienceSection experience={resume.experience} />
      </Card>

      <Card variant="glass" padding="lg">
        <h3 className="mb-4 text-lg font-semibold text-slate-950 dark:text-white">Skills</h3>
        <SkillsSection skills={resume.skills} />
      </Card>
    </div>
  );
}
