import { cookies, headers } from "next/headers";

import { defaultLocale, getMessages, localeCookieName, normalizeLocale, translate, type Locale } from "./messages";

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;

  if (cookieLocale) {
    return normalizeLocale(cookieLocale);
  }

  const headerStore = await headers();
  return normalizeLocale(headerStore.get("accept-language")?.split(",")[0]);
}

export async function getServerI18n(locale?: Locale) {
  const activeLocale = locale ?? (await getRequestLocale());
  const messages = getMessages(activeLocale);

  return {
    locale: activeLocale,
    messages,
    t: (key: string, values?: Record<string, string | number>) => translate(messages, key, values),
  };
}

export { defaultLocale, localeCookieName } from "./messages";
export type { Locale, Messages } from "./messages";
