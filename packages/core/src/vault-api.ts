import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { v4 as uuid } from "uuid";

import { ResumeSchema, type Resume, VariantSchema, type Variant } from "./schema/resume";
import { getVariantPath, getVaultPaths, resolveVaultRoot, type VaultPaths } from "./vault-paths";

export interface InitVaultResult {
  root: string;
  created: boolean;
  paths: VaultPaths;
  resume: Resume;
}

export interface SaveResult<T> {
  path: string;
  value: T;
}

function nowIso(): string {
  return new Date().toISOString();
}

export function createEmptyResume(): Resume {
  const now = nowIso();
  return ResumeSchema.parse({
    $schema: "claimit/v0.2",
    basics: {
      name: "Your Name",
    },
    experience: [],
    projects: [],
    education: [],
    skills: [],
    achievements: [],
    claims: [],
    meta: {
      created_at: now,
      updated_at: now,
      version: "0.2.0",
    },
  });
}

async function ensureDirectoryStructure(paths: VaultPaths): Promise<void> {
  await Promise.all([
    mkdir(paths.root, { recursive: true }),
    mkdir(paths.variantsDir, { recursive: true }),
    mkdir(paths.uploadsDir, { recursive: true }),
    mkdir(paths.evidenceDir, { recursive: true }),
    mkdir(paths.exportsDir, { recursive: true }),
    mkdir(paths.logsDir, { recursive: true }),
  ]);
}

async function writeVaultGitignore(paths: VaultPaths): Promise<void> {
  const contents = ["*", "!.gitignore", "!README.md"].join("\n");
  await writeFile(paths.gitignore, `${contents}\n`, "utf8");
}

async function writeVaultReadme(paths: VaultPaths): Promise<void> {
  const readmePath = path.join(paths.root, "README.md");
  const contents = [
    "# Claimit Vault",
    "",
    "This directory stores local resume data, generated variants, exports, and evidence artifacts.",
    "Treat the contents as sensitive and do not commit real personal data.",
  ].join("\n");
  await writeFile(readmePath, `${contents}\n`, "utf8");
}

async function fileExists(targetPath: string): Promise<boolean> {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function initVault(vaultPath?: string): Promise<InitVaultResult> {
  const paths = getVaultPaths(vaultPath);
  await ensureDirectoryStructure(paths);
  await writeVaultGitignore(paths);
  await writeVaultReadme(paths);

  let created = false;
  let resume: Resume;
  if (await fileExists(paths.baseResume)) {
    resume = await loadBaseResume(vaultPath);
  } else {
    created = true;
    resume = createEmptyResume();
    await writeFile(paths.baseResume, `${JSON.stringify(resume, null, 2)}\n`, "utf8");
  }

  return {
    root: resolveVaultRoot(vaultPath),
    created,
    paths,
    resume,
  };
}

function parseJsonFile<T>(contents: string, parser: (value: unknown) => T, filePath: string): T {
  try {
    return parser(JSON.parse(contents));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse JSON file at ${filePath}: ${message}`);
  }
}

async function readJsonFile<T>(filePath: string, parser: (value: unknown) => T, missingMessage: string): Promise<T> {
  try {
    const contents = await readFile(filePath, "utf8");
    return parseJsonFile(contents, parser, filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(missingMessage);
    }
    throw error;
  }
}

export async function loadBaseResume(vaultPath?: string): Promise<Resume> {
  const filePath = getVaultPaths(vaultPath).baseResume;
  return readJsonFile(filePath, (value) => ResumeSchema.parse(value), `Base resume not found at ${filePath}`);
}

function touchResumeMeta<T extends Resume | Variant>(value: T): T {
  const updated = {
    ...value,
    meta: {
      ...value.meta,
      updated_at: nowIso(),
    },
  };
  return updated as T;
}

export async function saveBaseResume(resume: Resume, vaultPath?: string): Promise<SaveResult<Resume>> {
  const paths = getVaultPaths(vaultPath);
  await ensureDirectoryStructure(paths);
  const value = touchResumeMeta(ResumeSchema.parse(resume));
  await writeFile(paths.baseResume, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  return {
    path: paths.baseResume,
    value,
  };
}

export async function listVariants(vaultPath?: string): Promise<string[]> {
  const paths = getVaultPaths(vaultPath);
  if (!(await fileExists(paths.variantsDir))) {
    return [];
  }

  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(paths.variantsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name.replace(/\.json$/, ""))
    .sort();
}

export async function loadVariant(name: string, vaultPath?: string): Promise<Variant> {
  const filePath = getVariantPath(name, vaultPath);
  return readJsonFile(filePath, (value) => VariantSchema.parse(value), `Variant "${name}" not found at ${filePath}`);
}

export async function saveVariant(variant: Variant, vaultPath?: string): Promise<SaveResult<Variant>> {
  const parsed = VariantSchema.parse(variant);
  const filePath = getVariantPath(parsed.variant_meta.name, vaultPath);
  await ensureDirectoryStructure(getVaultPaths(vaultPath));
  const value = touchResumeMeta(parsed);
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  return {
    path: filePath,
    value,
  };
}

export async function deleteVariant(name: string, vaultPath?: string): Promise<void> {
  await rm(getVariantPath(name, vaultPath), { force: true });
}

export interface CreateAchievementInput {
  title: string;
  summary: string;
  dateStart?: string;
  dateEnd?: string;
  actions?: string[];
  tools?: string[];
  tags?: string[];
}

export function createAchievementRecord(input: CreateAchievementInput) {
  const now = nowIso();
  return {
    id: uuid(),
    title: input.title,
    date_range: {
      start: input.dateStart ?? now.slice(0, 10),
      ...(input.dateEnd ? { end: input.dateEnd } : { ongoing: true }),
    },
    summary: input.summary,
    actions: (input.actions ?? []).map((text) => ({ text })),
    impact: [],
    tools: input.tools ?? [],
    evidence: [],
    tags: input.tags ?? [],
    confidence: 0.75,
    source: "user" as const,
    created_at: now,
    updated_at: now,
  };
}
