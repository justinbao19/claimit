import "./globals.css";

import { AppShell } from "../components/layout/app-shell";
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
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body>
        <Providers initialLocale={locale}>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
