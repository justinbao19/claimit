import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const cardVariants = cva(
  "relative overflow-hidden rounded-[28px] border transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        default:
          "border-[color:var(--border)] bg-[linear-gradient(180deg,var(--panel-strong),var(--panel))] shadow-[0_18px_44px_-30px_var(--shadow-color)] backdrop-blur-xl",
        elevated:
          "border-[color:var(--border)] bg-[linear-gradient(180deg,var(--panel-strong),var(--panel-light))] shadow-[0_24px_56px_-34px_rgba(112,82,56,0.14)] backdrop-blur-2xl dark:border-[color:var(--border)] dark:bg-[linear-gradient(180deg,rgba(30,36,41,0.98),rgba(23,27,31,0.94))]",
        glass:
          "border-[color:var(--border)] bg-[color:var(--panel)] shadow-[0_16px_38px_-28px_var(--shadow-color)] backdrop-blur-2xl",
        panel:
          "border-[color:var(--border)] bg-[color:var(--surface-elevated)] shadow-[0_14px_34px_-24px_var(--shadow-color)] backdrop-blur",
        interactive:
          "border-[color:var(--border)] bg-[linear-gradient(180deg,var(--panel-strong),var(--panel))] shadow-[0_18px_44px_-28px_var(--shadow-color)] backdrop-blur-xl hover:-translate-y-1 hover:border-[color:var(--field-border)] hover:shadow-[0_24px_56px_-30px_rgba(112,82,56,0.14)]",
      },
      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "none",
    },
  },
);

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div
      className={cn(
        cardVariants({ variant, padding }),
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[rgba(255,255,255,0.78)] dark:before:bg-[rgba(255,255,255,0.08)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold tracking-tight text-[color:var(--text-primary)]", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-[color:var(--text-secondary)]", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}
