import { basename, extname, join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import {
  applyAnswers,
  createAchievementRecord,
  createVariant,
  createVariantName,
  deleteVariant,
  gapAnalysis,
  getVaultPaths,
  importResumeFile,
  initVault,
  listVariants,
  loadBaseResume,
  loadVariant,
  renderToHtml,
  renderToPdf,
  saveBaseResume,
  saveVariant,
  type Achievement,
  type Resume,
} from "@claimit/core";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ route?: string[] }>;
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function jsonError(error: unknown, status = 400) {
  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : String(error),
      code: "request_failed",
    },
    { status },
  );
}

async function ensureVault() {
  await initVault();
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function handleImport(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("Missing uploaded file.");
  }

  const vaultPaths = getVaultPaths();
  await mkdir(vaultPaths.uploadsDir, { recursive: true });
  const fileName = `${Date.now()}-${sanitizeFileName(file.name || "resume")}`;
  const uploadPath = join(vaultPaths.uploadsDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(uploadPath, buffer);

  const result = await importResumeFile(uploadPath);
  await saveBaseResume(result.resume);
  return json({ resume: result.resume, parse_report: result.parse_report });
}

async function handleResumeGet() {
  const resume = await loadBaseResume();
  return json({ resume });
}

async function handleResumePut(request: NextRequest) {
  const payload = (await request.json()) as { resume: Resume };
  await saveBaseResume(payload.resume);
  return json({ success: true });
}

async function handleAchievementsGet(request: NextRequest) {
  const resume = await loadBaseResume();
  const tagsQuery = request.nextUrl.searchParams.get("tags");
  const after = request.nextUrl.searchParams.get("after");
  const tags = tagsQuery?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];

  const achievements = resume.achievements.filter((achievement) => {
    const matchesTags = tags.length === 0 || tags.every((tag) => achievement.tags.includes(tag));
    const matchesAfter = !after || achievement.date_range.start >= after;
    return matchesTags && matchesAfter;
  });

  return json({ achievements });
}

async function handleAchievementsPost(request: NextRequest) {
  const payload = (await request.json()) as {
    achievement: Partial<Achievement> & { title?: string; summary?: string; tags?: string[]; tools?: string[] };
  };
  if (!payload.achievement.title || !payload.achievement.summary) {
    throw new Error("Achievement title and summary are required.");
  }

  const resume = await loadBaseResume();
  const achievement = createAchievementRecord({
    title: payload.achievement.title,
    summary: payload.achievement.summary,
    actions: payload.achievement.actions?.map((item) => item.text) ?? [],
    tags: payload.achievement.tags ?? [],
    tools: payload.achievement.tools ?? [],
  });
  resume.achievements.push(achievement);
  await saveBaseResume(resume);
  return json({ achievement }, 201);
}

async function handleAchievementsPut(id: string, request: NextRequest) {
  const payload = (await request.json()) as { achievement: Partial<Achievement> };
  const resume = await loadBaseResume();
  const achievement = resume.achievements.find((item) => item.id === id);
  if (!achievement) {
    return jsonError(new Error(`Achievement "${id}" not found.`), 404);
  }

  if (payload.achievement.title !== undefined) {
    achievement.title = payload.achievement.title;
  }
  if (payload.achievement.summary !== undefined) {
    achievement.summary = payload.achievement.summary;
  }
  if (payload.achievement.tags !== undefined) {
    achievement.tags = payload.achievement.tags;
  }
  if (payload.achievement.tools !== undefined) {
    achievement.tools = payload.achievement.tools;
  }
  achievement.updated_at = new Date().toISOString();

  await saveBaseResume(resume);
  return json({ achievement });
}

async function handleAchievementsDelete(id: string) {
  const resume = await loadBaseResume();
  resume.achievements = resume.achievements.filter((item) => item.id !== id);
  await saveBaseResume(resume);
  return json({ success: true });
}

async function handleGapAnalysis(request: NextRequest) {
  const payload = (await request.json().catch(() => ({}))) as { max_questions?: number };
  const resume = await loadBaseResume();
  const result = await gapAnalysis(resume, { maxQuestions: payload.max_questions ?? 7 });
  return json(result);
}

