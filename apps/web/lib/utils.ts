import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDateRangeLabel(
  range?: { start?: string; end?: string; ongoing?: boolean },
  labels: { present: string; unavailable: string } = { present: "Present", unavailable: "Date unavailable" },
): string {
  if (!range?.start) {
    return labels.unavailable;
  }

  if (range.ongoing) {
    return `${range.start} - ${labels.present}`;
  }

  return range.end ? `${range.start} - ${range.end}` : range.start;
}

export function getInitials(value?: string): string {
  if (!value?.trim()) {
    return "CL";
  }

  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatCount(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale).format(value);
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
