"use client";

import type { Question } from "@claimit/core";

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
    <Card className="p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <Badge>{question.goal.replace(/_/g, " ")}</Badge>
        <Button variant="ghost" onClick={onSkip}>
          Skip
        </Button>
      </div>
      <p className="text-base font-medium text-slate-900">{question.question}</p>
      {question.examples?.length ? (
        <p className="mt-2 text-sm text-slate-500">Examples: {question.examples.join(", ")}</p>
      ) : null}
      <Textarea
        rows={3}
        className="mt-3"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Your answer..."
      />
    </Card>
  );
}
