import { v4 as uuid } from "uuid";

import { collectResumeKeywordMatches, generateClaimsForAchievement, suggestVariantWithLlm } from "../assistant";
import type { LLMConfig } from "../llm/client";
import { type Variant, type VariantCustomization, type Resume } from "../schema/resume";

export interface CreateVariantInput {
  name: string;
  role?: string;
  jd?: string;
  llm?: LLMConfig | null;
}

export interface CreateVariantResult {
  variant: Variant;
  keyword_matches: string[];
  keyword_gaps: string[];
  rationale: string;
}

function cloneResumeAsVariant(resume: Resume, input: CreateVariantInput): Variant {
  return {
    ...structuredClone(resume),
    variant_meta: {
      name: input.name,
      target_role: input.role,
      target_jd: input.jd,
      created_from: "base",
      customizations: [],
    },
  };
}

function addGeneratedClaims(variant: Variant, role?: string): void {
  if (variant.achievements.length === 0) {
    return;
  }

  const generatedClaims = variant.achievements.flatMap((achievement) =>
    generateClaimsForAchievement(achievement, { style: "ats", targetRole: role }),
  );

  variant.claims = Array.from(
    new Map(generatedClaims.map((claim) => [`${claim.achievement_id}:${claim.text}`, claim])).values(),
  );
}

export async function createVariant(baseResume: Resume, input: CreateVariantInput): Promise<CreateVariantResult> {
  const variant = cloneResumeAsVariant(baseResume, input);
  addGeneratedClaims(variant, input.role);

  const role = input.role ?? "";
  const jd = input.jd ?? "";
  const llmSuggestion = role || jd ? await suggestVariantWithLlm(baseResume, role, jd, input.llm) : null;

  if (llmSuggestion) {
    variant.variant_meta.customizations = llmSuggestion.customizations.map((item) => ({
      type: item.type,
      path: item.path,
      reason: item.reason,
    }));
    return {
      variant,
      keyword_matches: llmSuggestion.keyword_matches,
      keyword_gaps: llmSuggestion.keyword_gaps,
      rationale: llmSuggestion.rationale,
    };
  }

  const { keywordMatches, keywordGaps, scoredExperience } = collectResumeKeywordMatches(baseResume, role, jd);
  const orderedExperience = scoredExperience.map(({ entry }) => entry);
  const customizations: VariantCustomization[] = [];

  if (orderedExperience.length > 0) {
    variant.experience = orderedExperience;
    customizations.push({
      type: "reorder",
      path: "/experience",
      reason: "Reordered experience entries by relevance to the target role and job description.",
    });
  }

  if (variant.claims.length > 0 && keywordMatches.length > 0) {
    variant.claims = variant.claims
      .map((claim) => ({
        ...claim,
        priority: Math.min(100, claim.priority + keywordMatches.filter((keyword) => claim.text.toLowerCase().includes(keyword)).length * 10),
      }))
      .sort((left, right) => right.priority - left.priority);

    customizations.push({
      type: "include",
      path: "/claims",
      reason: "Boosted claims that better align with the target role keywords.",
    });
  }

  if (keywordGaps.length > 0) {
    customizations.push({
      type: "exclude",
      path: "/variant_meta/customizations",
      reason: `Still missing evidence for keywords: ${keywordGaps.slice(0, 5).join(", ")}`,
    });
  }

  variant.variant_meta.customizations = customizations;
  variant.meta.updated_at = new Date().toISOString();

  return {
    variant,
    keyword_matches: keywordMatches,
    keyword_gaps: keywordGaps,
    rationale:
      keywordMatches.length > 0
        ? `Tailored the resume toward ${input.role ?? "the target role"} by surfacing experience and claims that match ${keywordMatches.length} relevant keywords.`
        : `Created a baseline variant for ${input.role ?? input.name} without strong keyword matches. Add more quantified claims to improve relevance.`,
  };
}

export function createVariantName(role?: string): string {
  const slug = (role ?? "variant")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || `variant-${uuid().slice(0, 8)}`;
}
