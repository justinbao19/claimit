import type { Resume } from "@claimit/core";

import { Card } from "../ui/card";
import { ExperienceSection } from "./ExperienceSection";
import { SkillsSection } from "./SkillsSection";

export function ResumePreview({ resume }: { resume: Resume }) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold text-slate-900">{resume.basics.name}</h2>
        <p className="mt-2 text-sm text-slate-600">
          {[resume.basics.email, resume.basics.phone, resume.basics.location].filter(Boolean).join(" · ")}
        </p>
        {resume.basics.summary ? <p className="mt-4 text-sm text-slate-700">{resume.basics.summary}</p> : null}
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Experience</h3>
        <ExperienceSection experience={resume.experience} />
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Skills</h3>
        <SkillsSection skills={resume.skills} />
      </Card>
    </div>
  );
}
