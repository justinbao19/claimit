import { basename, extname } from "node:path";
import { readFile } from "node:fs/promises";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import { ResumeSchema, type DateRange, type Education, type Experience, type Project, type Resume, type SkillCategory } from "../schema/resume";

const ParseReportSchema = z.object({
  source_file: z.string(),
  detected_sections: z.array(z.string()),
  warnings: z.array(z.string()),
  imported_counts: z.object({
    experience: z.number(),
    projects: z.number(),
    education: z.number(),
    skills: z.number(),
  }),
});

export type ParseReport = z.infer<typeof ParseReportSchema>;

export interface ImportResumeResult {
  resume: Resume;
  parse_report: ParseReport;
  text: string;
}

type SectionName = "summary" | "experience" | "projects" | "education" | "skills" | "other";

const SECTION_KEYWORDS: Array<{ section: SectionName; keywords: string[] }> = [
  { section: "summary", keywords: ["summary", "profile", "about"] },
  { section: "experience", keywords: ["experience", "work experience", "professional experience"] },
  { section: "projects", keywords: ["projects", "selected projects"] },
  { section: "education", keywords: ["education", "academic background"] },
  { section: "skills", keywords: ["skills", "technical skills", "core skills"] },
];

function cleanLine(line: string): string {
  return line.replace(/\u2022/g, "-").trim();
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\r/g, "").replace(/\t/g, " ").replace(/[ ]{2,}/g, " ").trim();
}

function isBullet(line: string): boolean {
  return /^[-*•]/.test(line.trim());
}

function guessSection(line: string): SectionName | null {
  const normalized = line.toLowerCase().replace(/[:\s]+$/g, "").trim();
  for (const entry of SECTION_KEYWORDS) {
    if (entry.keywords.includes(normalized)) {
      return entry.section;
    }
  }
  return null;
}

function splitLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => cleanLine(line))
    .filter(Boolean);
}

