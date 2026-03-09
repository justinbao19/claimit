"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { apiFetch } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface TemplateSelectorProps {
  initialTemplate?: string;
  variant?: string;
  onHtmlChange: (html: string) => void;
}

const templates = ["ats_minimal", "modern_clean"] as const;

export function TemplateSelector({ initialTemplate = "ats_minimal", variant, onHtmlChange }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [message, setMessage] = useState<string | null>(null);

  const previewMutation = useMutation({
    mutationFn: async (template: string) =>
      apiFetch<{ html: string }>("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, variant }),
      }),
    onSuccess: (data) => {
      onHtmlChange(data.html);
      setMessage("Preview updated.");
    },
    onError: (error) => setMessage(error instanceof Error ? error.message : "Could not render preview."),
  });

  const exportMutation = useMutation({
    mutationFn: async () =>
      apiFetch<{ path: string }>("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: selectedTemplate, variant }),
      }),
    onSuccess: (data) => setMessage(`Exported PDF to ${data.path}`),
    onError: (error) => setMessage(error instanceof Error ? error.message : "Could not export PDF."),
  });

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Templates</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {templates.map((template) => (
              <button
                key={template}
                type="button"
                className={`rounded-md border px-4 py-2 text-sm ${
                  selectedTemplate === template ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700"
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                {template}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => previewMutation.mutate(selectedTemplate)} disabled={previewMutation.isPending}>
            Update preview
          </Button>
          <Button variant="secondary" onClick={() => exportMutation.mutate()} disabled={exportMutation.isPending}>
            Export PDF
          </Button>
        </div>
        {message ? <p className="text-sm text-slate-500">{message}</p> : null}
      </div>
    </Card>
  );
}
