"use client";

import type { ApplyChangeLog } from "@claimit/core";
import { CheckCircle2, History } from "lucide-react";

import { useTranslations } from "../layout/locale-provider";
import { Card } from "../ui/card";
import { EmptyState } from "../ui/empty-state";

export function ChangeLogPanel({ entries }: { entries: ApplyChangeLog[] }) {
  const t = useTranslations();

  return (
    <Card variant="glass" padding="default">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-[color:var(--surface)] text-[color:var(--text-primary)]">
          <History className="size-4" />
        </div>
        <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{t("assistant.changeLog.title")}</h3>
      </div>
      {entries.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={CheckCircle2}
            title={t("assistant.changeLog.emptyTitle")}
            description={t("assistant.changeLog.emptyDescription")}
          />
        </div>
      ) : (
        <ul className="mt-4 space-y-3 text-sm text-[color:var(--text-secondary)]">
          {entries.map((entry, index) => (
            <li
              key={`${entry.description}-${index}`}
              className="flex gap-3 rounded-[22px] border border-[rgba(69,106,90,0.22)] bg-[rgba(69,106,90,0.08)] px-4 py-3"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[color:var(--success)]" />
              <span className="leading-6">{entry.description}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
