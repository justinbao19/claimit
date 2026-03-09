import Link from "next/link";
import { initVault, listVariants } from "@claimit/core";
import { Wand2 } from "lucide-react";

import { PageIntro } from "../../components/layout/page-intro";
import { JDInput } from "../../components/variant/JDInput";
import { Card } from "../../components/ui/card";
import { EmptyState } from "../../components/ui/empty-state";

export default async function VariantsPage() {
  await initVault();
  const variants = await listVariants();

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Variants"
        title="Shape the same facts into different role narratives"
        description="Variants help you reposition your experience for a given opportunity. Build one from the current vault, then review the changes before export."
        icon={Wand2}
        badge={`${variants.length} saved variants`}
      />
      <div className="grid gap-6 xl:grid-cols-[460px_1fr]">
        <JDInput />
        <Card variant="glass" padding="lg">
          <h3 className="text-lg font-semibold text-white">Saved variants</h3>
          <p className="mt-2 text-sm text-slate-400">Reopen any saved variant to compare it against the base resume.</p>
          <div className="mt-5 space-y-3">
            {variants.length === 0 ? (
              <EmptyState
                icon={Wand2}
                title="No variants created yet"
                description="Once the base resume has enough signal, use the panel on the left to generate role-specific variants."
              />
            ) : (
              variants.map((name) => (
                <Link
                  key={name}
                  href={`/variants/${name}`}
                  className="block rounded-[22px] border border-white/10 bg-white/[0.05] px-4 py-4 text-sm text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
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
