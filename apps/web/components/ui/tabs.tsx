import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex rounded-[20px] border border-[color:var(--border)] bg-[color:var(--panel)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex min-w-[120px] items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)] data-[state=active]:bg-[color:var(--surface-elevated)] data-[state=active]:text-[color:var(--text-primary)] data-[state=active]:shadow-[0_8px_18px_-18px_var(--shadow-color)]",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn("outline-none", className)} {...props} />;
}
