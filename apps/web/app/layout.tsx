import "./globals.css";
import { AmbientBackground } from "../components/layout/ambient-background";
import { AppNav } from "../components/layout/app-nav";
import { ContentFrame } from "../components/layout/content-frame";
import { Providers } from "./providers";

export const metadata = {
  title: "Claimit",
  description: "Agent-first resume memory and rendering toolkit",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="relative min-h-screen overflow-hidden">
            <AmbientBackground />
            <div className="relative z-10 mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
              <header className="sticky top-4 z-30 rounded-[30px] border border-slate-200/80 bg-white/80 px-4 py-4 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60 dark:shadow-[0_30px_80px_-40px_rgba(15,23,42,1)] sm:px-6">
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
