import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

type HighlightItem = {
  title: string;
  description: string;
};

export function WorksWithSection({
  eyebrow,
  title,
  description,
  badge,
  tags,
  highlights,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
  tags: string[];
  highlights: HighlightItem[];
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card variant="glass" padding="lg">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">{eyebrow}</p>
            <Badge variant="accent">{badge}</Badge>
          </div>
          <div className="max-w-2xl">
            <h3 className="text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">{title}</h3>
            <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">{description}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        <Card variant="elevated" padding="lg" className="overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,162,123,0.12),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
          <div className="relative z-10 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <div
                key={tag}
                className="rounded-full border border-[color:var(--field-border)] bg-[color:var(--panel-strong)] px-4 py-2 text-sm text-[color:var(--text-primary)] shadow-[0_10px_24px_-20px_var(--shadow-color)]"
              >
                {tag}
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <Card key={item.title} variant="panel" padding="default">
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">{item.title}</p>
              <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
