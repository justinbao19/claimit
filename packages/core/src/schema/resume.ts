import { z } from "zod";

export const DateRangeSchema = z
  .object({
    start: z.string().regex(/^\d{4}(-\d{2})?(-\d{2})?$/),
    end: z.string().regex(/^\d{4}(-\d{2})?(-\d{2})?$/).optional(),
    ongoing: z.boolean().optional(),
  })
  .refine((value) => !(value.end && value.ongoing), {
    message: "date_range cannot include both end and ongoing",
    path: ["end"],
  });

export const EvidenceSchema = z.object({
  type: z.enum(["link", "file", "screenshot", "quote"]),
  value: z.string(),
  label: z.string().optional(),
});

export const ImpactSchema = z.object({
  metric: z.string(),
  value: z.number().optional(),
  unit: z.string().optional(),
  note: z.string().optional(),
  quantified: z.boolean().default(false),
});

export const ScopeSchema = z.object({
  team_size: z.number().optional(),
  budget: z.string().optional(),
  users: z.number().optional(),
  region: z.string().optional(),
  duration_months: z.number().optional(),
});

export const AchievementActionSchema = z.object({
  text: z.string(),
  verb: z.string().optional(),
});

export const AchievementSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  date_range: DateRangeSchema,
  role_context: z.string().optional(),
  summary: z.string().min(1).max(500),
  actions: z.array(AchievementActionSchema).default([]),
  impact: z.array(ImpactSchema).default([]),
  scope: ScopeSchema.optional(),
  tools: z.array(z.string()).default([]),
  evidence: z.array(EvidenceSchema).default([]),
  tags: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1).default(0.5),
  source: z.enum(["imported", "user", "ai_suggested"]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const ClaimSchema = z.object({
  id: z.string().uuid(),
  achievement_id: z.string().uuid(),
  text: z.string(),
  style: z.enum(["ats", "modern", "technical"]),
  target_role: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  priority: z.number().min(0).max(100).default(50),
});

export const ExperienceSchema = z.object({
  id: z.string().uuid(),
  company: z.string(),
  title: z.string(),
  location: z.string().optional(),
  date_range: DateRangeSchema,
  description: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  achievement_ids: z.array(z.string().uuid()).default([]),
});

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  role: z.string().optional(),
  date_range: DateRangeSchema.optional(),
  description: z.string(),
  url: z.string().url().optional(),
  highlights: z.array(z.string()).default([]),
  achievement_ids: z.array(z.string().uuid()).default([]),
  tools: z.array(z.string()).default([]),
});

export const EducationSchema = z.object({
  id: z.string().uuid(),
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  date_range: DateRangeSchema,
  gpa: z.string().optional(),
  highlights: z.array(z.string()).default([]),
});

export const SkillCategorySchema = z.object({
  category: z.string(),
  items: z.array(z.string()).default([]),
});

export const BasicsSchema = z.object({
  name: z.string().default("Your Name"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
  summary: z.string().optional(),
});

export const ResumeMetaSchema = z.object({
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  version: z.string(),
  raw_import: z.string().optional(),
});

export const ResumeSchema = z.object({
  $schema: z.literal("claimit/v0.2").default("claimit/v0.2"),
  basics: BasicsSchema,
  experience: z.array(ExperienceSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: z.array(SkillCategorySchema).default([]),
  achievements: z.array(AchievementSchema).default([]),
  claims: z.array(ClaimSchema).default([]),
  meta: ResumeMetaSchema,
});

export const VariantCustomizationSchema = z.object({
  type: z.enum(["reorder", "rewrite", "include", "exclude"]),
  path: z.string(),
  reason: z.string(),
});

export const VariantSchema = ResumeSchema.extend({
  variant_meta: z.object({
    name: z.string(),
    target_role: z.string().optional(),
    target_jd: z.string().optional(),
    created_from: z.literal("base"),
    customizations: z.array(VariantCustomizationSchema).default([]),
  }),
});

export type DateRange = z.infer<typeof DateRangeSchema>;
export type Evidence = z.infer<typeof EvidenceSchema>;
export type Impact = z.infer<typeof ImpactSchema>;
export type Scope = z.infer<typeof ScopeSchema>;
export type AchievementAction = z.infer<typeof AchievementActionSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type Claim = z.infer<typeof ClaimSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type Basics = z.infer<typeof BasicsSchema>;
export type ResumeMeta = z.infer<typeof ResumeMetaSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
export type VariantCustomization = z.infer<typeof VariantCustomizationSchema>;
export type Variant = z.infer<typeof VariantSchema>;
