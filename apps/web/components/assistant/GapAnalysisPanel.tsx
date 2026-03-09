"use client";

import { useMutation } from "@tanstack/react-query";
import type { ApplyChangeLog, GapAnalysis } from "@claimit/core";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, BrainCircuit, CircleCheckBig, ListChecks, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
      toast.success("Answers applied", {
        description: data.change_log.length > 0 ? `${data.change_log.length} resume updates were recorded.` : "No changes were necessary.",
      });
    },
    onError: (error) => {
      toast.error("Could not apply answers", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="lg">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="accent">Gap analysis</Badge>
              <Badge>{result.questions.length} prompts</Badge>
            </div>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <h2 className="text-5xl font-semibold text-slate-950 dark:text-white">
              {hasResumeContent ? `${result.completeness_score}%` : "--"}
              </h2>
              <p className="pb-2 text-sm text-slate-500 dark:text-slate-400">resume completeness</p>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">{result.summary}</p>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: hasResumeContent ? `${result.completeness_score}%` : "12%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(45,212,191,0.95),rgba(139,92,246,0.95))]"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.05]">
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-100">
                <BrainCircuit className="size-4" />
                <span className="text-sm font-medium">Analysis</span>
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-500 dark:text-slate-400">Scores the current resume and highlights areas missing impact, scope, or clarity.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.05]">
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-100">
                <ListChecks className="size-4" />
                <span className="text-sm font-medium">Question set</span>
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-500 dark:text-slate-400">Focus on the highest-value prompts first rather than rewriting everything at once.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.05]">
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-100">
                <CircleCheckBig className="size-4" />
                <span className="text-sm font-medium">Apply changes</span>
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-500 dark:text-slate-400">Persist improved wording and metrics back into the workspace once the answers are ready.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-200">
              <Sparkles className="size-4" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {canApplyAnswers
                ? "Answer the questions below, then apply them to update the structured resume."
                : "Import or add resume content first so the assistant has material to analyze."}
            </p>
          </div>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !canApplyAnswers}>
            {mutation.isPending ? "Applying..." : "Apply answers"}
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
            <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-500/12 text-amber-200">
              <AlertTriangle className="size-4" />
            </div>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Warnings</h3>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-amber-700 dark:text-amber-100">
            {warnings.map((warning) => (
              <li key={warning} className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-400/15 dark:bg-amber-500/10">
                {warning}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
