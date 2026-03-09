import { gapAnalysis, initVault, loadBaseResume } from "@claimit/core";
import { Bot } from "lucide-react";

import { PageIntro } from "../../components/layout/page-intro";
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
      <PageIntro
        eyebrow="Assistant"
        title="Let the AI editor expose the weak spots"
        description="The assistant reviews the current resume, spots gaps in impact, scope, and clarity, then helps you tighten the story without changing the underlying facts."
        icon={Bot}
        badge={`${result.questions.length} prompts`}
      />
      <GapAnalysisPanel result={result} hasResumeContent={resumeHasContent} />
    </div>
  );
}
