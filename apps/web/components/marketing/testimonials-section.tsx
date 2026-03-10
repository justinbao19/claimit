import Image from "next/image";
import { Quote } from "lucide-react";

import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

type TestimonialItem = {
  name: string;
  role: string;
  quote: string;
  initials: string;
  avatarSrc: string;
};

function TestimonialCard({ item, index }: { item: TestimonialItem; index: number }) {
  return (
    <Card
      variant={index % 3 === 0 ? "elevated" : "interactive"}
      padding="lg"
      className={index % 2 === 0 ? "h-full" : "h-full lg:p-7"}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-white/45 bg-[color:var(--panel-light)] shadow-[0_14px_28px_-24px_var(--shadow-color)]">
            <Image src={item.avatarSrc} alt={item.name} fill sizes="56px" className="object-cover" />
          </div>
          <div>
            <p className="text-base font-semibold text-[color:var(--text-primary)]">{item.name}</p>
            <p className="text-sm text-[color:var(--text-secondary)]">{item.role}</p>
          </div>
        </div>
        <Quote className="size-5 shrink-0 text-[color:var(--accent)]" />
      </div>
      <p className="mt-6 text-sm leading-7 text-[color:var(--text-secondary)]">{item.quote}</p>
    </Card>
  );
}

function TestimonialMarquee({
  items,
  reverse = false,
  className,
}: {
  items: TestimonialItem[];
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "testimonial-marquee relative overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(180deg,var(--surface-elevated),var(--panel-light))] p-3 shadow-[0_22px_52px_-36px_var(--shadow-color)]",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-4", reverse ? "testimonial-marquee-track-down" : "testimonial-marquee-track-up")}>
        {[0, 1].map((copyIndex) => (
          <div key={copyIndex} className="space-y-4" aria-hidden={copyIndex === 1}>
            {items.map((item, index) => (
              <TestimonialCard key={`${item.name}-${copyIndex}-${index}`} item={item} index={index} />
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,var(--background),rgba(250,247,241,0))] dark:bg-[linear-gradient(180deg,var(--background),rgba(17,20,23,0))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(0deg,var(--background),rgba(250,247,241,0))] dark:bg-[linear-gradient(0deg,var(--background),rgba(17,20,23,0))]" />
    </div>
  );
}

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
  const desktopColumns = items.reduce<[TestimonialItem[], TestimonialItem[]]>(
    (columns, item, index) => {
      const targetColumn = index % 2 === 0 ? columns[0] : columns[1];
      targetColumn.push(item);
      return columns;
    },
    [[], []],
  );

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

      <div className="lg:hidden">
        <TestimonialMarquee items={items} className="h-[34rem] sm:h-[38rem]" />
      </div>

      <div className="hidden gap-4 lg:grid lg:grid-cols-2">
        <TestimonialMarquee items={desktopColumns[0]} className="h-[40rem]" />
        <TestimonialMarquee items={desktopColumns[1]} reverse className="h-[40rem]" />
      </div>
    </section>
  );
}
