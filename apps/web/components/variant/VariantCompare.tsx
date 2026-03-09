import type { Resume, Variant } from "@claimit/core";
import { ArrowRightLeft, FileDiff, WandSparkles } from "lucide-react";

import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

export function VariantCompare({ base, variant }: { base: Resume; variant: Variant }) {
  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Badge variant="accent">Variant summary</Badge>
              <Badge>{variant.variant_meta.customizations.length} customizations</Badge>
            </div>
            <h3 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">{variant.variant_meta.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {variant.variant_meta.target_role ?? "No target role supplied."}
            </p>
          </div>
          <div className="flex size-14 items-center justify-center rounded-[22px] bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-white">
            <WandSparkles className="size-6" />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="glass" padding="lg">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="size-4 text-slate-500 dark:text-slate-300" />
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Base resume</p>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">{base.basics.name}</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {base.experience.map((entry) => (
              <li key={entry.id} className="rounded-[22px] border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                <span className="font-medium">{entry.title}</span> · {entry.company}
              </li>
            ))}
          </ul>
        </Card>

        <Card variant="glass" padding="lg">
          <div className="flex items-center gap-3">
            <FileDiff className="size-4 text-slate-500 dark:text-slate-300" />
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Variant adjustments</p>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">{variant.variant_meta.name}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{variant.variant_meta.target_role ?? "No target role supplied."}</p>
          <ul className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {variant.variant_meta.customizations.map((customization, index) => (
              <li
                key={`${customization.path}-${index}`}
                className="rounded-[22px] border border-violet-200 bg-violet-50 px-4 py-3 dark:border-violet-400/15 dark:bg-violet-500/8"
              >
                <span className="font-medium capitalize text-slate-900 dark:text-white">{customization.type}</span> · {customization.reason}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
