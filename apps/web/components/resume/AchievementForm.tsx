"use client";

import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, BadgePlus, LibraryBig, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { Achievement } from "@claimit/core";

import { apiFetch } from "../../lib/utils";
import { useTranslations } from "../layout/locale-provider";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface AchievementFormProps {
  achievement?: Achievement;
}

export function AchievementForm({ achievement }: AchievementFormProps) {
  const router = useRouter();
  const t = useTranslations();
  const [title, setTitle] = useState(achievement?.title ?? "");
  const [summary, setSummary] = useState(achievement?.summary ?? "");
  const [tags, setTags] = useState(achievement?.tags.join(", ") ?? "");
  const [tools, setTools] = useState(achievement?.tools.join(", ") ?? "");
  const [message, setMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (achievement) {
        return apiFetch(`/api/achievements/${achievement.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            achievement: {
              title,
              summary,
              tags: tags
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              tools: tools
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            },
          }),
        });
      }

      return apiFetch("/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          achievement: {
            title,
            summary,
            tags: tags
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            tools: tools
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          },
        }),
      });
    },
    onSuccess: () => {
      setMessage(t("memoryPage.form.saved"));
      toast.success(achievement ? t("memoryPage.form.updatedToastTitle") : t("memoryPage.form.addedToastTitle"), {
        description: t("memoryPage.form.updatedToastDescription"),
      });
      router.refresh();
      if (!achievement) {
        setTitle("");
        setSummary("");
        setTags("");
        setTools("");
      }
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : t("memoryPage.form.unableToSave"));
      toast.error(t("memoryPage.form.unableToSaveToastTitle"), {
        description: error instanceof Error ? error.message : t("memoryPage.form.tryAgain"),
      });
    },
  });

  return (
    <Card variant="elevated" padding="lg">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <Badge variant="accent">{achievement ? t("memoryPage.form.badgeEdit") : t("memoryPage.form.badgeAdd")}</Badge>
            <div>
              <h3 className="text-2xl font-semibold text-[color:var(--text-primary)]">
                {achievement ? t("memoryPage.form.titleEdit") : t("memoryPage.form.titleAdd")}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[color:var(--text-secondary)]">{t("memoryPage.form.description")}</p>
            </div>
          </div>
          <div className="flex size-14 items-center justify-center rounded-[22px] bg-[color:var(--surface)] text-[color:var(--text-primary)]">
            {achievement ? <LibraryBig className="size-6" /> : <BadgePlus className="size-6" />}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="grid gap-5"
        >
          <div>
            <p className="mb-2 text-sm font-medium text-[color:var(--text-primary)]">{t("memoryPage.form.titleLabel")}</p>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t("memoryPage.form.titlePlaceholder")} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-[color:var(--text-primary)]">{t("memoryPage.form.summaryLabel")}</p>
            <Textarea
              rows={4}
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder={t("memoryPage.form.summaryPlaceholder")}
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium text-[color:var(--text-primary)]">{t("memoryPage.form.tagsLabel")}</p>
              <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder={t("memoryPage.form.tagsPlaceholder")} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[color:var(--text-primary)]">{t("memoryPage.form.toolsLabel")}</p>
              <Input value={tools} onChange={(event) => setTools(event.target.value)} placeholder={t("memoryPage.form.toolsPlaceholder")} />
            </div>
          </div>
          <div className="grid gap-3 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-overlay)] p-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-[rgba(138,104,70,0.12)] text-[color:var(--accent)]">
                <Sparkles className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-[color:var(--text-primary)]">{t("memoryPage.form.tipTitle")}</p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)]">{t("memoryPage.form.tipDescription")}</p>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-3 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4 text-sm text-[color:var(--text-secondary)]">
              <p className="font-medium text-[color:var(--text-primary)]">{t("memoryPage.form.suggestedTags")}</p>
              <p>{t("memoryPage.form.suggestedTagsValue")}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !title || !summary}>
              {achievement ? t("memoryPage.form.buttonUpdate") : t("memoryPage.form.buttonAdd")}
              <ArrowRight className="size-4" />
            </Button>
            {message ? <p className="text-sm text-[color:var(--text-secondary)]">{message}</p> : null}
          </div>
        </motion.div>
      </div>
    </Card>
  );
}
