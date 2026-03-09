"use client";

import type { Question } from "@claimit/core";
import { motion } from "framer-motion";
import { CornerDownRight, Sparkle } from "lucide-react";

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
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
      <Card variant="interactive" padding="default">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-slate-100">
              <Sparkle className="size-4" />
            </div>
            <Badge variant="accent">{question.goal.replace(/_/g, " ")}</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onSkip}>
            Skip
          </Button>
        </div>
        <p className="text-base font-medium leading-7 text-slate-950 dark:text-white">{question.question}</p>
        {question.examples?.length ? (
          <div className="mt-3 rounded-[22px] border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
            <span className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CornerDownRight className="size-4" />
              Examples
            </span>
            <p className="mt-2 leading-6">{question.examples.join(", ")}</p>
          </div>
        ) : null}
        <Textarea
          rows={3}
          className="mt-4"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Your answer..."
        />
      </Card>
    </motion.div>
  );
}
