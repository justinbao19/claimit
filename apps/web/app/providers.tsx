"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

import type { Locale } from "../lib/messages";
import { LocaleProvider } from "../components/layout/locale-provider";

export function Providers({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <LocaleProvider initialLocale={initialLocale}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          richColors
          theme="dark"
          position="top-right"
          toastOptions={{
            classNames: {
              toast:
                "border border-[color:var(--border)] bg-[color:var(--surface-elevated)] text-[color:var(--text-primary)] shadow-[0_24px_60px_-36px_var(--shadow-color)]",
              description: "text-[color:var(--text-secondary)]",
            },
          }}
        />
      </QueryClientProvider>
    </LocaleProvider>
  );
}
