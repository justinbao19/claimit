import type { LucideIcon } from "lucide-react";

import { Badge } from "../ui/badge";

type WorkflowItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function WorkflowSection({
  eyebrow,
  title,
  description,
  badge,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
  items: WorkflowItem[];
}) {
  return (
    <section className="space-y-6">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">{eyebrow}</p>
          <Badge>{badge}</Badge>
        </div>
        <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">{title}</h3>
        <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">{description}</p>
      </div>

      <div className="rounded-[30px] border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-[0_20px_44px_-30px_var(--shadow-color)] backdrop-blur-xl">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="relative">
                {index < items.length - 1 ? (
                  <div className="absolute left-5 top-5 hidden h-px w-[calc(100%-1rem)] bg-[color:var(--border)] xl:block" />
                ) : null}
                <div className="relative z-10 flex items-start gap-4 xl:block">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--field-border)] bg-[color:var(--surface)] text-[color:var(--text-primary)] shadow-[0_14px_28px_-24px_var(--shadow-color)]">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 xl:mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--text-tertiary)]">0{index + 1}</p>
                    <h4 className="mt-2 text-base font-semibold text-[color:var(--text-primary)]">{item.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
