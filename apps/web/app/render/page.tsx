import { initVault, loadBaseResume, renderToHtml } from "@claimit/core";
import { Palette } from "lucide-react";

import { PageIntro } from "../../components/layout/page-intro";
import { RenderWorkspace } from "../../components/render/RenderWorkspace";

export default async function RenderPage() {
  await initVault();
  const resume = await loadBaseResume();
  const initialHtml = await renderToHtml(resume, "ats_minimal").catch(() => "<html><body><p>Template preview unavailable.</p></body></html>");

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Render"
        title="Preview, polish, and export the final document"
        description="Switch templates, inspect the document surface, and produce an export-ready PDF without leaving the workspace."
        icon={Palette}
        badge="Template studio"
      />
      <RenderWorkspace initialHtml={initialHtml} />
    </div>
  );
}
