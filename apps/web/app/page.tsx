import Link from "next/link";
import { initVault, listVariants, loadBaseResume } from "@claimit/core";

import { Card } from "../components/ui/card";

export default async function HomePage() {
  await initVault();
  const [resume, variants] = await Promise.all([loadBaseResume(), listVariants()]);

  const stats = [
    { label: "Experience", value: resume.experience.length },
    { label: "Achievements", value: resume.achievements.length },
    { label: "Claims", value: resume.claims.length },
    { label: "Variants", value: variants.length },
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Resume status</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{resume.basics.name}</h2>
          <p className="mt-3 text-sm text-slate-600">
            {resume.basics.summary ??
              "No professional summary yet. Use the assistant to identify missing metrics and fill gaps."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/import" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              Import resume
            </Link>
            <Link href="/assistant" className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900">
              Run gap analysis
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quick links</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-700">
            <Link href="/memory" className="rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
              Manage achievements and resume memory
            </Link>
            <Link href="/variants" className="rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
              Tailor role-specific variants
            </Link>
            <Link href="/render" className="rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
              Preview templates and export
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
