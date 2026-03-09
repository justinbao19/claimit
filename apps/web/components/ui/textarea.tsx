import * as React from "react";

import { cn } from "../../lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(139,92,246,0.08)] dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-violet-400/50 dark:focus:bg-white/[0.08]",
        className,
      )}
      {...props}
    />
  );
}
