"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";

import { useTranslations } from "../layout/locale-provider";
import { Card } from "../ui/card";

export function PhotoUploadCard({ onUpload }: { onUpload?: () => void }) {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setLoading(true);
    try {
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
      setFileName(file.name);

      const form = new FormData();
      form.append("photo", file);
      const res = await fetch("/api/photo", { method: "POST", body: form });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Upload failed");
      }
      onUpload?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setPreview(null);
      setFileName(null);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  function clear() {
    setPreview(null);
    setFileName(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <Card variant="panel" padding="default">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-[color:var(--surface)] text-[color:var(--text-primary)]">
          <ImageIcon className="size-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-[color:var(--text-primary)]">{t("render.photo.title")}</p>
          <p className="text-sm text-[color:var(--text-secondary)]">{t("render.photo.description")}</p>
        </div>
      </div>

      <div className="mt-4">
        {preview ? (
          <div className="relative flex items-center gap-3 rounded-[16px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-3">
            <img src={preview} alt="avatar" className="size-12 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[color:var(--text-primary)]">{fileName}</p>
              <p className="text-xs text-[color:var(--success)]">{t("render.photo.uploaded")}</p>
            </div>
            <button
              type="button"
              onClick={clear}
              className="rounded-lg p-1 text-[color:var(--text-tertiary)] hover:bg-[color:var(--surface)] hover:text-[color:var(--text-primary)]"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-[16px] border border-dashed border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-4 py-5 text-center transition hover:border-[color:var(--field-border)] hover:bg-[color:var(--surface)]"
          >
            {loading ? (
              <Loader2 className="size-6 animate-spin text-[color:var(--text-tertiary)]" />
            ) : (
              <UploadCloud className="size-6 text-[color:var(--text-tertiary)]" />
            )}
            <p className="text-xs text-[color:var(--text-secondary)]">
              {loading ? t("render.photo.uploading") : t("render.photo.prompt")}
            </p>
          </div>
        )}
        {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleChange} />
      </div>
    </Card>
  );
}
