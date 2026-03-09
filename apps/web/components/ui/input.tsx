import * as React from "react";

import { cn } from "../../lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-[color:var(--field-border)] bg-[color:var(--field-bg)] px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none transition duration-300 placeholder:text-[color:var(--text-tertiary)] focus:border-[color:var(--field-focus)] focus:bg-[color:var(--surface-elevated)] focus:shadow-[0_0_0_4px_var(--ring)]",
        className,
      )}
      {...props}
    />
  );
}
