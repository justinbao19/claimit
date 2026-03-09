"use client";

import { useState } from "react";

import { PDFPreview } from "./PDFPreview";
import { TemplateSelector } from "./TemplateSelector";

export function RenderWorkspace({ initialHtml }: { initialHtml: string }) {
  const [html, setHtml] = useState(initialHtml);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <TemplateSelector onHtmlChange={setHtml} />
      <PDFPreview html={html} />
    </div>
  );
}
