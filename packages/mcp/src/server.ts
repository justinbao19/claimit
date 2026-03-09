import { dirname } from "node:path";
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  applyAnswers,
  createAchievementRecord,
  createVariant,
  gapAnalysis,
  importResumeFile,
  initVault,
  listVariants,
  loadBaseResume,
  loadVariant,
  renderToHtml,
  renderToPdf,
  saveBaseResume,
  saveVariant,
} from "@claimit/core";

function getVaultRoot(): string | undefined {
  return process.env.RESUME_VAULT;
}

function textResult<T extends object>(structuredContent: T) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(structuredContent, null, 2),
      },
    ],
    structuredContent,
  };
}

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "claimit",
    version: "0.2.0",
  });

  server.registerTool(
    "resume_import",
    {
      description: "Import a PDF or DOCX resume file and parse it into structured JSON",
      inputSchema: {
        file_path: z.string().describe("Path to the resume file"),
      },
    },
    async ({ file_path }) => {
      await initVault(getVaultRoot());
      const result = await importResumeFile(file_path);
      await saveBaseResume(result.resume, getVaultRoot());
      return textResult({
        success: true,
        resume: result.resume,
        parse_report: result.parse_report,
      });
    },
  );

  server.registerTool(
    "resume_gap_analysis",
    {
      description: "Analyze the current resume for missing information and generate improvement questions",
      inputSchema: {
        max_questions: z.number().int().positive().max(20).default(7),
      },
    },
    async ({ max_questions }) => {
      const resume = await loadBaseResume(getVaultRoot());
      const result = await gapAnalysis(resume, {
        maxQuestions: max_questions,
      });
      return textResult(result);
    },
  );

  server.registerTool(
    "resume_apply_answers",
    {
      description: "Apply user answers to improve the current resume",
      inputSchema: {
        answers: z.record(z.string(), z.string()),
      },
    },
    async ({ answers }) => {
      const resume = await loadBaseResume(getVaultRoot());
      const result = await applyAnswers(resume, answers);
      await saveBaseResume(result.resume, getVaultRoot());
      return textResult({
        patches: result.patches,
        change_log: result.change_log,
        warnings: result.warnings,
      });
    },
  );

  server.registerTool(
    "resume_create_variant",
    {
      description: "Create a resume variant tailored to a specific role or job description",
      inputSchema: {
        role: z.string().optional(),
        jd: z.string().optional(),
        name: z.string().optional(),
      },
    },
    async ({ role, jd, name }) => {
      const resume = await loadBaseResume(getVaultRoot());
      const result = await createVariant(resume, {
        role,
        jd,
        name: name ?? `variant-${Date.now()}`,
      });
      await saveVariant(result.variant, getVaultRoot());
      return textResult({ ...result });
    },
  );

  server.registerTool(
    "resume_render",
    {
      description: "Render a resume variant to HTML using a template",
      inputSchema: {
        template: z.enum(["ats_minimal", "modern_clean"]),
        variant: z.string().optional(),
      },
    },
    async ({ template, variant }) => {
      const resume = variant
        ? await loadVariant(variant, getVaultRoot())
        : await loadBaseResume(getVaultRoot());
      const html = await renderToHtml(resume, template);
      return textResult({ html, template, variant: variant ?? "base" });
    },
  );

  server.registerTool(
    "resume_export_pdf",
    {
      description: "Export a resume to PDF",
      inputSchema: {
        template: z.string().default("ats_minimal"),
        variant: z.string().optional(),
        output_path: z.string(),
      },
    },
    async ({ template, variant, output_path }) => {
      const resume = variant
        ? await loadVariant(variant, getVaultRoot())
        : await loadBaseResume(getVaultRoot());
      const html = await renderToHtml(resume, template);
      await mkdir(dirname(output_path), { recursive: true });
      await renderToPdf(html, output_path);
      return textResult({ path: output_path });
    },
  );

  server.registerTool(
    "achievement_add",
    {
      description: "Add a new achievement to the resume memory",
      inputSchema: {
        title: z.string(),
        summary: z.string(),
        date_start: z.string().optional(),
        date_end: z.string().optional(),
        actions: z.array(z.string()).default([]),
        tools: z.array(z.string()).default([]),
        tags: z.array(z.string()).default([]),
      },
    },
    async ({ title, summary, date_start, date_end, actions, tools, tags }) => {
      const resume = await loadBaseResume(getVaultRoot());
      const achievement = createAchievementRecord({
        title,
        summary,
        dateStart: date_start,
        dateEnd: date_end,
        actions,
        tools,
        tags,
      });
      resume.achievements.push(achievement);
      await saveBaseResume(resume, getVaultRoot());
      return textResult({ achievement });
    },
  );

  server.registerTool(
    "achievement_list",
    {
      description: "List all achievements with optional filters",
      inputSchema: {
        tags: z.array(z.string()).optional(),
        role_context: z.string().optional(),
      },
    },
    async ({ tags, role_context }) => {
      const resume = await loadBaseResume(getVaultRoot());
      const achievements = resume.achievements.filter((achievement) => {
        const matchesTags = !tags?.length || tags.every((tag: string) => achievement.tags.includes(tag));
        const matchesRole = !role_context || achievement.role_context === role_context;
        return matchesTags && matchesRole;
      });
      return textResult({ achievements, variants: await listVariants(getVaultRoot()) });
    },
  );

  return server;
}

export async function startMcpServer(): Promise<void> {
  await initVault(getVaultRoot());
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

const directExecutionUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";

if (import.meta.url === directExecutionUrl) {
  startMcpServer().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
