import { siGit, siJson, siMarkdown, siNextdotjs, siNodedotjs, siPnpm, siReact, siTypescript } from "simple-icons";

import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

const toolingIcons = [
  siPnpm,
  siNodedotjs,
  siTypescript,
  siReact,
  siNextdotjs,
  siGit,
  siMarkdown,
  siJson,
] as const;

export function OpenToolingStrip({
  eyebrow,
  title,
  description,
  badge,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <section className="space-y-6">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">{eyebrow}</p>
          <Badge>{badge}</Badge>
        </div>
        <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">{title}</h3>
        <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">{description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        {toolingIcons.map((icon) => (
          <Card key={icon.title} variant="panel" padding="default" className="flex min-h-[132px] flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_14px_28px_-24px_var(--shadow-color)]">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7">
                <path d={icon.path} fill={`#${icon.hex}`} />
              </svg>
            </div>
            <p className="mt-4 text-sm font-semibold text-[color:var(--text-primary)]">{icon.title}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
