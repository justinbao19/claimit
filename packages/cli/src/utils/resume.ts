import {
  loadBaseResume,
  loadVariant,
  saveBaseResume,
  saveVariant,
  type Resume,
  type Variant,
} from "@claimit/core";

export async function loadResumeByVariant(vault: string | undefined, variant?: string): Promise<Resume | Variant> {
  if (variant) {
    return loadVariant(variant, vault);
  }
  return loadBaseResume(vault);
}

export async function saveResumeByVariant(
  resume: Resume | Variant,
  vault: string | undefined,
  variant?: string,
): Promise<void> {
  if (variant) {
    await saveVariant(resume as Variant, vault);
    return;
  }
  await saveBaseResume(resume as Resume, vault);
}

export function parseCsv(value?: string): string[] {
  return value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}
