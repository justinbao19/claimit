import { access } from "node:fs/promises";
import { join, resolve } from "node:path";

import { loadBaseResume, loadVariant, type Resume, type Variant } from "@claimit/core";

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function isEffectivelyEmptyResume(resume: Resume | Variant): boolean {
  return (
    resume.basics.name === "Your Name" &&
    !resume.basics.summary &&
    !resume.basics.email &&
    !resume.basics.phone &&
    !resume.basics.location &&
    !resume.basics.linkedin &&
    !resume.basics.github &&
    !resume.basics.website &&
    resume.experience.length === 0 &&
    resume.projects.length === 0 &&
    resume.education.length === 0 &&
    resume.skills.length === 0
  );
}

async function resolveSampleVaultPath(): Promise<string | null> {
  const candidates = [
    resolve(process.cwd(), "examples", "sample-vault"),
    resolve(process.cwd(), "..", "..", "examples", "sample-vault"),
  ];

  for (const candidate of candidates) {
    if (await pathExists(join(candidate, "resume.base.json"))) {
      return candidate;
    }
  }

  return null;
}

export async function loadPreviewResume(variant?: string): Promise<Resume | Variant> {
  if (variant) {
    return loadVariant(variant);
  }

  const resume = await loadBaseResume();
  if (!isEffectivelyEmptyResume(resume)) {
    return resume;
  }

  const sampleVaultPath = await resolveSampleVaultPath();
  if (!sampleVaultPath) {
    return resume;
  }

  const sample = await loadBaseResume(sampleVaultPath);

  // Carry over user-uploaded photo even when falling back to sample data
  if (resume.basics.photo) {
    sample.basics.photo = resume.basics.photo;
  }

  return sample;
}
