import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const cardVariants = cva(
  "relative overflow-hidden rounded-[28px] border transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        default:
          "border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.92))] shadow-[0_30px_80px_-34px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.84),rgba(15,23,42,0.72))] dark:shadow-[0_30px_80px_-34px_rgba(15,23,42,0.95)]",
        elevated:
          "border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(239,246,255,0.92))] shadow-[0_36px_100px_-36px_rgba(59,130,246,0.18)] backdrop-blur-2xl dark:border-white/12 dark:bg-[linear-gradient(180deg,rgba(30,41,59,0.96),rgba(15,23,42,0.88))] dark:shadow-[0_36px_100px_-36px_rgba(59,130,246,0.45)]",
        glass:
          "border-slate-200/80 bg-white/72 shadow-[0_24px_72px_-30px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/14 dark:bg-white/[0.06] dark:shadow-[0_24px_72px_-30px_rgba(15,23,42,0.8)]",
        panel:
          "border-slate-200/80 bg-white/90 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-[0_28px_80px_-40px_rgba(15,23,42,0.55)]",
        interactive:
          "border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] shadow-[0_24px_72px_-32px_rgba(15,23,42,0.12)] backdrop-blur-xl hover:-translate-y-1 hover:border-violet-300/60 hover:shadow-[0_34px_90px_-30px_rgba(79,70,229,0.18)] dark:border-white/12 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(15,23,42,0.72))] dark:shadow-[0_24px_72px_-32px_rgba(15,23,42,0.9)] dark:hover:border-violet-400/30 dark:hover:shadow-[0_34px_90px_-30px_rgba(79,70,229,0.6)]",
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
      className={cn(cardVariants({ variant, padding }), "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-slate-100 dark:before:bg-white/10", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold tracking-tight text-slate-950 dark:text-white", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-slate-600 dark:text-slate-300", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}
