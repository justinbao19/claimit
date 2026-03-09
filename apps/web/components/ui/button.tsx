import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(145deg,var(--accent-strong),var(--accent))] text-[color:var(--accent-contrast)] shadow-[0_18px_42px_-20px_rgba(112,82,56,0.55)] hover:-translate-y-0.5 hover:shadow-[0_22px_52px_-20px_rgba(112,82,56,0.58)]",
        secondary:
          "border border-[color:var(--border)] bg-[color:var(--surface-elevated)] text-[color:var(--text-primary)] shadow-[0_10px_26px_-22px_var(--shadow-color)] hover:border-[color:var(--field-border)] hover:bg-[color:var(--surface)]",
        ghost:
          "bg-transparent text-[color:var(--text-secondary)] hover:bg-[color:var(--surface)] hover:text-[color:var(--text-primary)]",
        subtle:
          "border border-[color:var(--border)] bg-[color:var(--surface-overlay)] text-[color:var(--text-primary)] shadow-[0_10px_26px_-22px_var(--shadow-color)] backdrop-blur hover:border-[color:var(--field-border)] hover:bg-[color:var(--surface-elevated)]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-xl px-3.5 text-xs",
        lg: "h-12 px-6 text-sm",
        icon: "size-10 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
