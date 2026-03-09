import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.16em] uppercase",
  {
    variants: {
      variant: {
        default: "border-[color:var(--border)] bg-[color:var(--surface-overlay)] text-[color:var(--text-secondary)]",
        panel: "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-secondary)]",
        accent: "border-[rgba(138,104,70,0.2)] bg-[rgba(138,104,70,0.08)] text-[color:var(--accent)]",
        success: "border-[rgba(69,106,90,0.22)] bg-[rgba(69,106,90,0.08)] text-[color:var(--success)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
