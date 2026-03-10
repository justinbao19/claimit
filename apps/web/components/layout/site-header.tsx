"use client";

import { usePathname } from "next/navigation";

import { AppNav } from "./app-nav";
import { MarketingNav } from "./marketing-nav";

export function SiteHeader() {
  const pathname = usePathname();
  const isMarketingPage = pathname === "/" || pathname === "/landing" || pathname.startsWith("/landing/");

  return isMarketingPage ? <MarketingNav /> : <AppNav />;
}
