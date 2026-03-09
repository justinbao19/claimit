import { gapAnalysis, initVault, loadBaseResume } from "@claimit/core";

import { GapAnalysisPanel } from "../../components/assistant/GapAnalysisPanel";

function hasResumeContent(resume: Awaited<ReturnType<typeof loadBaseResume>>) {
  return Boolean(
    resume.basics.summary?.trim() ||
      resume.experience.length > 0 ||
      resume.projects.length > 0 ||
      resume.education.length > 0 ||
      resume.skills.some((category) => category.items.length > 0) ||
      resume.achievements.length > 0 ||
      resume.claims.length > 0,
  );
}

export default async function AssistantPage() {
  await initVault();
  const resume = await loadBaseResume();
  const result = await gapAnalysis(resume, { maxQuestions: 7 });
  const resumeHasContent = hasResumeContent(resume);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Assistant</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Fill the highest-impact gaps</h2>
      </div>
      <GapAnalysisPanel result={result} hasResumeContent={resumeHasContent} />
    </div>
  );
}
