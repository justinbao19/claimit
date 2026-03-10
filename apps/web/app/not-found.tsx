import Link from "next/link";
import { Compass } from "lucide-react";

import { EmptyState } from "../components/ui/empty-state";
import { getServerI18n } from "../lib/i18n";

export default async function NotFound() {
  const { t } = await getServerI18n();

  return (
    <div className="mx-auto max-w-3xl py-20">
      <EmptyState
        icon={Compass}
        title={t("notFound.title")}
        description={t("notFound.description")}
      />
      <div className="mt-6 text-center">
        <Link
          href="/workspace"
          className="inline-flex items-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-4 py-2 text-sm text-[color:var(--text-primary)] transition hover:bg-[color:var(--surface)]"
        >
          {t("common.backToDashboard")}
        </Link>
      </div>
    </div>
  );
}
