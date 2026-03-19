import { basename, extname } from "node:path";
import { readFile } from "node:fs/promises";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import {
  ResumeSchema,
  type DateRange,
  type Education,
  type Experience,
  type Project,
  type Resume,
  type SkillCategory,
} from "../schema/resume";

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

// "basics" handles Chinese 个人信息 section separately from "summary"
type SectionName = "basics" | "summary" | "experience" | "projects" | "education" | "skills" | "other";

const SECTION_KEYWORDS: Array<{ section: SectionName; keywords: string[] }> = [
  { section: "basics", keywords: ["个人信息"] },
  {
    section: "summary",
    keywords: ["summary", "profile", "about", "个人简介", "自我评价", "个人总结", "概述", "プロフィール", "概要"],
  },
  {
    section: "experience",
    keywords: [
      "experience", "work experience", "professional experience",
      "工作经历", "工作经验", "职业经历", "实习经历", "職務経歴", "職歴",
    ],
  },
  {
    section: "projects",
    keywords: ["projects", "selected projects", "项目经历", "项目经验", "プロジェクト"],
  },
  {
    section: "education",
    keywords: ["education", "academic background", "教育背景", "教育经历", "学历", "学歴"],
  },
  {
    section: "skills",
    keywords: [
      "skills", "technical skills", "core skills",
      "专业技能", "技能", "核心技能", "技术能力",
      "个人亮点", "其它", "其他",
      "スキル",
    ],
  },
];

// Middle dot variants used as delimiters in Chinese/Japanese text
const MIDDLE_DOT_RE = /[·・･\u00B7\u30FB\uFF65]/;

function cleanLine(line: string): string {
  return line.replace(/\u2022/g, "-").trim();
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\r/g, "").replace(/\t/g, " ").replace(/[ ]{2,}/g, " ").trim();
}

function isBullet(line: string): boolean {
  return /^[-*•]/.test(line.trim());
}

/** Returns true when a line contains a year-month pattern — reliable indicator of an entry header */
function isEntryHeader(line: string): boolean {
  return /\d{4}[-./]\d{2}/.test(line);
}

