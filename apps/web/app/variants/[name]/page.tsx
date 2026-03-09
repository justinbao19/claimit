import { notFound } from "next/navigation";
import { initVault, loadBaseResume, loadVariant } from "@claimit/core";
import { FileDiff } from "lucide-react";

import { PageIntro } from "../../../components/layout/page-intro";
import { VariantCompare } from "../../../components/variant/VariantCompare";

export default async function VariantDetailPage({ params }: { params: Promise<{ name: string }> }) {
  await initVault();
  const { name } = await params;

  try {
    const [base, variant] = await Promise.all([loadBaseResume(), loadVariant(name)]);
    return (
      <div className="space-y-6">
        <PageIntro
          eyebrow="Variant detail"
          title={name}
          description="Review how this variant shifts emphasis compared with the base resume before you export or continue refining."
          icon={FileDiff}
          badge="Comparison view"
        />
        <VariantCompare base={base} variant={variant} />
      </div>
    );
  } catch {
    notFound();
  }
}
