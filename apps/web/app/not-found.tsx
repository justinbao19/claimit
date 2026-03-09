import Link from "next/link";
import { Compass } from "lucide-react";

import { EmptyState } from "../components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl py-20">
      <EmptyState
        icon={Compass}
        title="This workspace view could not be found"
        description="The route may have moved, or the requested resume item no longer exists."
      />
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/[0.1]"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
