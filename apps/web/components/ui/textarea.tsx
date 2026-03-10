import * as React from "react";

import { cn } from "../../lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full rounded-[24px] border border-[color:var(--border)] bg-[color:var(--field-bg)] px-4 py-3 text-sm text-[color:var(--text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition duration-300 placeholder:text-[color:var(--text-tertiary)] focus:border-[color:var(--field-focus)] focus:bg-[color:var(--surface-elevated)] focus:shadow-[0_0_0_4px_var(--ring)]",
        className,
      )}
      {...props}
    />
  );
}
