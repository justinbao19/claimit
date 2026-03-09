"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

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
      setMessage(
        data.parse_report.warnings.length > 0
          ? `Imported with warnings: ${data.parse_report.warnings.join("; ")}`
          : "Import completed successfully.",
      );
    },
    onError: (error) => setMessage(error instanceof Error ? error.message : "Import failed."),
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
    <Card className="p-6">
      <div
        {...getRootProps()}
        className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center"
      >
        <input {...getInputProps()} />
        <p className="text-lg font-medium text-slate-900">Drop a PDF, DOCX, JSON, or TXT file here</p>
        <p className="mt-2 text-sm text-slate-500">The imported file will be parsed into the base resume.</p>
        <Button className="mt-6" onClick={open}>
          Choose file
        </Button>
      </div>
      {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
    </Card>
  );
}
