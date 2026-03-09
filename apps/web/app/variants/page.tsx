import Link from "next/link";
import { initVault, listVariants } from "@claimit/core";
import { Wand2 } from "lucide-react";

import { PageIntro } from "../../components/layout/page-intro";
import { JDInput } from "../../components/variant/JDInput";
import { Card } from "../../components/ui/card";
import { EmptyState } from "../../components/ui/empty-state";
import { getServerI18n } from "../../lib/i18n";

export default async function VariantsPage() {
  await initVault();
  const variants = await listVariants();
  const { t } = await getServerI18n();

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow={t("variants.intro.eyebrow")}
        title={t("variants.intro.title")}
        description={t("variants.intro.description")}
        icon={Wand2}
        badge={t("variants.intro.badge", { count: variants.length })}
      />
      <div className="grid gap-6 xl:grid-cols-[460px_1fr]">
        <JDInput />
        <Card variant="glass" padding="lg">
          <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{t("variants.list.title")}</h3>
          <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{t("variants.list.description")}</p>
          <div className="mt-5 space-y-3">
            {variants.length === 0 ? (
              <EmptyState
                icon={Wand2}
                title={t("variants.list.emptyTitle")}
                description={t("variants.list.emptyDescription")}
              />
            ) : (
              variants.map((name) => (
                <Link
                  key={name}
                  href={`/variants/${name}`}
                  className="block rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-4 py-4 text-sm text-[color:var(--text-primary)] transition hover:-translate-y-0.5 hover:border-[color:var(--field-border)]"
                >
                  {name}
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
