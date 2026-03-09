import { access, readFile } from "node:fs/promises";
import path from "node:path";
import Handlebars from "handlebars";
import { chromium } from "playwright";

import type { Resume } from "../schema/resume";

Handlebars.registerHelper("formatDateRange", (range?: { start?: string; end?: string; ongoing?: boolean }) => {
  if (!range) {
    return "";
  }
  const end = range.ongoing ? "Present" : range.end ?? "";
  return end ? `${range.start ?? ""} - ${end}` : range.start ?? "";
});

Handlebars.registerHelper("join", (value: unknown, separator = ", ") => {
  if (!Array.isArray(value)) {
    return "";
  }
  return value.join(separator);
});

async function fileExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function resolveTemplatePath(templateId: string): Promise<string> {
  const candidates = [
    path.resolve(process.cwd(), "templates", templateId, "template.html"),
    path.resolve(process.cwd(), "..", "..", "templates", templateId, "template.html"),
    path.resolve(import.meta.dirname, "../../../../templates", templateId, "template.html"),
  ];

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return candidate;
    }
  }

  throw new Error(`Template "${templateId}" not found. Looked in: ${candidates.join(", ")}`);
}

export async function listTemplates(): Promise<string[]> {
  const candidates = [
    path.resolve(process.cwd(), "templates"),
    path.resolve(import.meta.dirname, "../../../../templates"),
  ];
  const { readdir } = await import("node:fs/promises");

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      const entries = await readdir(candidate, { withFileTypes: true });
      return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
    }
  }

  return [];
}

export async function renderToHtml(resume: Resume, templateId: string): Promise<string> {
  const templatePath = await resolveTemplatePath(templateId);
  const source = await readFile(templatePath, "utf8");
  const template = Handlebars.compile(source);
  return template(resume);
}

export async function renderToPdf(html: string, outputPath: string): Promise<void> {
  let browser;
  try {
    browser = await chromium.launch();
  } catch (error) {
    throw new Error(
      `Failed to launch Playwright Chromium. Install browsers with "corepack pnpm exec playwright install chromium". ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.pdf({
      path: outputPath,
      format: "Letter",
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
      printBackground: true,
    });
  } finally {
    await browser.close();
  }
}
