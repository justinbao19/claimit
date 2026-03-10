import path from "node:path";

export interface VaultPaths {
  root: string;
  baseResume: string;
  variantsDir: string;
  uploadsDir: string;
  evidenceDir: string;
  exportsDir: string;
  logsDir: string;
  gitignore: string;
}

export function resolveVaultRoot(vaultPath?: string): string {
  return path.resolve(vaultPath ?? process.env.RESUME_VAULT ?? "./vault");
}

export function getVaultPaths(vaultPath?: string): VaultPaths {
  const root = resolveVaultRoot(vaultPath);
  return {
    root,
    baseResume: path.join(root, "resume.base.json"),
    variantsDir: path.join(root, "variants"),
    uploadsDir: path.join(root, "artifacts", "uploads"),
    evidenceDir: path.join(root, "artifacts", "evidence"),
    exportsDir: path.join(root, "exports"),
    logsDir: path.join(root, "logs"),
    gitignore: path.join(root, ".gitignore"),
  };
}

export function getVariantPath(name: string, vaultPath?: string): string {
  return path.join(getVaultPaths(vaultPath).variantsDir, `${name}.json`);
}
