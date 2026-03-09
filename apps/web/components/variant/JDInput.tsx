"use client";

import { useMutation } from "@tanstack/react-query";
import { BriefcaseBusiness, FileText, Sparkles, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { apiFetch } from "../../lib/utils";
import { useTranslations } from "../layout/locale-provider";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function JDInput() {
  const router = useRouter();
  const t = useTranslations();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () =>
      apiFetch<{ variant: { variant_meta: { name: string } } }>("/api/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, jd }),
      }),
    onSuccess: (data) => {
      const variantName = data.variant.variant_meta.name;
      setMessage(t("variants.builder.createdMessage", { name: variantName }));
      toast.success(t("variants.builder.createdToastTitle"), {
        description: t("variants.builder.createdToastDescription", { name: variantName }),
      });
      router.push(`/variants/${variantName}`);
      router.refresh();
    },
    onError: (error) => {
      const nextMessage = error instanceof Error ? error.message : t("variants.builder.failed");
      setMessage(nextMessage);
      toast.error(t("variants.builder.failedToastTitle"), { description: nextMessage });
    },
  });

  return (
    <Card variant="elevated" padding="lg">
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge variant="accent">{t("variants.builder.badge")}</Badge>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-[color:var(--text-primary)]">{t("variants.builder.title")}</h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[color:var(--text-secondary)]">{t("variants.builder.description")}</p>
            </div>
            <div className="flex size-14 items-center justify-center rounded-[22px] bg-[color:var(--surface)] text-[color:var(--text-primary)]">
              <WandSparkles className="size-6" />
            </div>
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-[color:var(--text-primary)]">{t("variants.builder.nameLabel")}</p>
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder={t("variants.builder.namePlaceholder")} />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-[color:var(--text-primary)]">{t("variants.builder.roleLabel")}</p>
          <Input value={role} onChange={(event) => setRole(event.target.value)} placeholder={t("variants.builder.rolePlaceholder")} />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-[color:var(--text-primary)]">{t("variants.builder.jdLabel")}</p>
          <Textarea rows={8} value={jd} onChange={(event) => setJd(event.target.value)} placeholder={t("variants.builder.jdPlaceholder")} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-overlay)] p-4">
            <BriefcaseBusiness className="size-4 text-[color:var(--field-focus)]" />
            <p className="mt-3 text-sm font-medium text-[color:var(--text-primary)]">{t("variants.builder.roleFitTitle")}</p>
            <p className="mt-2 text-xs leading-5 text-[color:var(--text-secondary)]">{t("variants.builder.roleFitDescription")}</p>
          </div>
          <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-overlay)] p-4">
            <FileText className="size-4 text-[color:var(--accent)]" />
            <p className="mt-3 text-sm font-medium text-[color:var(--text-primary)]">{t("variants.builder.keywordSignalTitle")}</p>
            <p className="mt-2 text-xs leading-5 text-[color:var(--text-secondary)]">{t("variants.builder.keywordSignalDescription")}</p>
          </div>
          <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-overlay)] p-4">
            <Sparkles className="size-4 text-[color:var(--success)]" />
            <p className="mt-3 text-sm font-medium text-[color:var(--text-primary)]">{t("variants.builder.factsTitle")}</p>
            <p className="mt-2 text-xs leading-5 text-[color:var(--text-secondary)]">{t("variants.builder.factsDescription")}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !name}>
            {t("variants.builder.button")}
          </Button>
          {message ? <p className="text-sm text-[color:var(--text-secondary)]">{message}</p> : null}
        </div>
      </div>
    </Card>
  );
}
