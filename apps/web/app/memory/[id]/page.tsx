import { notFound } from "next/navigation";
import { initVault, loadBaseResume } from "@claimit/core";
import { PencilLine } from "lucide-react";

import { PageIntro } from "../../../components/layout/page-intro";
import { AchievementForm } from "../../../components/resume/AchievementForm";

export default async function MemoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await initVault();
  const { id } = await params;
  const resume = await loadBaseResume();
  const achievement = resume.achievements.find((item) => item.id === id);

  if (!achievement) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Achievement detail"
        title={achievement.title}
        description="Tighten wording, tag the achievement more precisely, and keep the underlying fact strong enough to power variants and final claims."
        icon={PencilLine}
        badge="Edit memory item"
      />
      <AchievementForm achievement={achievement} />
    </div>
  );
}
