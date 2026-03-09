"use client";

import Link from "next/link";
import type { Achievement } from "@claimit/core";
import { ArrowRight, CalendarRange, Wrench } from "lucide-react";

import { useTranslations } from "../layout/locale-provider";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { formatDateRangeLabel } from "../../lib/utils";

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  const t = useTranslations();
  const dateLabel = formatDateRangeLabel(achievement.date_range, {
    present: t("common.present"),
    unavailable: t("common.dateUnavailable"),
  });

  return (
    <Card variant="interactive" padding="default">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{dateLabel}</Badge>
            <Badge variant="accent">{achievement.source.replace("_", " ")}</Badge>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[color:var(--text-primary)]">{achievement.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">{achievement.summary}</p>
        </div>
        <Link
          href={`/memory/${achievement.id}`}
          className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-3 py-2 text-sm text-[color:var(--text-primary)] transition hover:bg-[color:var(--surface)]"
        >
          {t("memoryPage.card.edit")}
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {achievement.tags.map((tag) => (
          <Badge key={tag} variant="accent">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-overlay)] p-3 text-sm text-[color:var(--text-secondary)]">
          <div className="mb-2 flex items-center gap-2 text-[color:var(--text-primary)]">
            <CalendarRange className="size-4" />
            <span className="font-medium">{t("memoryPage.card.timeline")}</span>
          </div>
          {dateLabel}
        </div>
        <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-overlay)] p-3 text-sm text-[color:var(--text-secondary)]">
          <div className="mb-2 flex items-center gap-2 text-[color:var(--text-primary)]">
            <Wrench className="size-4" />
            <span className="font-medium">{t("memoryPage.card.tools")}</span>
          </div>
          {achievement.tools.length > 0 ? achievement.tools.join(", ") : t("common.noToolsAttached")}
        </div>
      </div>
    </Card>
  );
}
