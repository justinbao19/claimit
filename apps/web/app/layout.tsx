import "./globals.css";

import { AmbientBackground } from "../components/layout/ambient-background";
import { AppNav } from "../components/layout/app-nav";
import { ContentFrame } from "../components/layout/content-frame";
import { getServerI18n } from "../lib/i18n";
import { Providers } from "./providers";

export const metadata = {
  title: "Claimit",
  description: "Claimit is a structured resume workspace for evidence, role-specific versions, and polished exports.",
  manifest: "/site.webmanifest",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale } = await getServerI18n();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <Providers initialLocale={locale}>
          <div className="relative min-h-screen overflow-hidden">
            <AmbientBackground />
            <div className="relative z-10 mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
              <header className="sticky top-4 z-30 rounded-[30px] border border-[color:var(--border)] bg-[color:var(--surface-overlay)] px-4 py-4 shadow-[0_28px_72px_-40px_var(--shadow-color)] backdrop-blur-2xl sm:px-6">
                <AppNav />
              </header>
            </div>
            <ContentFrame>{children}</ContentFrame>
          </div>
        </Providers>
      </body>
    </html>
  );
}
