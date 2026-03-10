"use client";

import { useMutation } from "@tanstack/react-query";
import { Download, Eye, LayoutTemplate, WandSparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { apiFetch } from "../../lib/utils";
import { useTranslations } from "../layout/locale-provider";
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
  const t = useTranslations();

  const previewMutation = useMutation({
    mutationFn: async (template: string) =>
      apiFetch<{ html: string }>("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, variant }),
      }),
    onSuccess: (data) => {
      onHtmlChange(data.html);
      setMessage(t("render.templateSelector.previewUpdatedMessage"));
      toast.success(t("render.templateSelector.previewUpdatedToastTitle"), {
        description: t("render.templateSelector.previewUpdatedToastDescription", { template: selectedTemplate }),
      });
    },
    onError: (error) => {
      const nextMessage = error instanceof Error ? error.message : t("render.templateSelector.previewFailed");
      setMessage(nextMessage);
      toast.error(t("render.templateSelector.previewFailedToastTitle"), { description: nextMessage });
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
      setMessage(t("render.templateSelector.exportedMessage", { path: data.path }));
      toast.success(t("render.templateSelector.exportedToastTitle"), { description: data.path });
    },
    onError: (error) => {
      const nextMessage = error instanceof Error ? error.message : t("render.templateSelector.exportFailed");
      setMessage(nextMessage);
      toast.error(t("render.templateSelector.exportFailedToastTitle"), { description: nextMessage });
    },
  });

  return (
    <Card variant="elevated" padding="lg" className="lg:sticky lg:top-32">
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge variant="accent">{t("render.templateSelector.badge")}</Badge>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-[color:var(--text-primary)]">{t("render.templateSelector.title")}</h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">{t("render.templateSelector.description")}</p>
            </div>
            <div className="flex size-14 items-center justify-center rounded-[22px] bg-[color:var(--surface)] text-[color:var(--text-primary)]">
              <LayoutTemplate className="size-6" />
            </div>
          </div>
        </div>

        <Tabs value={selectedTemplate} onValueChange={setSelectedTemplate} className="space-y-4">
          <TabsList className="w-full">
            {templates.map((template) => (
              <TabsTrigger key={template} value={template} className="flex-1">
                {template === "ats_minimal" ? t("render.templateSelector.atsTitle") : t("render.templateSelector.modernTitle")}
              </TabsTrigger>
            ))}
          </TabsList>
          {templates.map((template) => (
            <TabsContent key={template} value={template}>
              <div className="rounded-[24px] border border-[color:var(--field-border)] bg-[color:var(--surface-elevated)] p-4 shadow-[0_16px_32px_-24px_var(--shadow-color)]">
                <p className="text-sm font-medium text-[color:var(--text-primary)]">
                  {template === "ats_minimal" ? t("render.templateSelector.atsTitle") : t("render.templateSelector.modernTitle")}
                </p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">
                  {template === "ats_minimal"
                    ? t("render.templateSelector.atsDescription")
                    : t("render.templateSelector.modernDescription")}
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="grid gap-3">
          <Button onClick={() => previewMutation.mutate(selectedTemplate)} disabled={previewMutation.isPending}>
            <Eye className="size-4" />
            {previewMutation.isPending ? t("render.templateSelector.updatingButton") : t("render.templateSelector.updateButton")}
          </Button>
          <Button variant="secondary" onClick={() => exportMutation.mutate()} disabled={exportMutation.isPending}>
            <Download className="size-4" />
            {exportMutation.isPending ? t("render.templateSelector.exportingButton") : t("render.templateSelector.exportButton")}
          </Button>
        </div>

        <div className="rounded-[24px] border border-[color:var(--field-border)] bg-[color:var(--surface-elevated)] p-4 shadow-[0_16px_32px_-24px_var(--shadow-color)]">
          <div className="flex items-center gap-2 text-[color:var(--text-primary)]">
            <WandSparkles className="size-4" />
            <p className="text-sm font-medium">{t("render.templateSelector.renderNotesTitle")}</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">{t("render.templateSelector.renderNotesBody")}</p>
        </div>

        {message ? <p className="rounded-2xl border border-[color:var(--field-border)] bg-[color:var(--panel)] px-4 py-3 text-sm text-[color:var(--text-secondary)]">{message}</p> : null}
      </div>
    </Card>
  );
}
