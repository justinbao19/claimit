"use client";

import type { Question } from "@claimit/core";
import { motion } from "framer-motion";
import { CornerDownRight, Sparkle } from "lucide-react";

import { assistantGoalLabelKeys } from "../../lib/messages";
import { useTranslations } from "../layout/locale-provider";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";

interface QuestionCardProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onSkip: () => void;
}

export function QuestionCard({ question, value, onChange, onSkip }: QuestionCardProps) {
  const t = useTranslations();
  const goalKey = assistantGoalLabelKeys[question.goal as keyof typeof assistantGoalLabelKeys];

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
      <Card variant="interactive" padding="default">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[color:var(--surface)] text-[color:var(--text-primary)]">
              <Sparkle className="size-4" />
            </div>
            <Badge variant="accent">{goalKey ? t(goalKey) : question.goal.replace(/_/g, " ")}</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onSkip}>
            {t("assistant.questionCard.skip")}
          </Button>
        </div>
        <p className="text-base font-medium leading-7 text-[color:var(--text-primary)]">{question.question}</p>
        {question.examples?.length ? (
          <div className="mt-3 rounded-[22px] border border-[color:var(--field-border)] bg-[color:var(--surface-elevated)] px-4 py-3 text-sm text-[color:var(--text-secondary)] shadow-[0_14px_28px_-24px_var(--shadow-color)]">
            <span className="inline-flex items-center gap-2 text-[color:var(--text-primary)]">
              <CornerDownRight className="size-4" />
              {t("assistant.questionCard.examples")}
            </span>
            <p className="mt-2 leading-6">{question.examples.join(", ")}</p>
          </div>
        ) : null}
        <Textarea
          rows={3}
          className="mt-4"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t("assistant.questionCard.placeholder")}
        />
      </Card>
    </motion.div>
  );
}
