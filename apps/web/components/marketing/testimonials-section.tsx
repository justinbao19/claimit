import { Quote } from "lucide-react";

import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

type TestimonialItem = {
  name: string;
  role: string;
  quote: string;
  initials: string;
};

const avatarThemes = [
  "from-[rgba(196,162,123,0.92)] to-[rgba(112,82,56,0.9)] text-[color:var(--accent-contrast)]",
  "from-[rgba(96,117,138,0.95)] to-[rgba(59,83,102,0.92)] text-white",
  "from-[rgba(69,106,90,0.94)] to-[rgba(44,77,63,0.9)] text-white",
  "from-[rgba(125,102,180,0.94)] to-[rgba(87,67,135,0.92)] text-white",
] as const;

export function TestimonialsSection({
  eyebrow,
  title,
  description,
  badge,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
  items: TestimonialItem[];
}) {
  return (
    <section id="testimonials" className="space-y-6">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">{eyebrow}</p>
          <Badge variant="accent">{badge}</Badge>
        </div>
        <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">{title}</h3>
        <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">{description}</p>
      </div>

      <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
        {items.map((item, index) => (
          <div key={`${item.name}-${index}`} className="mb-4 break-inside-avoid">
            <Card
              variant={index % 3 === 0 ? "elevated" : "interactive"}
              padding="lg"
              className={index % 2 === 0 ? "h-full" : "h-full lg:p-7"}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold shadow-[0_14px_28px_-24px_var(--shadow-color)] ${avatarThemes[index % avatarThemes.length]}`}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-[color:var(--text-primary)]">{item.name}</p>
                    <p className="text-sm text-[color:var(--text-secondary)]">{item.role}</p>
                  </div>
                </div>
                <Quote className="size-5 text-[color:var(--accent)]" />
              </div>
              <p className="mt-6 text-sm leading-7 text-[color:var(--text-secondary)]">{item.quote}</p>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
