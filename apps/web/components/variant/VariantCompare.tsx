import type { Resume, Variant } from "@claimit/core";

import { Card } from "../ui/card";

export function VariantCompare({ base, variant }: { base: Resume; variant: Variant }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Base resume</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">{base.basics.name}</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {base.experience.map((entry) => (
            <li key={entry.id}>
              <span className="font-medium">{entry.title}</span> · {entry.company}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Variant</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">{variant.variant_meta.name}</h2>
        <p className="mt-2 text-sm text-slate-600">{variant.variant_meta.target_role ?? "No target role supplied."}</p>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {variant.variant_meta.customizations.map((customization, index) => (
            <li key={`${customization.path}-${index}`}>
              <span className="font-medium">{customization.type}</span> · {customization.reason}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
