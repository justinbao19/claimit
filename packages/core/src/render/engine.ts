import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Handlebars from "handlebars";
import { chromium } from "playwright";

import type { Resume } from "../schema/resume";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

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

Handlebars.registerHelper("initials", (value: unknown) => {
  const str = typeof value === "string" ? value : "";
  if (!str.trim()) return "CV";
  return str
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
});

Handlebars.registerHelper("abbr", (value: unknown) => {
  const str = typeof value === "string" ? value : "";
  if (!str.trim()) return "??";
  const words = str.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0]?.[0] ?? "").toUpperCase() + (words[1]?.[0] ?? "").toLowerCase();
  }
  return str.slice(0, 2);
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
    path.resolve(moduleDir, "../../../../templates", templateId, "template.html"),
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
    path.resolve(moduleDir, "../../../../templates"),
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

/**
 * Resolve basics.photo to a data URL if it points to a local file path.
 * This allows CLI users to specify absolute/relative paths, and web users
 * to upload a file to vault — both transparently work in Playwright rendering.
 */
async function resolvePhotoToDataUrl(photo: string): Promise<string> {
  if (photo.startsWith("http") || photo.startsWith("data:")) {
    return photo;
  }
  try {
    const absolutePath = path.isAbsolute(photo)
      ? photo
      : path.resolve(process.cwd(), photo);
    const buffer = await readFile(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase().replace(".", "");
    const mime = ext === "jpg" ? "jpeg" : ext || "jpeg";
    return `data:image/${mime};base64,${buffer.toString("base64")}`;
  } catch {
    return photo;
  }
}

export async function renderToHtml(resume: Resume, templateId: string): Promise<string> {
  let data = resume;
  if (data.basics?.photo) {
    data = {
      ...data,
      basics: { ...data.basics, photo: await resolvePhotoToDataUrl(data.basics.photo) },
    };
  }
  const templatePath = await resolveTemplatePath(templateId);
  const source = await readFile(templatePath, "utf8");
  const template = Handlebars.compile(source);
  return template(data);
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
      preferCSSPageSize: true, // templates with @page { size: A4 } override format
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
