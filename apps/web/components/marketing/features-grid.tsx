import type { LucideIcon } from "lucide-react";

import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} variant="interactive" padding="lg">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[color:var(--surface)] text-[color:var(--text-primary)] shadow-[0_14px_28px_-24px_var(--shadow-color)]">
                <Icon className="size-5" />
              </div>
              <h4 className="mt-5 text-xl font-semibold text-[color:var(--text-primary)]">{item.title}</h4>
              <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">{item.description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
