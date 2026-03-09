import { ImportDropzone } from "../../components/resume/ImportDropzone";

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Import</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Bring in an existing resume</h2>
        <p className="mt-2 text-sm text-slate-600">
          Upload a resume file and Claimit will parse it into the base vault format.
        </p>
      </div>
      <ImportDropzone />
    </div>
  );
}
