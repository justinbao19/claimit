"use client";

import { useState } from "react";
import { FileOutput, Wand2 } from "lucide-react";

import { useTranslations } from "../layout/locale-provider";
import { Card } from "../ui/card";
import { PDFPreview } from "./PDFPreview";
import { TemplateSelector } from "./TemplateSelector";

export function RenderWorkspace({ initialHtml }: { initialHtml: string }) {
  const [html, setHtml] = useState(initialHtml);
  const t = useTranslations();

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <div className="space-y-6">
        <TemplateSelector onHtmlChange={setHtml} />
        <Card variant="panel" padding="default">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[color:var(--surface)] text-[color:var(--text-primary)]">
              <FileOutput className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-[color:var(--text-primary)]">{t("render.workspace.outputMindsetTitle")}</p>
              <p className="text-sm text-[color:var(--text-secondary)]">{t("render.workspace.outputMindsetDescription")}</p>
            </div>
          </div>
          <div className="mt-4 rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4 text-sm leading-6 text-[color:var(--text-secondary)]">
            {t("render.workspace.outputMindsetBody")}
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <Card variant="panel" padding="default">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[color:var(--surface)] text-[color:var(--text-primary)]">
              <Wand2 className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-[color:var(--text-primary)]">{t("render.workspace.previewCanvasTitle")}</p>
              <p className="text-sm text-[color:var(--text-secondary)]">{t("render.workspace.previewCanvasDescription")}</p>
            </div>
          </div>
        </Card>
        <PDFPreview html={html} />
      </div>
    </div>
  );
}
