import Link from "next/link";

import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Claimit",
  description: "Agent-first resume memory and rendering toolkit",
};

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/import", label: "Import" },
  { href: "/memory", label: "Memory" },
  { href: "/assistant", label: "Assistant" },
  { href: "/variants", label: "Variants" },
  { href: "/render", label: "Render" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen">
            <header className="border-b border-slate-200 bg-white">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Claimit</p>
                  <h1 className="text-xl font-semibold text-slate-900">Always-ready resume workspace</h1>
                </div>
                <nav className="flex flex-wrap gap-3 text-sm text-slate-600">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="rounded-full px-3 py-1 hover:bg-slate-100">
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </header>
            <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
