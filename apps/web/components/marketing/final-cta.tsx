import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export function FinalCta({
  eyebrow,
  title,
  description,
  badge,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
}) {
  return (
    <section>
      <Card variant="elevated" padding="lg" className="overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,162,123,0.16),transparent_46%),radial-gradient(circle_at_bottom,rgba(96,117,138,0.08),transparent_50%)]" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">{eyebrow}</p>
              <Badge variant="accent">{badge}</Badge>
            </div>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl">{title}</h3>
            <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">{description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={primaryCta.href}>
                {primaryCta.label}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
