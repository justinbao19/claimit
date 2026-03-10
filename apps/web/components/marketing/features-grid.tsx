import type { LucideIcon } from "lucide-react";

import { Badge } from "../ui/badge";

type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function FeaturesGrid({
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
  items: FeatureItem[];
}) {
  return (
    <section id="capabilities" className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">{eyebrow}</p>
            <Badge>{badge}</Badge>
          </div>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">{title}</h3>
          <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">{description}</p>
        </div>
      </div>

      <div className="grid gap-x-10 gap-y-3 md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex gap-4 border-t border-[color:var(--border)] py-5 first:border-t-0 first:pt-0 md:first:pt-0">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--surface)] text-[color:var(--text-primary)] shadow-[0_14px_28px_-24px_var(--shadow-color)]">
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-lg font-semibold text-[color:var(--text-primary)]">{item.title}</h4>
                <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
