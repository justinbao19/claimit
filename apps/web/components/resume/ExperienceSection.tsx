"use client";

import type { Experience } from "@claimit/core";
import { BriefcaseBusiness } from "lucide-react";

import { useTranslations } from "../layout/locale-provider";
import { EmptyState } from "../ui/empty-state";
import { formatDateRangeLabel } from "../../lib/utils";

export function ExperienceSection({ experience }: { experience: Experience[] }) {
  const t = useTranslations();

  if (experience.length === 0) {
    return (
      <EmptyState
        icon={BriefcaseBusiness}
        title={t("memoryPage.experienceSection.emptyTitle")}
        description={t("memoryPage.experienceSection.emptyDescription")}
      />
    );
  }

  return (
    <div className="space-y-4">
      {experience.map((entry) => (
        <div key={entry.id} className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-overlay)] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-[color:var(--text-primary)]">
                {entry.title} · {entry.company}
              </h3>
              {entry.location ? <p className="text-sm text-[color:var(--text-secondary)]">{entry.location}</p> : null}
            </div>
            <p className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-3 py-1 text-xs text-[color:var(--text-secondary)]">
              {formatDateRangeLabel(entry.date_range, {
                present: t("common.present"),
                unavailable: t("common.dateUnavailable"),
              })}
            </p>
          </div>
          {entry.highlights.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm text-[color:var(--text-secondary)]">
              {entry.highlights.map((highlight, index) => (
                <li key={`${entry.id}-${index}`} className="flex gap-3 rounded-2xl bg-[rgba(116,133,154,0.08)] px-4 py-3">
                  <span className="mt-1 size-2 rounded-full bg-[color:var(--accent)]" />
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
