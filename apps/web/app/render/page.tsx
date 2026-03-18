import { initVault, renderToHtml } from "@claimit/core";
import { Palette } from "lucide-react";

import { PageIntro } from "../../components/layout/page-intro";
import { RenderWorkspace } from "../../components/render/RenderWorkspace";
import { getServerI18n } from "../../lib/i18n";
import { loadPreviewResume } from "../../lib/preview-resume";

export default async function RenderPage() {
  await initVault();
  const resume = await loadPreviewResume();
  const { t } = await getServerI18n();
  const initialHtml = await renderToHtml(resume, "ats_minimal").catch(
    () => `<html><body><p>${t("render.pdfPreview.title")}</p></body></html>`,
  );

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow={t("render.intro.eyebrow")}
        title={t("render.intro.title")}
        description={t("render.intro.description")}
        icon={Palette}
        badge={t("render.intro.badge")}
      />
      <RenderWorkspace initialHtml={initialHtml} />
    </div>
  );
}
