"use client";

import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Download, Eye, LayoutTemplate, WandSparkles } from "lucide-react";
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

const templates = ["ats_minimal", "modern_clean", "creative_dynamic"] as const;
type TemplateId = (typeof templates)[number];

const templateMeta: Record<
  TemplateId,
  {
    titleKey: string;
    descriptionKey: string;
    accentClassName: string;
  }
> = {
  ats_minimal: {
    titleKey: "render.templateSelector.atsTitle",
    descriptionKey: "render.templateSelector.atsDescription",
    accentClassName: "bg-slate-800",
  },
  modern_clean: {
    titleKey: "render.templateSelector.modernTitle",
    descriptionKey: "render.templateSelector.modernDescription",
    accentClassName: "bg-sky-700",
  },
  creative_dynamic: {
    titleKey: "render.templateSelector.creativeTitle",
    descriptionKey: "render.templateSelector.creativeDescription",
    accentClassName: "bg-[#ff7f7f]",
  },
};

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
    onSuccess: (data, template) => {
      onHtmlChange(data.html);
      setMessage(t("render.templateSelector.previewUpdatedMessage"));
      toast.success(t("render.templateSelector.previewUpdatedToastTitle"), {
        description: t("render.templateSelector.previewUpdatedToastDescription", {
          template: t(templateMeta[template as TemplateId].titleKey),
        }),
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

        <Tabs
          value={selectedTemplate}
          onValueChange={(value) => {
            const nextTemplate = value as TemplateId;
            setSelectedTemplate(nextTemplate);
            previewMutation.mutate(nextTemplate);
          }}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-1 gap-3 border-0 bg-transparent p-0 shadow-none sm:grid-cols-2 xl:grid-cols-1">
            {templates.map((template) => (
              <TabsTrigger
                key={template}
                value={template}
                className="h-auto min-w-0 flex-col items-start justify-start gap-3 rounded-[24px] border border-[color:var(--field-border)] bg-[color:var(--surface-elevated)] p-4 text-left text-[color:var(--text-primary)] shadow-[0_16px_32px_-24px_var(--shadow-color)] transition-all hover:border-[color:var(--border-strong)] hover:bg-[color:var(--panel)] data-[state=active]:border-[rgba(164,118,61,0.38)] data-[state=active]:bg-[color:var(--panel)] data-[state=active]:shadow-[0_22px_44px_-28px_var(--shadow-color)]"
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">{t(templateMeta[template].titleKey)}</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-tertiary)]">
                      {template.replaceAll("_", " ")}
                    </p>
                  </div>
                  <CheckCircle2
                    className={`size-4 transition-opacity ${
                      selectedTemplate === template ? "opacity-100 text-[rgba(164,118,61,0.92)]" : "opacity-0"
                    }`}
                  />
                </div>
                <div className="flex w-full items-center justify-between gap-3">
                  <p className="line-clamp-2 text-xs leading-5 text-[color:var(--text-secondary)]">
                    {t(templateMeta[template].descriptionKey)}
                  </p>
                  <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${templateMeta[template].accentClassName}`} />
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          {templates.map((template) => (
            <TabsContent key={template} value={template}>
              <div className="rounded-[24px] border border-[color:var(--field-border)] bg-[color:var(--surface-elevated)] p-4 shadow-[0_16px_32px_-24px_var(--shadow-color)]">
                <p className="text-sm font-medium text-[color:var(--text-primary)]">{t(templateMeta[template].titleKey)}</p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">
                  {t(templateMeta[template].descriptionKey)}
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
