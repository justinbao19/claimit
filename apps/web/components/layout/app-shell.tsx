"use client";

import { usePathname } from "next/navigation";

import { AmbientBackground } from "./ambient-background";
import { ContentFrame } from "./content-frame";
import { SiteHeader } from "./site-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketingPage = pathname === "/" || pathname === "/landing" || pathname.startsWith("/landing/");

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AmbientBackground />
      {isMarketingPage ? null : (
        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <header className="sticky top-4 z-30 rounded-[30px] border border-[color:var(--border)] bg-[color:var(--surface-overlay)] px-4 py-4 shadow-[0_18px_42px_-30px_var(--shadow-color)] backdrop-blur-2xl sm:px-6">
            <SiteHeader />
          </header>
        </div>
      )}
      <ContentFrame>{children}</ContentFrame>
    </div>
  );
}
