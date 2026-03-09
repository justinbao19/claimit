import { initVault, loadBaseResume } from "@claimit/core";

import { AchievementCard } from "../../components/resume/AchievementCard";
import { AchievementForm } from "../../components/resume/AchievementForm";
import { ResumePreview } from "../../components/resume/ResumePreview";

export default async function MemoryPage() {
  await initVault();
  const resume = await loadBaseResume();

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Memory</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Achievements and facts</h2>
        </div>
        <AchievementForm />
        <div className="space-y-4">
          {resume.achievements.length === 0 ? (
            <p className="text-sm text-slate-500">No achievements yet.</p>
          ) : (
            resume.achievements.map((achievement) => <AchievementCard key={achievement.id} achievement={achievement} />)
          )}
        </div>
      </div>
      <ResumePreview resume={resume} />
    </div>
  );
}
