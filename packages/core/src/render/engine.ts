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
    
    // 预处理：把内容分割成多页，每页有独立的侧边栏背景
    await page.evaluate(() => {
      const A4_HEIGHT = 1123;
      const SIDEBAR_WIDTH = 292;
      const SIDEBAR_COLOR = '#e6edf8';
      const CONTENT_PADDING_TOP = 48;
      const CONTENT_PADDING_BOTTOM = 72;
      const USABLE_HEIGHT = A4_HEIGHT - CONTENT_PADDING_TOP - CONTENT_PADDING_BOTTOM;
      
      const resumePage = document.querySelector('.resume-page') as HTMLElement;
      const mainEl = document.querySelector('.main') as HTMLElement;
      const sidebarEl = document.querySelector('.sidebar') as HTMLElement;
      if (!resumePage || !mainEl) return;
      
      const sections = Array.from(mainEl.children) as HTMLElement[];
      const blocks = sections.map(el => ({
        el,
        top: el.offsetTop,
        height: el.offsetHeight
      }));
      
      interface PageContent { startIndex: number; endIndex: number; }
      const pages: PageContent[] = [];
      let currentPageStart = 0;
      let currentPageHeight = 0;
      
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (currentPageHeight + block.height > USABLE_HEIGHT && currentPageHeight > 0) {
          pages.push({ startIndex: currentPageStart, endIndex: i - 1 });
          currentPageStart = i;
          currentPageHeight = block.height;
        } else {
          currentPageHeight += block.height;
        }
      }
      if (currentPageStart < blocks.length) {
        pages.push({ startIndex: currentPageStart, endIndex: blocks.length - 1 });
      }
      
      if (pages.length <= 1) return;
      
      resumePage.style.display = 'none';
      
      pages.forEach((pageContent, pageIndex) => {
        const pageContainer = document.createElement('div');
        pageContainer.className = 'resume-page-generated';
        pageContainer.style.cssText = `
          width: 210mm; height: 297mm; display: flex; margin: 0 auto;
          background: white; page-break-after: always; overflow: hidden;
        `;
        
        const sidebarBg = document.createElement('div');
        sidebarBg.style.cssText = `
          width: ${SIDEBAR_WIDTH}px; min-width: ${SIDEBAR_WIDTH}px; height: 100%;
          background: ${SIDEBAR_COLOR}; print-color-adjust: exact;
          -webkit-print-color-adjust: exact; padding: 48px 40px 40px;
          color: rgba(20,35,75,0.82); font-family: 'Noto Sans SC', 'Inter', sans-serif;
          overflow: hidden;
        `;
        
        if (pageIndex === 0 && sidebarEl) {
          sidebarBg.innerHTML = sidebarEl.innerHTML;
        }
        
        pageContainer.appendChild(sidebarBg);
        
        const contentArea = document.createElement('div');
        contentArea.style.cssText = `
          flex: 1; padding: ${CONTENT_PADDING_TOP}px 38px ${CONTENT_PADDING_BOTTOM}px 40px;
          overflow: hidden;
        `;
        
        for (let i = pageContent.startIndex; i <= pageContent.endIndex; i++) {
          contentArea.appendChild(blocks[i].el.cloneNode(true));
        }
        
        pageContainer.appendChild(contentArea);
        document.body.appendChild(pageContainer);
      });
    });
    
    await page.pdf({
      path: outputPath,
      format: "A4",
      preferCSSPageSize: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
      printBackground: true,
    });
  } finally {
    await browser.close();
  }
}
