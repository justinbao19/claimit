"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getMessages,
  localeCookieName,
  localeOptions,
  translate,
  type Locale,
  type Messages,
} from "../../lib/messages";

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const value = useMemo<LocaleContextValue>(() => {
    const messages = getMessages(locale);

    return {
      locale,
      messages,
      setLocale: (nextLocale) => {
        setLocaleState(nextLocale);
        document.documentElement.lang = nextLocale;
        document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
        window.localStorage.setItem(localeCookieName, nextLocale);
        router.refresh();
      },
      t: (key, values) => translate(messages, key, values),
    };
  }, [locale, router]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider.");
  }

  return context;
}

export function useTranslations() {
  return useLocale().t;
}

export { localeOptions };
