import { initVault, loadBaseResume, renderToHtml } from "@claimit/core";

import { RenderWorkspace } from "../../components/render/RenderWorkspace";

export default async function RenderPage() {
  await initVault();
  const resume = await loadBaseResume();
  const initialHtml = await renderToHtml(resume, "ats_minimal").catch(() => "<html><body><p>Template preview unavailable.</p></body></html>");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Render</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Preview and export</h2>
      </div>
      <RenderWorkspace initialHtml={initialHtml} />
    </div>
  );
}