function parseDateRange(text?: string): DateRange {
  const fallback = new Date().toISOString().slice(0, 7);
  if (!text) {
    return {
      start: fallback,
    };
  }

  const normalized = text
    .replace(/present|current/gi, "Present")
    .replace(/[–—]/g, "-")
    .trim();

  const matches = normalized.match(/\b\d{4}(?:[-/.]\d{2})?(?:[-/.]\d{2})?\b/g);
  if (!matches || matches.length === 0) {
    return { start: fallback };
  }

  const toClaimitDate = (value: string): string => value.replace(/\//g, "-").replace(/\./g, "-");
  return {
    start: toClaimitDate(matches[0]),
    ...(matches[1] ? { end: toClaimitDate(matches[1]) } : normalized.includes("Present") ? { ongoing: true } : {}),
  };
}

function parseHeaderAndDate(line: string): { label: string; dateRange: DateRange } {
  const parts = line.split("|").map((item) => item.trim()).filter(Boolean);
  if (parts.length > 1) {
    return {
      label: parts[0] ?? line,
      dateRange: parseDateRange(parts.at(-1)),
    };
  }
  return {
    label: line,
    dateRange: parseDateRange(line),
  };
}

function parseExperienceSection(lines: string[]): Experience[] {
  const entries: Experience[] = [];
  let current: Experience | null = null;

  const pushCurrent = (): void => {
    if (!current) {
      return;
    }
    entries.push(current);
    current = null;
  };

  for (const line of lines) {
    if (isBullet(line)) {
      if (current) {
        current.highlights.push(line.replace(/^[-*•]\s*/, ""));
      }
      continue;
    }

    pushCurrent();
    const { label, dateRange } = parseHeaderAndDate(line);
    const segments = label.split(/,| at /i).map((item) => item.trim()).filter(Boolean);
    current = {
      id: uuid(),
      title: segments[0] ?? label,
      company: segments[1] ?? "Unknown Company",
      date_range: dateRange,
      highlights: [],
      achievement_ids: [],
    };
  }

  pushCurrent();
  return entries;
}

function parseProjectSection(lines: string[]): Project[] {
  const entries: Project[] = [];
  let current: Project | null = null;

  const pushCurrent = (): void => {
    if (current) {
      entries.push(current);
      current = null;
    }
  };

  for (const line of lines) {
    if (isBullet(line)) {
      if (current) {
        current.highlights.push(line.replace(/^[-*•]\s*/, ""));
      }
      continue;
    }

    pushCurrent();
    const { label, dateRange } = parseHeaderAndDate(line);
    current = {
      id: uuid(),
      name: label,
      description: label,
      date_range: dateRange,
      highlights: [],
      achievement_ids: [],
      tools: [],
    };
  }

  pushCurrent();
  return entries;
}

function parseEducationSection(lines: string[]): Education[] {
  return lines.map((line) => {
    const { label, dateRange } = parseHeaderAndDate(line);
    const parts = label.split(/,| \| /).map((item) => item.trim()).filter(Boolean);
    return {
      id: uuid(),
      degree: parts[0] ?? label,
      institution: parts[1] ?? "Unknown Institution",
      date_range: dateRange,
      highlights: [],
    };
  });
}

function parseSkillsSection(lines: string[]): SkillCategory[] {
  const categories: SkillCategory[] = [];
  for (const line of lines) {
    const [rawCategory, rawItems] = line.split(":");
    if (!rawItems) {
      categories.push({
        category: "General",
        items: line.split(",").map((item) => item.trim()).filter(Boolean),
      });
      continue;
    }
    categories.push({
      category: (rawCategory ?? "General").trim(),
      items: rawItems.split(",").map((item) => item.trim()).filter(Boolean),
    });
  }
  return categories;
}

function parseSummarySection(lines: string[]): string | undefined {
  const summary = lines.join(" ").trim();
  return summary || undefined;
}

function segmentSections(text: string): Record<SectionName, string[]> {
  const grouped: Record<SectionName, string[]> = {
    summary: [],
    experience: [],
    projects: [],
    education: [],
    skills: [],
    other: [],
  };

  let currentSection: SectionName = "other";
  for (const rawLine of splitLines(text)) {
    const nextSection = guessSection(rawLine);
    if (nextSection) {
      currentSection = nextSection;
      continue;
    }
    grouped[currentSection].push(rawLine);
  }

  return grouped;
}

function extractBasics(text: string): Resume["basics"] {
  const lines = splitLines(text);
  const firstLine = lines[0] ?? "Your Name";
  const email = lines.find((line) => /\b\S+@\S+\.\S+\b/.test(line))?.match(/\b\S+@\S+\.\S+\b/)?.[0];
  const phone = lines.find((line) => /(\+?\d[\d\s\-()]{7,})/.test(line))?.match(/(\+?\d[\d\s\-()]{7,})/)?.[0];
  const linkedin = lines.find((line) => /linkedin\.com/i.test(line))?.match(/https?:\/\/\S+/)?.[0];
  const github = lines.find((line) => /github\.com/i.test(line))?.match(/https?:\/\/\S+/)?.[0];
  const website = lines.find((line) => /^https?:\/\//i.test(line))?.match(/https?:\/\/\S+/)?.[0];

  return {
    name: firstLine,
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    ...(linkedin ? { linkedin } : {}),
    ...(github ? { github } : {}),
    ...(website ? { website } : {}),
  };
}

export function parseResumeText(text: string, sourceFile = "inline"): ImportResumeResult {
  const normalized = normalizeWhitespace(text);
  const sections = segmentSections(normalized);
  const now = new Date().toISOString();

  const resume = ResumeSchema.parse({
    $schema: "claimit/v0.2",
    basics: {
      ...extractBasics(normalized),
      summary: parseSummarySection(sections.summary),
    },
    experience: parseExperienceSection(sections.experience),
    projects: parseProjectSection(sections.projects),
    education: parseEducationSection(sections.education),
    skills: parseSkillsSection(sections.skills),
    achievements: [],
    claims: [],
    meta: {
      created_at: now,
      updated_at: now,
      version: "0.2.0",
      raw_import: normalized,
    },
  });

  const detectedSections = Object.entries(sections)
    .filter(([, lines]) => lines.length > 0)
    .map(([name]) => name)
    .filter((name) => name !== "other");

  const warnings: string[] = [];
  if (resume.experience.length === 0) {
    warnings.push("No experience section detected. Review the imported resume text.");
  }
  if (resume.skills.length === 0) {
    warnings.push("No skills section detected. Consider adding skills manually.");
  }

  return {
    resume,
    text: normalized,
    parse_report: ParseReportSchema.parse({
      source_file: sourceFile,
      detected_sections: detectedSections,
      warnings,
      imported_counts: {
        experience: resume.experience.length,
        projects: resume.projects.length,
        education: resume.education.length,
        skills: resume.skills.length,
      },
    }),
  };
}

export async function extractTextFromFile(filePath: string): Promise<string> {
  const extension = extname(filePath).toLowerCase();
  if (extension === ".pdf") {
    const buffer = await readFile(filePath);
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  if (extension === ".docx") {
    const buffer = await readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (extension === ".json" || extension === ".txt" || extension === ".md") {
    return readFile(filePath, "utf8");
  }

  throw new Error(`Unsupported import file type "${extension}" for ${basename(filePath)}. Use PDF, DOCX, JSON, or TXT.`);
}

export async function importResumeFile(filePath: string): Promise<ImportResumeResult> {
  const extension = extname(filePath).toLowerCase();
  const rawContents = await extractTextFromFile(filePath);

  if (extension === ".json") {
    try {
      const resume = ResumeSchema.parse(JSON.parse(rawContents));
      return {
        resume,
        text: JSON.stringify(resume, null, 2),
        parse_report: ParseReportSchema.parse({
          source_file: filePath,
          detected_sections: ["summary", "experience", "projects", "education", "skills"],
          warnings: [],
          imported_counts: {
            experience: resume.experience.length,
            projects: resume.projects.length,
            education: resume.education.length,
            skills: resume.skills.length,
          },
        }),
      };
    } catch {
      return parseResumeText(rawContents, filePath);
    }
  }

  return parseResumeText(rawContents, filePath);
}
