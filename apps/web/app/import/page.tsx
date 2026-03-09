import { FileUp } from "lucide-react";

import { PageIntro } from "../../components/layout/page-intro";
import { ImportDropzone } from "../../components/resume/ImportDropzone";
import { getServerI18n } from "../../lib/i18n";

export default async function ImportPage() {
  const { t } = await getServerI18n();

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow={t("importPage.intro.eyebrow")}
        title={t("importPage.intro.title")}
        description={t("importPage.intro.description")}
        icon={FileUp}
        badge={t("importPage.intro.badge")}
      />
      <ImportDropzone />
    </div>
  );
}
