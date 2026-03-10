import type { LucideIcon } from "lucide-react";

import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

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
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card variant="glass" padding="lg">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">{eyebrow}</p>
            <Badge>{badge}</Badge>
          </div>
          <div className="max-w-2xl">
            <h3 className="text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">{title}</h3>
            <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">{description}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} variant="panel" padding="lg">
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[color:var(--surface)] text-[color:var(--text-primary)] shadow-[0_14px_28px_-24px_var(--shadow-color)]">
                  <Icon className="size-5" />
                </div>
                <span className="text-[11px] font-medium text-[color:var(--text-tertiary)]">0{index + 1}</span>
              </div>
              <h4 className="mt-5 text-lg font-semibold text-[color:var(--text-primary)]">{item.title}</h4>
              <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">{item.description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
