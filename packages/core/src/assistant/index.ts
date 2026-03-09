import * as jsonPatch from "fast-json-patch";
import { v4 as uuid } from "uuid";

import {
  ApplyResultSchema,
  GapAnalysisSchema,
  QuestionSchema,
  VariantSuggestionSchema,
  type ApplyResult,
  type GapAnalysis,
  type PatchOperation,
  type Question,
} from "../schema/assistant";
import { ClaimSchema, type Achievement, type Claim, type Resume } from "../schema/resume";
import { llmCall, resolveDefaultLLMConfig, type LLMConfig } from "../llm/client";
import { PROMPTS } from "../llm/prompts";

export interface GapAnalysisOptions {
  maxQuestions?: number;
  llm?: LLMConfig | null;
}

export interface ApplyAnswersOptions {
  questions?: Question[];
  llm?: LLMConfig | null;
}

export interface ClaimGenerationOptions {
  style?: Claim["style"];
  targetRole?: string;
}

const WEAK_VERBS = new Set([
  "helped",
  "worked",
  "responsible",
  "assisted",
  "supported",
  "handled",
  "did",
]);

const STRONG_VERBS = [
  "Built",
  "Launched",
  "Led",
  "Designed",
  "Improved",
  "Reduced",
  "Increased",
  "Implemented",
];

function hasMetric(text: string): boolean {
  return /(\d+%|\$\d+|\d+\s*(users|hours|days|weeks|months|people|customers|clients)|\d+x)/i.test(text);
}

function hasScope(text: string): boolean {
  return /(team|budget|users|customers|global|apac|months|weeks|stakeholders)/i.test(text);
}

function getLeadingVerb(text: string): string {
  const firstWord = text.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  return firstWord.replace(/[^a-z]/g, "");
}

function needsStrongerVerb(text: string): boolean {
  const verb = getLeadingVerb(text);
  return !verb || WEAK_VERBS.has(verb);
}

function makeQuestion(id: string, targetPath: string, goal: string, question: string, examples?: string[]): Question {
  return QuestionSchema.parse({
    id,
    target_path: targetPath,
    goal,
    question,
    examples,
    allow_skip: true,
  });
}

function hasSubstantiveResumeContent(resume: Resume): boolean {
  return Boolean(
    resume.basics.summary?.trim() ||
      resume.experience.length > 0 ||
      resume.projects.length > 0 ||
      resume.education.length > 0 ||
      resume.skills.some((category) => category.items.length > 0) ||
      resume.achievements.length > 0 ||
      resume.claims.length > 0,
  );
}

