import { FileUp } from "lucide-react";

import { PageIntro } from "../../components/layout/page-intro";
import { ImportDropzone } from "../../components/resume/ImportDropzone";

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Import"
        title="Bring an existing resume into the workspace"
        description="Drop in a PDF, DOCX, JSON, or plain text source and Claimit will parse it into the base vault so the rest of the workflow can build on structured data."
        icon={FileUp}
        badge="Ingestion pipeline"
      />
      <ImportDropzone />
    </div>
  );
}
