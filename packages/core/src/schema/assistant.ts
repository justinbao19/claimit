import { z } from "zod";

export const GapItemSchema = z.object({
  path: z.string(),
  field: z.string(),
  severity: z.enum(["missing", "weak", "vague"]),
  reason: z.string(),
  suggestion: z.string().optional(),
});

export const QuestionSchema = z.object({
  id: z.string(),
  target_path: z.string(),
  goal: z.string(),
  question: z.string(),
  examples: z.array(z.string()).optional(),
  allow_skip: z.boolean().default(true),
});

export const GapAnalysisSchema = z.object({
  gaps: z.array(GapItemSchema),
  questions: z.array(QuestionSchema).max(7),
  summary: z.string(),
  completeness_score: z.number().min(0).max(100),
});

export const PatchOperationSchema = z.object({
  op: z.enum(["add", "replace", "remove"]),
  path: z.string(),
  value: z.unknown().optional(),
});

export const ApplyChangeLogSchema = z.object({
  description: z.string(),
  confidence: z.number().min(0).max(1),
  source_question: z.string().optional(),
});

export const ApplyResultSchema = z.object({
  patches: z.array(PatchOperationSchema),
  change_log: z.array(ApplyChangeLogSchema),
  warnings: z.array(z.string()),
});

export const VariantSuggestionSchema = z.object({
  customizations: z.array(
    z.object({
      type: z.enum(["reorder", "rewrite", "include", "exclude"]),
      path: z.string(),
      reason: z.string(),
      new_value: z.string().optional(),
    }),
  ),
  keyword_matches: z.array(z.string()),
  keyword_gaps: z.array(z.string()),
  rationale: z.string(),
});

export type GapItem = z.infer<typeof GapItemSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type GapAnalysis = z.infer<typeof GapAnalysisSchema>;
export type PatchOperation = z.infer<typeof PatchOperationSchema>;
export type ApplyChangeLog = z.infer<typeof ApplyChangeLogSchema>;
export type ApplyResult = z.infer<typeof ApplyResultSchema>;
export type VariantSuggestion = z.infer<typeof VariantSuggestionSchema>;