function guessSection(line: string): SectionName | null {
  // Normalise for English (lowercase, strip trailing punctuation/spaces)
  const normalizedEn = line.toLowerCase().replace(/[：:\s]+$/g, "").trim();
  // Keep original for Chinese (stripping only trailing punctuation)
  const normalizedZh = line.replace(/[：:\s]+$/g, "").trim();
  for (const entry of SECTION_KEYWORDS) {
    if (entry.keywords.includes(normalizedEn) || entry.keywords.includes(normalizedZh)) {
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

/**
 * Split an entry header into the label (left of first date) and the rest (date + location).
 * Example: "上海焜耀·海外运营主管 2022-01 - 2024-05 · 上海"
 *       → { label: "上海焜耀·海外运营主管", rest: "2022-01 - 2024-05 · 上海" }
 */
function splitHeaderLine(line: string): { label: string; rest: string } {
  const dateMatch = line.match(/\d{4}[-./]\d{2}/);
  if (!dateMatch || dateMatch.index === undefined) {
    return { label: line.trim(), rest: "" };
  }
  return {
    label: line.slice(0, dateMatch.index).trim(),
    rest: line.slice(dateMatch.index).trim(),
  };
}

/**
 * From a "2022-01 - 2024-05 · 上海" string, extract dateStr and optional location.
 * Only treats the trailing segment as a location if it contains no year.
 */
function splitDateAndLocation(dateLocation: string): { dateStr: string; location?: string } {
  const match = dateLocation.match(MIDDLE_DOT_RE);
  if (!match || match.index === undefined) {
    return { dateStr: dateLocation.trim() };
  }
  const afterDot = dateLocation.slice(match.index + 1).trim();
  if (!/\d{4}/.test(afterDot)) {
    return { dateStr: dateLocation.slice(0, match.index).trim(), location: afterDot || undefined };
  }
  return { dateStr: dateLocation.trim() };
}

function parseDateRange(text?: string): DateRange {
  const fallback = new Date().toISOString().slice(0, 7);
  if (!text) return { start: fallback };

  const normalized = text
    .replace(/present|current|至今|现在/gi, "Present")
    .replace(/[–—]/g, "-")
    .trim();

  const matches = normalized.match(/\b\d{4}(?:[-/.]\d{2})?(?:[-/.]\d{2})?\b/g);
  if (!matches || matches.length === 0) return { start: fallback };

  const toClaimitDate = (v: string) => v.replace(/\//g, "-").replace(/\./g, "-");
  return {
    start: toClaimitDate(matches[0]!),
    ...(matches[1]
      ? { end: toClaimitDate(matches[1]) }
      : normalized.includes("Present")
      ? { ongoing: true }
      : {}),
  };
}

// ---------------------------------------------------------------------------
// Section parsers
// ---------------------------------------------------------------------------

function parseExperienceSection(lines: string[]): Experience[] {
  const entries: Experience[] = [];
  let current: Experience | null = null;

  const flush = () => {
    if (current) { entries.push(current); current = null; }
  };

  for (const line of lines) {
    if (isEntryHeader(line)) {
      flush();
      const { label, rest } = splitHeaderLine(line);
      const { dateStr, location } = splitDateAndLocation(rest);

      // Split label by middle dot: "Company·Title"
      const dotIdx = label.search(MIDDLE_DOT_RE);
      let company = label.trim();
      let title = "";
      if (dotIdx > 0) {
        company = label.slice(0, dotIdx).trim();
        title = label.slice(dotIdx + 1).trim();
      } else {
        // English fallback: "Title, Company" or "Title at Company"
        const segs = label.split(/,| at /i).map((s) => s.trim()).filter(Boolean);
        if (segs.length >= 2) { title = segs[0]!; company = segs[1]!; }
      }

      current = {
        id: uuid(),
        company: company || "Unknown Company",
        title: title || company,
        ...(location ? { location } : {}),
        date_range: parseDateRange(dateStr),
        highlights: [],
        achievement_ids: [],
      };
    } else if (current) {
      // Non-header line → highlight, strip leading bullet if present
      const text = line.replace(/^[-*•]\s*/, "").trim();
      if (text) current.highlights.push(text);
    }
  }

  flush();
  return entries;
}

function parseProjectSection(lines: string[]): Project[] {
  const entries: Project[] = [];
  let current: Project | null = null;

  const flush = () => {
    if (current) { entries.push(current); current = null; }
  };

  const makeProject = (label: string, dateStr: string): Project => {
    const dotIdx = label.search(MIDDLE_DOT_RE);
    let name = label.trim();
    let role: string | undefined;
    if (dotIdx > 0) {
      name = label.slice(0, dotIdx).trim();
      role = label.slice(dotIdx + 1).trim() || undefined;
    }
    return {
      id: uuid(),
      name,
      ...(role ? { role, description: role } : { description: name }),
      date_range: parseDateRange(dateStr),
      highlights: [],
      achievement_ids: [],
      tools: [],
    };
  };

  for (const line of lines) {
    if (isEntryHeader(line)) {
      flush();
      const { label, rest } = splitHeaderLine(line);
      const { dateStr } = splitDateAndLocation(rest);
      current = makeProject(label, dateStr);
    } else if (current) {
      const text = line.replace(/^[-*•]\s*/, "").trim();
      if (text) current.highlights.push(text);
    } else if (!isBullet(line) && !guessSection(line)) {
      // Line without a date that looks like a project name
      flush();
      current = makeProject(line, "");
    }
  }

  flush();
  return entries;
}

function parseEducationSection(lines: string[]): Education[] {
  const entries: Education[] = [];
  interface PartialEdu {
    id: string; institution: string; degree: string;
    field?: string; location?: string; date_range: DateRange;
    gpa?: string; highlights: string[];
  }
  let current: PartialEdu | null = null;

  const flush = () => {
    if (!current) return;
    entries.push({
      id: current.id,
      institution: current.institution,
      degree: current.degree,
      ...(current.field ? { field: current.field } : {}),
      ...(current.location ? { location: current.location } : {}),
      date_range: current.date_range,
      ...(current.gpa ? { gpa: current.gpa } : {}),
      highlights: current.highlights,
    });
    current = null;
  };

  for (const line of lines) {
    if (isEntryHeader(line)) {
      flush();
      const { label, rest } = splitHeaderLine(line);
      const { dateStr, location } = splitDateAndLocation(rest);

      const dotIdx = label.search(MIDDLE_DOT_RE);
      let institution = label.trim();
      let degree = "";
      let field: string | undefined;
      if (dotIdx >= 0) {
        institution = label.slice(0, dotIdx).trim();
        degree = label.slice(dotIdx + 1).trim();
      } else {
        const parts = label.split(/,| \| /).map((s) => s.trim()).filter(Boolean);
        institution = parts[0] ?? label;
        degree = parts[1] ?? "";
        field = parts[2];
      }

      current = {
        id: uuid(),
        institution: institution || "Unknown Institution",
        degree,
        field,
        location,
        date_range: parseDateRange(dateStr),
        highlights: [],
      };
    } else if (current) {
      const gpaMatch = line.match(/GPA[：:]\s*([\d.]+)/i);
      if (gpaMatch?.[1]) current.gpa = gpaMatch[1];
      const text = line.replace(/^[-*•]\s*/, "").trim();
      if (text) current.highlights.push(text);
    }
  }

  flush();
  return entries;
}

/**
 * Merge category continuation lines:
 * A non-category line immediately following a category line is treated as
 * a wrapped continuation of that category's value list.
 *
 * Category lines: start with "[CJK chars]：" e.g. "技能：海外运营..."
 * Non-category: everything else (free-form highlights and wrapped segments)
 */
function mergeSkillContinuations(lines: string[]): string[] {
  const result: string[] = [];
  for (const line of lines) {
    if (result.length === 0) { result.push(line); continue; }
    const isCategoryLine = /^[\u4e00-\u9fff]{1,8}[：:]/.test(line);
    if (!isCategoryLine) {
      const prev = result[result.length - 1]!;
      const prevIsCategoryLine = /^[\u4e00-\u9fff]{1,8}[：:]/.test(prev);
      if (prevIsCategoryLine) {
        // Wrapped continuation of a category value
        result[result.length - 1] = prev + line;
        continue;
      }
    }
    result.push(line);
  }
  return result;
}

function parseSkillsSection(lines: string[]): SkillCategory[] {
  const mergedLines = mergeSkillContinuations(lines);
  const highlights: string[] = [];
  const categories: SkillCategory[] = [];

  for (const line of mergedLines) {
    // "技能：item1、item2" or "Skills: item1, item2"
    const catMatch = line.match(/^([\u4e00-\u9fff]{1,8})[：:]\s*(.+)$/);
    if (catMatch) {
      const category = catMatch[1]!.trim();
      const itemsStr = catMatch[2]!.trim();
      const items = itemsStr.split(/[、,，；;]/).map((s) => s.trim()).filter(Boolean);
      if (items.length > 0) { categories.push({ category, items }); continue; }
    }
    const text = line.replace(/^[-*•]\s*/, "").trim();
    if (text) highlights.push(text);
  }

  const result: SkillCategory[] = [];
  if (highlights.length > 0) {
    const isChinese = highlights.some((h) => /[\u4e00-\u9fff]/.test(h));
    result.push({ category: isChinese ? "个人亮点" : "General", items: highlights });
  }
  result.push(...categories);
  return result;
}

function parseSummarySection(lines: string[]): string | undefined {
  const summary = lines.join(" ").trim();
  return summary || undefined;
}

// ---------------------------------------------------------------------------
// Section segmentation
// ---------------------------------------------------------------------------

interface SegmentResult {
  sections: Record<SectionName, string[]>;
  /** Chinese name line detected just before the 个人信息 keyword */
  nameLine: string | undefined;
}

function segmentSections(text: string): SegmentResult {
  const sections: Record<SectionName, string[]> = {
    basics: [], summary: [], experience: [], projects: [],
    education: [], skills: [], other: [],
  };
  let currentSection: SectionName = "other";
  let nameLine: string | undefined;

  for (const line of splitLines(text)) {
    const nextSection = guessSection(line);
    if (nextSection) {
      // When entering 个人信息, the last line of the previous section is often the person's name
      if (nextSection === "basics") {
        const prev = sections[currentSection];
        if (prev.length > 0) {
          const last = prev[prev.length - 1]!;
          // Chinese name: 2–5 CJK chars, optionally followed by English name in parentheses
          if (/^[\u4e00-\u9fff]{2,5}([（(][A-Za-z\s.]+[)）])?$/.test(last)) {
            nameLine = prev.pop()!;
          }
        }
      }
      currentSection = nextSection;
    } else {
      sections[currentSection].push(line);
    }
  }

  return { sections, nameLine };
}

// ---------------------------------------------------------------------------
// Basics extraction
// ---------------------------------------------------------------------------

function extractBasics(text: string, basicsLines: string[], nameLine?: string): Resume["basics"] {
  // Name: prefer the detected name line, then scan full text
  let name = "Your Name";
  if (nameLine) {
    name = nameLine.trim();
  } else {
    const namePattern = /^[\u4e00-\u9fff]{2,5}([（(][A-Za-z\s.]+[)）])?$/;
    const candidate = splitLines(text).find(
      (l) => namePattern.test(l.trim()) && !guessSection(l),
    );
    name = candidate?.trim() ?? splitLines(text)[0] ?? "Your Name";
  }

  // Contact info: search basics section first, fall back to full text
  const basicsText = basicsLines.join(" ");
  const fullText = basicsText + "\n" + text;

  const email = fullText.match(/\b[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}\b/)?.[0];

  // Phone: match from basics lines to avoid matching year-numbers in dates
  const phone = basicsText.match(/(\+?[\d][\d\s\-().]{7,}\d)/)?.[1];

  // LinkedIn: handle with or without https://
  const linkedinRaw = fullText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[\w/.-]+/)?.[0];
  const linkedin = linkedinRaw
    ? linkedinRaw.startsWith("http") ? linkedinRaw : `https://${linkedinRaw}`
    : undefined;

  // GitHub
  const githubRaw = fullText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w/.-]+/)?.[0];
  const github = githubRaw
    ? githubRaw.startsWith("http") ? githubRaw : `https://${githubRaw}`
    : undefined;

  // Website: any https URL that isn't LinkedIn or GitHub
  const websiteMatch = text.match(/https?:\/\/\S+/);
  const website =
    websiteMatch?.[0] &&
    !websiteMatch[0].includes("linkedin.com") &&
    !websiteMatch[0].includes("github.com")
      ? websiteMatch[0]
      : undefined;

  // Location: scan basics lines for a recognisable city name or short CJK place
  const KNOWN_CITIES = [
    "上海", "北京", "广州", "深圳", "杭州", "成都", "武汉", "西安", "南京",
    "苏州", "天津", "重庆", "香港", "澳门", "台湾",
    "Singapore", "Beijing", "Shanghai", "Hangzhou", "Shenzhen",
  ];
  let location: string | undefined;
  for (const line of basicsLines) {
    if (KNOWN_CITIES.some((city) => line.includes(city))) {
      location = line.trim();
      break;
    }
    // Short CJK line that looks like a place name (not education level / age / year markers)
    const EDUCATION_LEVELS = ["研究生", "本科", "大专", "博士", "硕士", "学士", "中学", "高中", "初中"];
    if (
      /^[\u4e00-\u9fff]{2,6}$/.test(line.trim()) &&
      !line.includes("岁") && !line.includes("年") && !line.includes("级") &&
      !EDUCATION_LEVELS.includes(line.trim())
    ) {
      location = line.trim();
      break;
    }
  }

  return {
    name,
    ...(email ? { email } : {}),
    ...(phone ? { phone: phone.trim() } : {}),
    ...(linkedin ? { linkedin } : {}),
    ...(github ? { github } : {}),
    ...(website ? { website } : {}),
    ...(location ? { location } : {}),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function parseResumeText(text: string, sourceFile = "inline"): ImportResumeResult {
  const normalized = normalizeWhitespace(text);
  const { sections, nameLine } = segmentSections(normalized);
  const now = new Date().toISOString();

  const resume = ResumeSchema.parse({
    $schema: "claimit/v0.2",
    basics: {
      ...extractBasics(normalized, sections.basics, nameLine),
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

  const detectedSections = (Object.entries(sections) as [string, string[]][])
    .filter(([, lines]) => lines.length > 0)
    .map(([name]) => name)
    .filter((name) => name !== "other" && name !== "basics");

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

  throw new Error(
    `Unsupported import file type "${extension}" for ${basename(filePath)}. Use PDF, DOCX, JSON, or TXT.`,
  );
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
