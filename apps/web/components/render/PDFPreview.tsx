import { Card } from "../ui/card";

export function PDFPreview({ html }: { html: string }) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">HTML Preview</h3>
      </div>
      <iframe
        title="Resume preview"
        className="h-[900px] w-full bg-white"
        srcDoc={html}
        sandbox="allow-same-origin"
      />
    </Card>
  );
}
