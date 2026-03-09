import { initVault, loadBaseResume } from "@claimit/core";
import { FolderKanban, LibraryBig } from "lucide-react";

import { PageIntro } from "../../components/layout/page-intro";
import { AchievementCard } from "../../components/resume/AchievementCard";
import { AchievementForm } from "../../components/resume/AchievementForm";
import { ResumePreview } from "../../components/resume/ResumePreview";
import { EmptyState } from "../../components/ui/empty-state";
import { getServerI18n } from "../../lib/i18n";

export default async function MemoryPage() {
  await initVault();
  const resume = await loadBaseResume();
  const { t } = await getServerI18n();

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow={t("memoryPage.intro.eyebrow")}
        title={t("memoryPage.intro.title")}
        description={t("memoryPage.intro.description")}
        icon={FolderKanban}
        badge={t("memoryPage.intro.badge", { count: resume.achievements.length })}
      />

      <div className="grid gap-6 xl:grid-cols-[460px_1fr]">
        <div className="space-y-6">
          <AchievementForm />
          {resume.achievements.length === 0 ? (
            <EmptyState
              icon={LibraryBig}
              title={t("memoryPage.empty.title")}
              description={t("memoryPage.empty.description")}
            />
          ) : (
            <div className="space-y-4">
              {resume.achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          )}
        </div>
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}