function heuristicGapAnalysis(resume: Resume, maxQuestions = 7): GapAnalysis {
  if (!hasSubstantiveResumeContent(resume)) {
    return GapAnalysisSchema.parse({
      gaps: [
        {
          path: "/",
          field: "resume",
          severity: "missing",
          reason: "No resume content was found to analyze yet.",
          suggestion: "Import a resume or add experience and summary details first.",
        },
      ],
      questions: [],
      summary: "No resume content found yet. Import a resume or add experience before running gap analysis.",
      completeness_score: 0,
    });
  }

  const gaps: GapAnalysis["gaps"] = [];
  const questions: Question[] = [];

  resume.experience.forEach((experience, experienceIndex) => {
    experience.highlights.forEach((highlight, highlightIndex) => {
      const path = `/experience/${experienceIndex}/highlights/${highlightIndex}`;
      if (!hasMetric(highlight)) {
        gaps.push({
          path,
          field: "impact",
          severity: "missing",
          reason: "This bullet does not include a measurable outcome.",
          suggestion: "Add a percentage, count, revenue figure, or time saved.",
        });
        if (questions.length < maxQuestions) {
          questions.push(
            makeQuestion(
              `q${questions.length + 1}`,
              path,
              "quantify_impact",
              `For "${highlight}", what measurable result did you achieve at ${experience.company}?`,
              ["Increased conversion by 12%", "Reduced manual work by 8 hours per week"],
            ),
          );
        }
      }

      if (questions.length >= maxQuestions) {
        return;
      }

      if (needsStrongerVerb(highlight)) {
        gaps.push({
          path,
          field: "action",
          severity: "weak",
          reason: "This bullet starts with a weak or unclear action verb.",
          suggestion: "Clarify what you personally drove or delivered.",
        });
        questions.push(
          makeQuestion(
            `q${questions.length + 1}`,
            path,
            "clarify_action",
            `What action did you personally lead in "${highlight}"?`,
            ["Launched a new onboarding flow", "Built internal analytics dashboards"],
          ),
        );
      }

      if (questions.length >= maxQuestions) {
        return;
      }

      if (!hasScope(highlight)) {
        gaps.push({
          path,
          field: "scope",
          severity: "vague",
          reason: "This bullet lacks scope such as team size, users, or timeline.",
          suggestion: "Add the scale or audience affected by the work.",
        });
        questions.push(
          makeQuestion(
            `q${questions.length + 1}`,
            path,
            "add_scope",
            `What scope can you add to "${highlight}" (team size, users, budget, or timeline)?`,
            ["Used by 20K users", "Coordinated across a 6-person team"],
          ),
        );
      }
    });
  });

  if (!resume.basics.summary && questions.length < maxQuestions) {
    gaps.push({
      path: "/basics/summary",
      field: "summary",
      severity: "missing",
      reason: "The resume is missing a professional summary.",
      suggestion: "Add a concise summary describing your background and strengths.",
    });
    questions.push(
      makeQuestion(
        `q${questions.length + 1}`,
        "/basics/summary",
        "add_summary",
        "What 2-3 sentence professional summary best describes your strengths and target work?",
      ),
    );
  }

  const penalty = Math.min(60, gaps.length * 7);
  return GapAnalysisSchema.parse({
    gaps: gaps.slice(0, maxQuestions * 2),
    questions: questions.slice(0, maxQuestions),
    summary:
      gaps.length === 0
        ? "The resume is already well-quantified and specific."
        : "The resume would benefit from stronger metrics, action clarity, and scope details.",
    completeness_score: Math.max(35, 100 - penalty),
  });
}

function shouldSkipAnswer(answer: string | undefined): boolean {
  if (!answer) {
    return true;
  }

  return /^(skip|unknown|n\/a|na)$/i.test(answer.trim());
}

function appendAnswerToText(original: string, goal: string, answer: string): string {
  const trimmed = answer.trim();
  if (!trimmed) {
    return original;
  }
  if (original.includes(trimmed)) {
    return original;
  }
  if (goal === "clarify_action") {
    return `${trimmed}; ${original.charAt(0).toLowerCase()}${original.slice(1)}`;
  }
  if (goal === "add_summary") {
    return trimmed;
  }
  return `${original} (${trimmed})`;
}

function applyPatchToDocument(document: unknown, patch: PatchOperation): void {
  const segments = patch.path.split("/").slice(1);
  if (segments.length === 0) {
    throw new Error(`Invalid patch path "${patch.path}".`);
  }

  let current = document as Record<string, unknown> | unknown[];
  for (let index = 0; index < segments.length - 1; index += 1) {
    const key = Array.isArray(current) ? Number(segments[index]) : segments[index];
    const next = current[key as keyof typeof current];
    if (next === undefined || next === null) {
      throw new Error(`Patch path "${patch.path}" does not exist.`);
    }
    current = next as Record<string, unknown> | unknown[];
  }

  const lastSegment = segments.at(-1) as string;
  if (Array.isArray(current)) {
    const itemIndex = Number(lastSegment);
    if (patch.op === "remove") {
      current.splice(itemIndex, 1);
      return;
    }
    current[itemIndex] = patch.value;
    return;
  }

  if (patch.op === "remove") {
    delete current[lastSegment];
    return;
  }
  current[lastSegment] = patch.value;
}

