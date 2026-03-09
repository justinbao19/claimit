"use client";

import { useMutation } from "@tanstack/react-query";
import type { ApplyChangeLog, GapAnalysis } from "@claimit/core";
import { useState } from "react";

import { useAssistantStore } from "../../lib/assistant-store";
import { apiFetch } from "../../lib/utils";
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
    },
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Completeness score</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              {hasResumeContent ? `${result.completeness_score}%` : "--"}
            </h2>
          </div>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !canApplyAnswers}>
            Apply answers
          </Button>
        </div>
        <p className="mt-3 text-sm text-slate-600">{result.summary}</p>
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
        <Card className="p-5">
          <h3 className="text-lg font-semibold text-slate-900">Warnings</h3>
          <ul className="mt-3 space-y-2 text-sm text-amber-700">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
