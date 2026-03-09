import type { ApplyChangeLog } from "@claimit/core";
import { CheckCircle2, History } from "lucide-react";

import { Card } from "../ui/card";
import { EmptyState } from "../ui/empty-state";

export function ChangeLogPanel({ entries }: { entries: ApplyChangeLog[] }) {
  return (
    <Card variant="glass" padding="default">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-white">
          <History className="size-4" />
        </div>
        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Applied changes</h3>
      </div>
      {entries.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={CheckCircle2}
            title="No changes applied yet"
            description="Answer a few assistant prompts and apply them to see your improvement log here."
          />
        </div>
      ) : (
        <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
          {entries.map((entry, index) => (
            <li
              key={`${entry.description}-${index}`}
              className="flex gap-3 rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-400/15 dark:bg-emerald-500/8"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
              <span className="leading-6">{entry.description}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
