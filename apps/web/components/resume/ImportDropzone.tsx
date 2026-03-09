"use client";

import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle2, FileJson2, FileText, Sparkles, UploadCloud } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Card } from "../ui/card";

export function ImportDropzone() {
  const [message, setMessage] = useState<string | null>(null);
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
        throw new Error(payload?.error ?? "Failed to import file.");
      }
      return response.json() as Promise<{ parse_report: { warnings: string[] } }>;
    },
    onSuccess: (data) => {
      const nextMessage =
        data.parse_report.warnings.length > 0
          ? `Imported with warnings: ${data.parse_report.warnings.join("; ")}`
          : "Import completed successfully.";
      setMessage(nextMessage);
      toast.success("Resume imported", {
        description: nextMessage,
      });
    },
    onError: (error) => {
      const nextMessage = error instanceof Error ? error.message : "Import failed.";
      setMessage(nextMessage);
      toast.error("Import failed", { description: nextMessage });
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
          className="relative rounded-[30px] border border-dashed border-violet-200 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_48%),rgba(255,255,255,0.78)] p-10 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:border-violet-400/30 dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_48%),rgba(255,255,255,0.04)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),transparent)]" />
          <input {...getInputProps()} />
          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
          <div className="flex size-20 items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,rgba(255,255,255,1),rgba(238,242,255,1))] shadow-[0_20px_50px_-20px_rgba(79,70,229,0.2)] ring-1 ring-violet-100 dark:bg-[linear-gradient(135deg,rgba(99,102,241,1),rgba(34,211,238,0.9))] dark:shadow-[0_26px_60px_-24px_rgba(79,70,229,0.8)] dark:ring-0">
            <UploadCloud className="size-9 text-violet-600 dark:text-white" />
          </div>
          <p className="mt-6 text-2xl font-semibold text-slate-950 dark:text-white">Drop your resume into the workspace</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Claimit will parse the file, initialize the base resume structure, and make the content available for
            achievements, assistant guidance, variants, and rendering.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <div className="rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-xs text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">PDF</div>
            <div className="rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-xs text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">DOCX</div>
            <div className="rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-xs text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">JSON</div>
            <div className="rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-xs text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">TXT</div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button className="min-w-[170px]" onClick={open} disabled={mutation.isPending}>
              {mutation.isPending ? "Importing..." : "Choose file"}
            </Button>
            <Button variant="secondary" onClick={open}>
              Drag and drop supported
            </Button>
          </div>
          <div className="mt-8 grid w-full gap-3 text-left md:grid-cols-3">
            <div className="rounded-[22px] border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-white/[0.05]">
              <Sparkles className="size-4 text-cyan-300" />
              <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">Structured parsing</p>
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Turns a legacy resume into vault-backed JSON.</p>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-white/[0.05]">
              <FileJson2 className="size-4 text-violet-300" />
              <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">Reusable facts</p>
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Feeds achievements, claims, and variants downstream.</p>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white/85 p-4 dark:border-white/10 dark:bg-white/[0.05]">
              <FileText className="size-4 text-emerald-300" />
              <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">Ready to refine</p>
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Move directly into assistant and render workflows.</p>
            </div>
          </div>
          </div>
        </div>
      </motion.div>
      {message ? (
        <div className="mt-4 flex items-start gap-3 rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-100">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>{message}</span>
        </div>
      ) : null}
    </Card>
  );
}
