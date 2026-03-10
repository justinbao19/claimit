"use client";

import { useMutation } from "@tanstack/react-query";
import type { ApplyChangeLog, GapAnalysis } from "@claimit/core";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, BrainCircuit, CircleCheckBig, ListChecks, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useTranslations } from "../layout/locale-provider";
import { useAssistantStore } from "../../lib/assistant-store";
import { apiFetch } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ChangeLogPanel } from "./ChangeLogPanel";
import { QuestionCard } from "./QuestionCard";

interface GapAnalysisPanelProps {
  result: GapAnalysis;
  hasResumeContent: boolean;
}

export function GapAnalysisPanel({ result, hasResumeContent }: GapAnalysisPanelProps) {
  const answers = useAssistantStore((state) => state.answers);
  const setAnswer = useAssistantStore((state) => state.setAnswer);
  const reset = useAssistantStore((state) => state.reset);
  const [changeLog, setChangeLog] = useState<ApplyChangeLog[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const t = useTranslations();
  const canApplyAnswers = hasResumeContent && result.questions.length > 0;

  const mutation = useMutation({
    mutationFn: async () =>
      apiFetch<{ change_log: ApplyChangeLog[]; warnings: string[] }>("/api/assistant/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      }),
    onSuccess: (data) => {
      setChangeLog(data.change_log);
      setWarnings(data.warnings);
      reset();
      toast.success(t("assistant.toasts.appliedTitle"), {
        description:
          data.change_log.length > 0
            ? t("assistant.toasts.appliedDescription", { count: data.change_log.length })
            : t("assistant.toasts.appliedNoChanges"),
      });
    },
    onError: (error) => {
      toast.error(t("assistant.toasts.failedTitle"), {
        description: error instanceof Error ? error.message : t("assistant.toasts.tryAgain"),
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="lg">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="accent">{t("assistant.panel.badgePrimary")}</Badge>
              <Badge>{t("assistant.panel.badgeSecondary", { count: result.questions.length })}</Badge>
            </div>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <h2 className="text-5xl font-semibold text-[color:var(--text-primary)]">{hasResumeContent ? `${result.completeness_score}%` : "--"}</h2>
              <p className="pb-2 text-sm text-[color:var(--text-secondary)]">{t("assistant.panel.completeness")}</p>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--text-secondary)]">{result.summary}</p>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-[rgba(96,117,138,0.16)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: hasResumeContent ? `${result.completeness_score}%` : "12%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--success),var(--accent))]"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[24px] border border-[color:var(--field-border)] bg-[color:var(--surface-elevated)] p-4 shadow-[0_16px_32px_-24px_var(--shadow-color)]">
              <div className="flex items-center gap-3 text-[color:var(--text-primary)]">
                <BrainCircuit className="size-4" />
                <span className="text-sm font-medium">{t("assistant.panel.analysisTitle")}</span>
              </div>
              <p className="mt-3 text-xs leading-6 text-[color:var(--text-secondary)]">{t("assistant.panel.analysisDescription")}</p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--field-border)] bg-[color:var(--surface-elevated)] p-4 shadow-[0_16px_32px_-24px_var(--shadow-color)]">
              <div className="flex items-center gap-3 text-[color:var(--text-primary)]">
                <ListChecks className="size-4" />
                <span className="text-sm font-medium">{t("assistant.panel.questionSetTitle")}</span>
              </div>
              <p className="mt-3 text-xs leading-6 text-[color:var(--text-secondary)]">{t("assistant.panel.questionSetDescription")}</p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--field-border)] bg-[color:var(--surface-elevated)] p-4 shadow-[0_16px_32px_-24px_var(--shadow-color)]">
              <div className="flex items-center gap-3 text-[color:var(--text-primary)]">
                <CircleCheckBig className="size-4" />
                <span className="text-sm font-medium">{t("assistant.panel.applyChangesTitle")}</span>
              </div>
              <p className="mt-3 text-xs leading-6 text-[color:var(--text-secondary)]">{t("assistant.panel.applyChangesDescription")}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-[color:var(--field-border)] bg-[color:var(--surface-elevated)] p-4 shadow-[0_18px_38px_-26px_var(--shadow-color)]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[rgba(138,104,70,0.12)] text-[color:var(--accent)]">
              <Sparkles className="size-4" />
            </div>
            <p className="text-sm text-[color:var(--text-secondary)]">
              {canApplyAnswers
                ? t("assistant.panel.readyMessage")
                : t("assistant.panel.emptyMessage")}
            </p>
          </div>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !canApplyAnswers}>
            {mutation.isPending ? t("assistant.panel.applyingButton") : t("assistant.panel.applyButton")}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </Card>

      <div className="grid gap-4">
        {result.questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            value={answers[question.id] ?? ""}
            onChange={(value) => setAnswer(question.id, value)}
            onSkip={() => setAnswer(question.id, "skip")}
          />
        ))}
      </div>

      <ChangeLogPanel entries={changeLog} />

      {warnings.length > 0 ? (
        <Card variant="glass" padding="default">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[rgba(164,118,61,0.14)] text-[color:var(--warning)]">
              <AlertTriangle className="size-4" />
            </div>
            <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{t("assistant.panel.warningsTitle")}</h3>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-[color:var(--warning)]">
            {warnings.map((warning) => (
              <li key={warning} className="rounded-2xl border border-[rgba(164,118,61,0.28)] bg-[rgba(164,118,61,0.12)] px-4 py-3">
                {warning}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
