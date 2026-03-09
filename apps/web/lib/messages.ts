import en from "../messages/en.json";
import jaJP from "../messages/ja-JP.json";
import zhCN from "../messages/zh-CN.json";

export const localeCookieName = "claimit-locale";

export const localeOptions = [
  { value: "en", label: "English", shortLabel: "EN" },
  { value: "zh-CN", label: "简体中文", shortLabel: "中文" },
  { value: "ja-JP", label: "日本語", shortLabel: "日本語" },
] as const;

export type Locale = (typeof localeOptions)[number]["value"];

export const defaultLocale: Locale = "en";

export type Messages = typeof en;

export const allMessages: Record<Locale, Messages> = {
  en,
  "zh-CN": zhCN,
  "ja-JP": jaJP,
};

export function isLocale(value: string): value is Locale {
  return localeOptions.some((option) => option.value === value);
}

export function normalizeLocale(value?: string | null): Locale {
  if (!value) {
    return defaultLocale;
  }

  if (isLocale(value)) {
    return value;
  }

  if (value.startsWith("zh")) {
    return "zh-CN";
  }

  if (value.startsWith("ja")) {
    return "ja-JP";
  }

  return defaultLocale;
}

export function getMessages(locale: Locale): Messages {
  return allMessages[locale];
}

function resolvePath(messages: Messages, key: string): string | undefined {
  const value = key.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object" || !(segment in current)) {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, messages);

  return typeof value === "string" ? value : undefined;
}

export function translate(messages: Messages, key: string, values?: Record<string, string | number>): string {
  const template = resolvePath(messages, key);

  if (!template) {
    return key;
  }

  if (!values) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_match, token: string) => String(values[token] ?? `{${token}}`));
}

export function formatNumberForLocale(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale).format(value);
}

export const assistantGoalLabelKeys = {
  quantify_impact: "assistant.goals.quantifyImpact",
  clarify_action: "assistant.goals.clarifyAction",
  add_scope: "assistant.goals.addScope",
  add_summary: "assistant.goals.addSummary",
} as const satisfies Record<string, string>;
