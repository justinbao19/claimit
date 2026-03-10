"use client";

import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle2, FileJson2, FileText, Sparkles, UploadCloud } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useTranslations } from "../layout/locale-provider";

export function ImportDropzone() {
  const [message, setMessage] = useState<string | null>(null);
  const t = useTranslations();
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? t("importPage.dropzone.failed"));
      }
      return response.json() as Promise<{ parse_report: { warnings: string[] } }>;
    },
    onSuccess: (data) => {
      const nextMessage =
        data.parse_report.warnings.length > 0
          ? t("importPage.dropzone.completedWithWarnings", { warnings: data.parse_report.warnings.join("; ") })
          : t("importPage.dropzone.completed");
      setMessage(nextMessage);
      toast.success(t("importPage.dropzone.imported"), {
        description: nextMessage,
      });
    },
    onError: (error) => {
      const nextMessage = error instanceof Error ? error.message : t("importPage.dropzone.importFailed");
      setMessage(nextMessage);
      toast.error(t("importPage.dropzone.importFailed"), { description: nextMessage });
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        mutation.mutate(file);
      }
    },
    [mutation],
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    maxFiles: 1,
    noClick: true,
  });

  return (
    <Card variant="elevated" padding="lg" className="overflow-hidden">
      <motion.div whileHover={{ y: -4, scale: 1.005 }} transition={{ duration: 0.25, ease: "easeOut" }}>
        <div
          {...getRootProps()}
          className="relative rounded-[30px] border border-dashed border-[color:var(--field-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(246,238,228,0.96))] p-10 text-center shadow-[0_24px_64px_-34px_var(--shadow-color)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,162,123,0.14),transparent_48%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent)]" />
          <input {...getInputProps()} />
          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
            <div className="flex size-20 items-center justify-center rounded-[28px] bg-[linear-gradient(145deg,var(--accent-strong),var(--accent))] text-[color:var(--accent-contrast)] shadow-[0_22px_48px_-24px_rgba(112,82,56,0.5)]">
              <UploadCloud className="size-9" />
            </div>
            <p className="mt-6 text-2xl font-semibold text-[color:var(--text-primary)]">{t("importPage.dropzone.title")}</p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--text-secondary)]">{t("importPage.dropzone.description")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["PDF", "DOCX", "JSON", "TXT"].map((type) => (
                <div
                  key={type}
                  className="rounded-full border border-[color:var(--field-border)] bg-[color:var(--panel-strong)] px-3 py-1.5 text-xs text-[color:var(--text-secondary)] shadow-[0_10px_22px_-18px_var(--shadow-color)]"
                >
                  {type}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button className="min-w-[170px]" onClick={open} disabled={mutation.isPending}>
                {mutation.isPending ? t("importPage.dropzone.importing") : t("importPage.dropzone.chooseFile")}
              </Button>
              <Button variant="secondary" onClick={open}>
                {t("importPage.dropzone.dragSupported")}
              </Button>
            </div>
            <div className="mt-8 grid w-full gap-3 text-left md:grid-cols-3">
              <div className="rounded-[22px] border border-[color:var(--field-border)] bg-[color:var(--panel-strong)] p-4 shadow-[0_16px_32px_-24px_var(--shadow-color)]">
                <Sparkles className="size-4 text-[color:var(--accent)]" />
                <p className="mt-3 text-sm font-semibold text-[color:var(--text-primary)]">{t("importPage.dropzone.structuredParsingTitle")}</p>
                <p className="mt-2 text-xs leading-5 text-[color:var(--text-secondary)]">{t("importPage.dropzone.structuredParsingDescription")}</p>
              </div>
              <div className="rounded-[22px] border border-[color:var(--field-border)] bg-[color:var(--panel-strong)] p-4 shadow-[0_16px_32px_-24px_var(--shadow-color)]">
                <FileJson2 className="size-4 text-[color:var(--field-focus)]" />
                <p className="mt-3 text-sm font-semibold text-[color:var(--text-primary)]">{t("importPage.dropzone.reusableFactsTitle")}</p>
                <p className="mt-2 text-xs leading-5 text-[color:var(--text-secondary)]">{t("importPage.dropzone.reusableFactsDescription")}</p>
              </div>
              <div className="rounded-[22px] border border-[color:var(--field-border)] bg-[color:var(--panel-strong)] p-4 shadow-[0_16px_32px_-24px_var(--shadow-color)]">
                <FileText className="size-4 text-[color:var(--success)]" />
                <p className="mt-3 text-sm font-semibold text-[color:var(--text-primary)]">{t("importPage.dropzone.readyToRefineTitle")}</p>
                <p className="mt-2 text-xs leading-5 text-[color:var(--text-secondary)]">{t("importPage.dropzone.readyToRefineDescription")}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {message ? (
        <div className="mt-4 flex items-start gap-3 rounded-[22px] border border-[rgba(69,106,90,0.28)] bg-[rgba(69,106,90,0.12)] px-4 py-3 text-sm text-[color:var(--success)]">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>{message}</span>
        </div>
      ) : null}
    </Card>
  );
}
