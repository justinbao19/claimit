import { notFound } from "next/navigation";
import { initVault, loadBaseResume } from "@claimit/core";
import { PencilLine } from "lucide-react";

import { PageIntro } from "../../../components/layout/page-intro";
import { AchievementForm } from "../../../components/resume/AchievementForm";
import { getServerI18n } from "../../../lib/i18n";

export default async function MemoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await initVault();
  const { id } = await params;
  const resume = await loadBaseResume();
  const { t } = await getServerI18n();
  const achievement = resume.achievements.find((item) => item.id === id);

  if (!achievement) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow={t("memoryPage.detail.eyebrow")}
        title={achievement.title}
        description={t("memoryPage.detail.description")}
        icon={PencilLine}
        badge={t("memoryPage.detail.badge")}
      />
      <AchievementForm achievement={achievement} />
    </div>
  );
}