function heuristicApplyAnswers(resume: Resume, answers: Record<string, string>, questions: Question[]): ApplyResult & { resume: Resume } {
  const updatedResume = structuredClone(resume);
  const patches: PatchOperation[] = [];
  const changeLog: ApplyResult["change_log"] = [];
  const warnings: string[] = [];

  for (const question of questions) {
    const answer = answers[question.id];
    if (shouldSkipAnswer(answer)) {
      continue;
    }
    if (!answer) {
      continue;
    }

    try {
      const currentValue = question.target_path
        .split("/")
        .slice(1)
        .reduce<unknown>((accumulator, segment) => {
          if (Array.isArray(accumulator)) {
            return accumulator[Number(segment)];
          }
          return (accumulator as Record<string, unknown>)[segment];
        }, updatedResume);

      const safeAnswer = answer.trim();
      const nextValue =
        typeof currentValue === "string"
          ? appendAnswerToText(currentValue, question.goal, safeAnswer)
          : safeAnswer;

      const patch: PatchOperation = {
        op: currentValue === undefined ? "add" : "replace",
        path: question.target_path,
        value: nextValue,
      };
      applyPatchToDocument(updatedResume, patch);
      patches.push(patch);
      changeLog.push({
        description: `Updated ${question.target_path} from answer to ${question.id}`,
        confidence: 0.85,
        source_question: question.id,
      });
    } catch (error) {
      warnings.push(`Could not apply answer for ${question.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  updatedResume.meta.updated_at = new Date().toISOString();
  return {
    resume: updatedResume,
    patches: ApplyResultSchema.shape.patches.parse(patches),
    change_log: ApplyResultSchema.shape.change_log.parse(changeLog),
    warnings,
  };
}

export async function gapAnalysis(resume: Resume, options: GapAnalysisOptions = {}): Promise<GapAnalysis> {
  const maxQuestions = options.maxQuestions ?? 7;
  const llmConfig = options.llm ?? resolveDefaultLLMConfig();
  if (!llmConfig) {
    return heuristicGapAnalysis(resume, maxQuestions);
  }

  try {
    return await llmCall(
      llmConfig,
      PROMPTS.GAP_ANALYSIS_SYSTEM.replace("{max_questions}", String(maxQuestions)),
      PROMPTS.GAP_ANALYSIS_USER.replace("{resume_json}", JSON.stringify(resume, null, 2)),
      GapAnalysisSchema,
    );
  } catch {
    return heuristicGapAnalysis(resume, maxQuestions);
  }
}

export async function applyAnswers(
  resume: Resume,
  answers: Record<string, string>,
  options: ApplyAnswersOptions = {},
): Promise<ApplyResult & { resume: Resume; questions: Question[] }> {
  const questions =
    options.questions && options.questions.length > 0
      ? options.questions
      : (await gapAnalysis(resume, { maxQuestions: Object.keys(answers).length || 7, llm: options.llm })).questions;

  const llmConfig = options.llm ?? resolveDefaultLLMConfig();
  if (llmConfig) {
    try {
      const llmResult = await llmCall(
        llmConfig,
        PROMPTS.APPLY_ANSWERS_SYSTEM,
        PROMPTS.APPLY_ANSWERS_USER
          .replace("{resume_json}", JSON.stringify(resume, null, 2))
          .replace("{questions_json}", JSON.stringify(questions, null, 2))
          .replace("{answers_json}", JSON.stringify(answers, null, 2)),
        ApplyResultSchema,
      );

      const updatedResume = structuredClone(resume);
      for (const patch of llmResult.patches) {
        applyPatchToDocument(updatedResume, patch);
      }
      updatedResume.meta.updated_at = new Date().toISOString();
      return {
        ...llmResult,
        resume: updatedResume,
        questions,
      };
    } catch {
      // Fall back to deterministic local behavior.
    }
  }

  return {
    ...heuristicApplyAnswers(resume, answers, questions),
    questions,
  };
}

function collectKeywords(text: string): string[] {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .split(/[^a-z0-9+#.]+/i)
        .map((token) => token.trim())
        .filter((token) => token.length >= 3),
    ),
  );
}

function scoreKeywords(text: string, keywords: string[]): number {
  const lowered = text.toLowerCase();
  return keywords.reduce((score, keyword) => score + (lowered.includes(keyword) ? 1 : 0), 0);
}

export function generateClaimsForAchievement(
  achievement: Achievement,
  options: ClaimGenerationOptions = {},
): Claim[] {
  const style = options.style ?? "ats";
  const action = achievement.actions[0]?.text ?? achievement.summary;
  const impactText = achievement.impact[0]
    ? [
        achievement.impact[0].value,
        achievement.impact[0].unit,
        achievement.impact[0].metric,
      ]
        .filter(Boolean)
        .join(" ")
    : "";
  const scopeText = achievement.scope?.users
    ? `for ${achievement.scope.users} users`
    : achievement.scope?.team_size
      ? `across a ${achievement.scope.team_size}-person team`
      : "";
  const verb = achievement.actions[0]?.verb ?? STRONG_VERBS[0];
  const parts = [verb, action, impactText && `delivering ${impactText}`, scopeText].filter(Boolean);
  const text = parts.join(" ");

  return [
    ClaimSchema.parse({
      id: uuid(),
      achievement_id: achievement.id,
      text,
      style,
      target_role: options.targetRole,
      keywords: collectKeywords([achievement.title, achievement.summary, ...achievement.tools, ...achievement.tags].join(" ")),
      priority: Math.min(100, 50 + achievement.impact.length * 10 + achievement.tools.length * 5),
    }),
  ];
}

export function syncClaimsFromAchievements(resume: Resume, style: Claim["style"] = "ats"): Resume {
  const nextResume = structuredClone(resume);
  const generated = nextResume.achievements.flatMap((achievement) =>
    generateClaimsForAchievement(achievement, { style }),
  );
  nextResume.claims = generated;
  nextResume.meta.updated_at = new Date().toISOString();
  return nextResume;
}

export function diffResume(before: Resume, after: Resume): PatchOperation[] {
  return jsonPatch.compare(before, after).map((patch) => ({
    op: patch.op as PatchOperation["op"],
    path: patch.path,
    ...("value" in patch ? { value: patch.value } : {}),
  }));
}

export async function suggestVariantWithLlm(
  resume: Resume,
  role: string,
  jd: string,
  llm?: LLMConfig | null,
) {
  const llmConfig = llm ?? resolveDefaultLLMConfig();
  if (!llmConfig) {
    return null;
  }

  try {
    return await llmCall(
      llmConfig,
      PROMPTS.VARIANT_SYSTEM,
      PROMPTS.VARIANT_USER
        .replace("{resume_json}", JSON.stringify(resume, null, 2))
        .replace("{role}", role)
        .replace("{jd}", jd),
      VariantSuggestionSchema,
    );
  } catch {
    return null;
  }
}

export function collectResumeKeywordMatches(resume: Resume, role: string, jd: string) {
  const keywords = collectKeywords(`${role} ${jd}`).slice(0, 20);
  const resumeText = JSON.stringify(resume).toLowerCase();
  const keywordMatches = keywords.filter((keyword) => resumeText.includes(keyword));
  const keywordGaps = keywords.filter((keyword) => !resumeText.includes(keyword));

  const scoredExperience = resume.experience
    .map((entry) => ({
      entry,
      score: scoreKeywords(`${entry.title} ${entry.company} ${entry.highlights.join(" ")}`, keywords),
    }))
    .sort((left, right) => right.score - left.score);

  return {
    keywords,
    keywordMatches,
    keywordGaps,
    scoredExperience,
  };
}
