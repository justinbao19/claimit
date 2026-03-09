import Link from "next/link";
import { initVault, listVariants } from "@claimit/core";

import { JDInput } from "../../components/variant/JDInput";
import { Card } from "../../components/ui/card";

export default async function VariantsPage() {
  await initVault();
  const variants = await listVariants();

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Variants</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Create role-specific variants</h2>
        </div>
        <JDInput />
      </div>
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900">Saved variants</h3>
        <div className="mt-4 space-y-3">
          {variants.length === 0 ? (
            <p className="text-sm text-slate-500">No variants created yet.</p>
          ) : (
            variants.map((name) => (
              <Link
                key={name}
                href={`/variants/${name}`}
                className="block rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
              >
                {name}
              </Link>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
