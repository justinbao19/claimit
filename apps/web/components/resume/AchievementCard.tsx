import Link from "next/link";
import type { Achievement } from "@claimit/core";
import { ArrowRight, CalendarRange, Wrench } from "lucide-react";

import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { formatDateRangeLabel } from "../../lib/utils";

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <Card variant="interactive" padding="default">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{formatDateRangeLabel(achievement.date_range)}</Badge>
            <Badge variant="accent">{achievement.source.replace("_", " ")}</Badge>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">{achievement.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{achievement.summary}</p>
        </div>
        <Link
          href={`/memory/${achievement.id}`}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:bg-white/[0.1]"
        >
          Edit
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
        <div className="rounded-[22px] border border-slate-200 bg-white/80 p-3 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
          <div className="mb-2 flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <CalendarRange className="size-4" />
            <span className="font-medium">Timeline</span>
          </div>
          {formatDateRangeLabel(achievement.date_range)}
        </div>
        <div className="rounded-[22px] border border-slate-200 bg-white/80 p-3 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
          <div className="mb-2 flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <Wrench className="size-4" />
            <span className="font-medium">Tools</span>
          </div>
          {achievement.tools.length > 0 ? achievement.tools.join(", ") : "No tools attached yet"}
        </div>
      </div>
    </Card>
  );
}
