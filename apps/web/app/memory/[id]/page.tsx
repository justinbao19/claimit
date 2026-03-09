import { notFound } from "next/navigation";
import { initVault, loadBaseResume } from "@claimit/core";

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
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Achievement detail</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">{achievement.title}</h2>
      </div>
      <AchievementForm achievement={achievement} />
    </div>
  );
}
