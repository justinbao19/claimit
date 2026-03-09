"use client";

import { useState } from "react";
import { FileOutput, Wand2 } from "lucide-react";

import { Card } from "../ui/card";
import { PDFPreview } from "./PDFPreview";
import { TemplateSelector } from "./TemplateSelector";

export function RenderWorkspace({ initialHtml }: { initialHtml: string }) {
  const [html, setHtml] = useState(initialHtml);

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <div className="space-y-6">
        <TemplateSelector onHtmlChange={setHtml} />
        <Card variant="panel" padding="default">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 dark:bg-white/[0.06] dark:text-white">
              <FileOutput className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Output mindset</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Use the template layer to polish, not to fix missing facts.</p>
            </div>
          </div>
          <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
            Claimit works best when the base resume and variant data are already clean. The render studio then becomes a
            fast final-pass surface rather than a rescue workflow.
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <Card variant="panel" padding="default">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 dark:bg-white/[0.06] dark:text-white">
              <Wand2 className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Preview canvas</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Inspect the current document surface before exporting.</p>
            </div>
          </div>
        </Card>
        <PDFPreview html={html} />
      </div>
    </div>
  );
}
