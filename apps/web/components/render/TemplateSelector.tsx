"use client";

import { useMutation } from "@tanstack/react-query";
import { Download, Eye, LayoutTemplate, WandSparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { apiFetch } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

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
      toast.success("Preview updated", {
        description: `Template ${selectedTemplate} is now active.`,
      });
    },
    onError: (error) => {
      const nextMessage = error instanceof Error ? error.message : "Could not render preview.";
      setMessage(nextMessage);
      toast.error("Preview failed", { description: nextMessage });
    },
  });

  const exportMutation = useMutation({
    mutationFn: async () =>
      apiFetch<{ path: string }>("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: selectedTemplate, variant }),
      }),
    onSuccess: (data) => {
      setMessage(`Exported PDF to ${data.path}`);
      toast.success("PDF exported", { description: data.path });
    },
    onError: (error) => {
      const nextMessage = error instanceof Error ? error.message : "Could not export PDF.";
      setMessage(nextMessage);
      toast.error("Export failed", { description: nextMessage });
    },
  });

  return (
    <Card variant="elevated" padding="lg" className="lg:sticky lg:top-32">
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge variant="accent">Template controls</Badge>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">Switch the document presentation</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Use the preview loop to compare templates, then export a PDF once the layout feels right.
              </p>
            </div>
            <div className="flex size-14 items-center justify-center rounded-[22px] bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-white">
              <LayoutTemplate className="size-6" />
            </div>
          </div>
        </div>

        <Tabs value={selectedTemplate} onValueChange={setSelectedTemplate} className="space-y-4">
          <TabsList className="w-full">
            {templates.map((template) => (
              <TabsTrigger key={template} value={template} className="flex-1">
                {template}
              </TabsTrigger>
            ))}
          </TabsList>
          {templates.map((template) => (
            <TabsContent key={template} value={template}>
              <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{template === "ats_minimal" ? "ATS Minimal" : "Modern Clean"}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {template === "ats_minimal"
                    ? "Best for crisp, ATS-oriented formatting with a straightforward hierarchy."
                    : "Best for a cleaner document surface with slightly more visual warmth."}
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="grid gap-3">
          <Button onClick={() => previewMutation.mutate(selectedTemplate)} disabled={previewMutation.isPending}>
            <Eye className="size-4" />
            {previewMutation.isPending ? "Updating preview" : "Update preview"}
          </Button>
          <Button variant="secondary" onClick={() => exportMutation.mutate()} disabled={exportMutation.isPending}>
            <Download className="size-4" />
            {exportMutation.isPending ? "Exporting PDF" : "Export PDF"}
          </Button>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <WandSparkles className="size-4" />
            <p className="text-sm font-medium">Render notes</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Keep variants factual, then use render to tune presentation rather than rewriting content at the last step.
          </p>
        </div>

        {message ? <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p> : null}
      </div>
    </Card>
  );
}
