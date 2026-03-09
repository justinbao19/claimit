import { notFound } from "next/navigation";
import { initVault, loadBaseResume, loadVariant } from "@claimit/core";

import { VariantCompare } from "../../../components/variant/VariantCompare";

export default async function VariantDetailPage({ params }: { params: Promise<{ name: string }> }) {
  await initVault();
  const { name } = await params;

  try {
    const [base, variant] = await Promise.all([loadBaseResume(), loadVariant(name)]);
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Variant detail</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{name}</h2>
        </div>
        <VariantCompare base={base} variant={variant} />
      </div>
    );
  } catch {
    notFound();
  }
}
