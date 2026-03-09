import { gapAnalysis, initVault, loadBaseResume } from "@claimit/core";

import { GapAnalysisPanel } from "../../components/assistant/GapAnalysisPanel";

export default async function AssistantPage() {
  await initVault();
  const resume = await loadBaseResume();
  const result = await gapAnalysis(resume, { maxQuestions: 7 });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Assistant</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Fill the highest-impact gaps</h2>
      </div>
      <GapAnalysisPanel result={result} />
    </div>
  );
}
