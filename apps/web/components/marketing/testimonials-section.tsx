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

const testimonialCardClassName =
  "w-[20.5rem] sm:w-[22rem] lg:w-[24rem] min-h-[12rem] sm:min-h-[12.5rem] lg:min-h-[13rem]";

const testimonialTrackConfigs = [
  {
    offset: 0,
    speedClassName: "testimonial-marquee-track-forward",
    viewportClassName: "pr-4 sm:pr-6 lg:pr-8",
  },
  {
    offset: 6,
    speedClassName: "testimonial-marquee-track-reverse",
    viewportClassName: "pl-14 pr-4 sm:pl-20 sm:pr-6 lg:pl-28 lg:pr-8",
  },
] as const;

function rotateItems<T>(items: T[], offset: number): T[] {
  if (items.length === 0) {
    return items;
  }

  const normalizedOffset = ((offset % items.length) + items.length) % items.length;

  return [...items.slice(normalizedOffset), ...items.slice(0, normalizedOffset)];
}

function TestimonialCard({
  item,
  index,
  className,
}: {
  item: TestimonialItem;
  index: number;
  className?: string;
}) {
  return (
    <Card
      variant={index % 3 === 0 ? "elevated" : "default"}
      padding="default"
      className={cn("flex h-full shrink-0 flex-col justify-between", testimonialCardClassName, className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-white/45 bg-[color:var(--panel-light)] shadow-[0_14px_28px_-24px_var(--shadow-color)]">
            <Image src={item.avatarSrc} alt={item.name} fill sizes="48px" className="object-cover" />
          </div>
          <div>
            <p className="text-base font-semibold text-[color:var(--text-primary)]">{item.name}</p>
            <p className="text-sm text-[color:var(--text-secondary)]">{item.role}</p>
          </div>
        </div>
        <Quote className="size-5 shrink-0 text-[color:var(--accent)]" />
      </div>
      <p className="mt-4 text-sm leading-6 text-[color:var(--text-secondary)]">{item.quote}</p>
    </Card>
  );
}

function TestimonialTrack({
  items,
  animationClassName,
  viewportClassName,
}: {
  items: TestimonialItem[];
  animationClassName: string;
  viewportClassName?: string;
}) {
  return (
    <div className={cn("overflow-hidden", viewportClassName)}>
      <div className={cn("flex w-max items-start gap-4", animationClassName)}>
        {[0, 1].map((copyIndex) => (
          <div key={copyIndex} className="flex shrink-0 items-start gap-4" aria-hidden={copyIndex === 1}>
            {items.map((item, index) => (
              <TestimonialCard key={`${item.name}-${copyIndex}-${index}`} item={item} index={index} />
            ))}
          </div>
        ))}
      </div>
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
  const tracks = testimonialTrackConfigs.map((config) => ({
    ...config,
    items: rotateItems(items, config.offset),
  }));

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

      <div className="testimonial-marquee relative overflow-hidden py-3 sm:py-4">
        <div className="space-y-4 sm:space-y-5">
          {tracks.map((track) => (
            <div key={track.offset}>
              <TestimonialTrack items={track.items} animationClassName={track.speedClassName} viewportClassName={track.viewportClassName} />
            </div>
          ))}
        </div>
        <div className="testimonial-marquee-fade-left absolute inset-y-0 left-0 z-10 w-20 sm:w-24 lg:w-28" />
        <div className="testimonial-marquee-fade-right absolute inset-y-0 right-0 z-10 w-20 sm:w-24 lg:w-28" />
      </div>
    </section>
  );
}
