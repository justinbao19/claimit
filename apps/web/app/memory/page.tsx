import { initVault, loadBaseResume } from "@claimit/core";
import { FolderKanban, LibraryBig } from "lucide-react";

import { PageIntro } from "../../components/layout/page-intro";
import { AchievementCard } from "../../components/resume/AchievementCard";
import { AchievementForm } from "../../components/resume/AchievementForm";
import { ResumePreview } from "../../components/resume/ResumePreview";
import { EmptyState } from "../../components/ui/empty-state";

export default async function MemoryPage() {
  await initVault();
  const resume = await loadBaseResume();

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Memory"
        title="Turn raw work into a reusable fact library"
        description="The memory layer is where achievements become structured building blocks. Capture them cleanly and reuse them across assistant suggestions, variants, and final resume bullets."
        icon={FolderKanban}
        badge={`${resume.achievements.length} facts`}
      />

      <div className="grid gap-6 xl:grid-cols-[460px_1fr]">
        <div className="space-y-6">
          <AchievementForm />
          {resume.achievements.length === 0 ? (
            <EmptyState
              icon={LibraryBig}
              title="Your achievement library is empty"
              description="Add one or import a resume first. Once the library has signal, Claimit can produce better suggestions and stronger variants."
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
