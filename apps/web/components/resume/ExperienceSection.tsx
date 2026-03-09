import type { Experience } from "@claimit/core";
import { BriefcaseBusiness } from "lucide-react";

import { EmptyState } from "../ui/empty-state";
import { formatDateRangeLabel } from "../../lib/utils";

export function ExperienceSection({ experience }: { experience: Experience[] }) {
  if (experience.length === 0) {
    return (
      <EmptyState
        icon={BriefcaseBusiness}
        title="No experience entries yet"
        description="Import an existing resume or add achievements so your structured experience timeline has something to render."
      />
    );
  }

  return (
    <div className="space-y-4">
      {experience.map((entry) => (
        <div key={entry.id} className="rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-950 dark:text-white">
                {entry.title} · {entry.company}
              </h3>
              {entry.location ? <p className="text-sm text-slate-500 dark:text-slate-400">{entry.location}</p> : null}
            </div>
            <p className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
              {formatDateRangeLabel(entry.date_range)}
            </p>
          </div>
          {entry.highlights.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {entry.highlights.map((highlight, index) => (
                <li key={`${entry.id}-${index}`} className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/[0.03]">
                  <span className="mt-1 size-2 rounded-full bg-cyan-300" />
                  <span className="leading-6">{highlight}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}
