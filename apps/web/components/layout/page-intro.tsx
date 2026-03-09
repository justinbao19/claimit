import type { LucideIcon } from "lucide-react";

import { Badge } from "../ui/badge";

export function PageIntro({
  eyebrow,
  title,
  description,
  icon: Icon,
  badge,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  badge?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {Icon ? (
          <div className="flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-white">
            <Icon className="size-5" />
          </div>
        ) : null}
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
        {badge ? <Badge variant="default">{badge}</Badge> : null}
      </div>
      <div className="max-w-3xl">
        <h2 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{description}</p>
      </div>
    </div>
  );
}
