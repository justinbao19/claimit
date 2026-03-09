"use client";

import { Card } from "../ui/card";
import { useTranslations } from "../layout/locale-provider";

export function PDFPreview({ html }: { html: string }) {
  const t = useTranslations();

  return (
    <Card variant="glass" className="overflow-hidden">
      <div className="border-b border-[color:var(--border)] px-6 py-4">
        <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{t("render.pdfPreview.title")}</h3>
        <p className="mt-1 text-sm text-[color:var(--text-secondary)]">{t("render.pdfPreview.description")}</p>
      </div>
      <div className="bg-[linear-gradient(180deg,rgba(252,250,246,0.86),rgba(255,255,255,0.92))] p-5 dark:bg-[linear-gradient(180deg,rgba(23,27,31,0.92),rgba(17,20,23,0.96))]">
        <div className="rounded-[30px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          <div className="mb-4 flex items-center gap-2">
            <span className="size-3 rounded-full bg-[rgba(164,118,61,0.55)]" />
            <span className="size-3 rounded-full bg-[rgba(138,104,70,0.5)]" />
            <span className="size-3 rounded-full bg-[rgba(69,106,90,0.55)]" />
          </div>
          <iframe
            title={t("render.pdfPreview.iframeTitle")}
            className="h-[900px] w-full rounded-[24px] bg-white"
            srcDoc={html}
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </Card>
  );
}
