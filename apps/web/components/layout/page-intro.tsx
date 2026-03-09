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
          <div className="flex size-11 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-elevated)] text-[color:var(--text-primary)] shadow-[0_14px_28px_-24px_var(--shadow-color)]">
            <Icon className="size-5" />
          </div>
        ) : null}
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">{eyebrow}</p>
        {badge ? <Badge variant="default">{badge}</Badge> : null}
      </div>
      <div className="max-w-3xl">
        <h2 className="text-4xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-5xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">{description}</p>
      </div>
    </div>
  );
}
