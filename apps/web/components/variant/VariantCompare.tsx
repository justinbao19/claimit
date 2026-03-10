"use client";

import type { Resume, Variant } from "@claimit/core";
import { ArrowRightLeft, FileDiff, WandSparkles } from "lucide-react";

import { useTranslations } from "../layout/locale-provider";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

export function VariantCompare({ base, variant }: { base: Resume; variant: Variant }) {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <Card variant="elevated" padding="lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Badge variant="accent">{t("variants.compare.summaryBadge")}</Badge>
              <Badge>{t("variants.compare.customizationsBadge", { count: variant.variant_meta.customizations.length })}</Badge>
            </div>
            <h3 className="mt-4 text-3xl font-semibold text-[color:var(--text-primary)]">{variant.variant_meta.name}</h3>
            <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">
              {variant.variant_meta.target_role ?? t("common.noTargetRole")}
            </p>
          </div>
          <div className="flex size-14 items-center justify-center rounded-[22px] bg-[color:var(--surface)] text-[color:var(--text-primary)]">
            <WandSparkles className="size-6" />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="glass" padding="lg">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="size-4 text-[color:var(--text-secondary)]" />
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-tertiary)]">{t("variants.compare.baseResume")}</p>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-[color:var(--text-primary)]">{base.basics.name}</h2>
          <ul className="mt-5 space-y-3 text-sm text-[color:var(--text-secondary)]">
            {base.experience.map((entry) => (
              <li key={entry.id} className="rounded-[22px] border border-[color:var(--field-border)] bg-[color:var(--surface-elevated)] px-4 py-3 shadow-[0_14px_28px_-24px_var(--shadow-color)]">
                <span className="font-medium">{entry.title}</span> · {entry.company}
              </li>
            ))}
          </ul>
        </Card>

        <Card variant="glass" padding="lg">
          <div className="flex items-center gap-3">
            <FileDiff className="size-4 text-[color:var(--text-secondary)]" />
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-tertiary)]">{t("variants.compare.adjustments")}</p>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-[color:var(--text-primary)]">{variant.variant_meta.name}</h2>
          <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{variant.variant_meta.target_role ?? t("common.noTargetRole")}</p>
          <ul className="mt-5 space-y-3 text-sm text-[color:var(--text-secondary)]">
            {variant.variant_meta.customizations.map((customization, index) => (
              <li
                key={`${customization.path}-${index}`}
                className="rounded-[22px] border border-[rgba(138,104,70,0.28)] bg-[rgba(138,104,70,0.12)] px-4 py-3 shadow-[0_14px_28px_-24px_var(--shadow-color)]"
              >
                <span className="font-medium capitalize text-[color:var(--text-primary)]">{customization.type}</span> · {customization.reason}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
