import { Card } from "../ui/card";

export function PDFPreview({ html }: { html: string }) {
  return (
    <Card variant="glass" className="overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4 dark:border-white/10">
        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Document preview</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">The live HTML surface mirrors the current render pipeline output.</p>
      </div>
      <div className="bg-[linear-gradient(180deg,rgba(248,250,252,0.8),rgba(255,255,255,0.88))] p-5 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
        <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-white/10 dark:bg-slate-950/60 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="mb-4 flex items-center gap-2">
            <span className="size-3 rounded-full bg-rose-400/70" />
            <span className="size-3 rounded-full bg-amber-300/70" />
            <span className="size-3 rounded-full bg-emerald-400/70" />
          </div>
          <iframe
            title="Resume preview"
            className="h-[900px] w-full rounded-[24px] bg-white"
            srcDoc={html}
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </Card>
  );
}
