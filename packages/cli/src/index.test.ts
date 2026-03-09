import { execFile } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("cli", () => {
  it("initializes a vault via the init command", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "claimit-cli-"));
    const packageDir = path.resolve(import.meta.dirname, "..");

    const { stdout } = await execFileAsync(
      "corepack",
      ["pnpm", "tsx", "src/index.ts", "init", "--vault", tempDir, "--json"],
      {
        cwd: packageDir,
      },
    );

    const parsed = JSON.parse(stdout) as { root: string; created: boolean };
    expect(parsed.root).toBe(tempDir);
    expect(parsed.created).toBe(true);
  });
});
