import { gapAnalysis, initVault, loadBaseResume } from "@claimit/core";
import { Bot } from "lucide-react";

import { PageIntro } from "../../components/layout/page-intro";
import { GapAnalysisPanel } from "../../components/assistant/GapAnalysisPanel";
import { getServerI18n } from "../../lib/i18n";

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
  const { t } = await getServerI18n();
  const resumeHasContent = hasResumeContent(resume);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow={t("assistant.intro.eyebrow")}
        title={t("assistant.intro.title")}
        description={t("assistant.intro.description")}
        icon={Bot}
        badge={t("assistant.intro.badge", { count: result.questions.length })}
      />
      <GapAnalysisPanel result={result} hasResumeContent={resumeHasContent} />
    </div>
  );
}
