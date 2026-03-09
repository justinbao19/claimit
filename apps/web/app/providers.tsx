"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "next-themes";
import { useState } from "react";
import { Toaster } from "sonner";

import type { Locale } from "../lib/messages";
import { LocaleProvider } from "../components/layout/locale-provider";

function AppToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      richColors
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "border border-[color:var(--border)] bg-[color:var(--surface-elevated)] text-[color:var(--text-primary)] shadow-[0_24px_60px_-36px_var(--shadow-color)] dark:bg-[color:var(--surface-elevated)]",
          description: "text-[color:var(--text-secondary)]",
        },
      }}
    />
  );
}

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
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LocaleProvider initialLocale={initialLocale}>
        <QueryClientProvider client={queryClient}>
          {children}
          <AppToaster />
        </QueryClientProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
