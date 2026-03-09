import type { LucideIcon } from "lucide-react";

import { cn } from "../../lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-dashed border-[color:var(--border)] bg-[color:var(--surface-overlay)] px-6 py-10 text-center",
        className,
      )}
    >
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-secondary)]">
        <Icon className="size-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[color:var(--text-primary)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[color:var(--text-secondary)]">{description}</p>
    </div>
  );
}
