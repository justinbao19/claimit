import { readFile, writeFile } from "node:fs/promises";

export interface CommonOptions {
  vault?: string;
  json?: boolean;
  human?: boolean;
  quiet?: boolean;
  stdin?: boolean;
}

export function shouldOutputJson(options: CommonOptions): boolean {
  if (options.human) {
    return false;
  }
  return true;
}

export function output(value: unknown, options: CommonOptions): void {
  if (options.quiet) {
    return;
  }

  if (shouldOutputJson(options)) {
    process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
    return;
  }

  if (typeof value === "string") {
    process.stdout.write(`${value}\n`);
    return;
  }

  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

export async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function readJsonInput<T>(filePath: string | undefined, useStdin?: boolean): Promise<T> {
  const raw = useStdin ? await readStdin() : filePath ? await readFile(filePath, "utf8") : "";
  if (!raw.trim()) {
    throw new Error("Expected JSON input from a file or stdin, but no content was provided.");
  }
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    throw new Error(`Failed to parse JSON input: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function writeTextFile(filePath: string, contents: string): Promise<void> {
  await writeFile(filePath, contents, "utf8");
}