async function handleAssistantApply(request: NextRequest) {
  const payload = (await request.json()) as { answers: Record<string, string> };
  const resume = await loadBaseResume();
  const result = await applyAnswers(resume, payload.answers);
  await saveBaseResume(result.resume);
  return json({
    patches: result.patches,
    change_log: result.change_log,
    warnings: result.warnings,
  });
}

async function handleVariantsGet(name?: string) {
  if (name) {
    const variant = await loadVariant(name);
    return json({ variant });
  }
  const variants = await listVariants();
  return json({ variants });
}

async function handleVariantsPost(request: NextRequest) {
  const payload = (await request.json()) as { name?: string; role?: string; jd?: string };
  const resume = await loadBaseResume();
  const result = await createVariant(resume, {
    name: payload.name ?? createVariantName(payload.role),
    role: payload.role,
    jd: payload.jd,
  });
  await saveVariant(result.variant);
  return json({ variant: result.variant, rationale: result.rationale });
}

async function handleVariantsDelete(name: string) {
  await deleteVariant(name);
  return json({ success: true });
}

async function handleRender(request: NextRequest) {
  const payload = (await request.json()) as { template: string; variant?: string };
  const resume = payload.variant ? await loadVariant(payload.variant) : await loadBaseResume();
  const html = await renderToHtml(resume, payload.template);
  return json({ html });
}

async function handleExportPdf(request: NextRequest) {
  const payload = (await request.json()) as { template: string; variant?: string; filename?: string };
  const resume = payload.variant ? await loadVariant(payload.variant) : await loadBaseResume();
  const html = await renderToHtml(resume, payload.template);
  const vaultPaths = getVaultPaths();
  await mkdir(vaultPaths.exportsDir, { recursive: true });
  const fileName = sanitizeFileName(payload.filename ?? `resume-${Date.now()}.pdf`);
  const outputPath = join(vaultPaths.exportsDir, extname(fileName) === ".pdf" ? fileName : `${basename(fileName)}.pdf`);
  await renderToPdf(html, outputPath);
  return json({ path: outputPath, url: outputPath });
}

export async function GET(request: NextRequest, context: RouteContext) {
  await ensureVault();
  const { route = [] } = await context.params;

  try {
    if (route[0] === "resume") {
      return await handleResumeGet();
    }
    if (route[0] === "achievements") {
      return await handleAchievementsGet(request);
    }
    if (route[0] === "variants") {
      return await handleVariantsGet(route[1]);
    }
    return jsonError(new Error("Unknown GET route."), 404);
  } catch (error) {
    return jsonError(error, 500);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  await ensureVault();
  const { route = [] } = await context.params;

  try {
    if (route[0] === "import") {
      return await handleImport(request);
    }
    if (route[0] === "achievements") {
      return await handleAchievementsPost(request);
    }
    if (route[0] === "assistant" && route[1] === "gap-analysis") {
      return await handleGapAnalysis(request);
    }
    if (route[0] === "assistant" && route[1] === "apply") {
      return await handleAssistantApply(request);
    }
    if (route[0] === "variants") {
      return await handleVariantsPost(request);
    }
    if (route[0] === "render") {
      return await handleRender(request);
    }
    if (route[0] === "export" && route[1] === "pdf") {
      return await handleExportPdf(request);
    }
    return jsonError(new Error("Unknown POST route."), 404);
  } catch (error) {
    return jsonError(error, 500);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  await ensureVault();
  const { route = [] } = await context.params;

  try {
    if (route[0] === "resume") {
      return await handleResumePut(request);
    }
    if (route[0] === "achievements" && route[1]) {
      return await handleAchievementsPut(route[1], request);
    }
    return jsonError(new Error("Unknown PUT route."), 404);
  } catch (error) {
    return jsonError(error, 500);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  await ensureVault();
  const { route = [] } = await context.params;

  try {
    if (route[0] === "achievements" && route[1]) {
      return await handleAchievementsDelete(route[1]);
    }
    if (route[0] === "variants" && route[1]) {
      return await handleVariantsDelete(route[1]);
    }
    return jsonError(new Error("Unknown DELETE route."), 404);
  } catch (error) {
    return jsonError(error, 500);
  }
}
