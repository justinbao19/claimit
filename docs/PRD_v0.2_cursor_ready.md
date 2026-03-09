# Claimit + Render — PRD v0.2 (Cursor-Ready, Agent-First)

> **Goal**: An open-source AI tool that keeps your resume "always ready" by continuously collecting **facts** (achievements) and rendering them into ATS-friendly resumes.
>
> **Design Principle**: Core-first architecture. CLI and API are primary interfaces; Web UI is a consumer. Any AI agent should be able to operate this tool without human intervention.

**Version:** v0.2  
**Date:** 2026-03-09  
**Target:** Drop into Cursor and implement directly.

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Data Schema (Zod)](#2-data-schema-zod)
3. [CLI Design (Agent-First)](#3-cli-design-agent-first)
4. [MCP Server Interface](#4-mcp-server-interface)
5. [API Contracts](#5-api-contracts)
6. [LLM Prompts (Complete)](#6-llm-prompts-complete)
7. [Web UI Spec](#7-web-ui-spec)
8. [Template System](#8-template-system)
9. [Implementation Plan](#9-implementation-plan)
10. [First Task for Cursor](#10-first-task-for-cursor)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CONSUMERS                             │
├─────────────┬─────────────┬─────────────┬───────────────┤
│   Web UI    │    CLI      │  MCP Server │   API Client  │
│  (Next.js)  │ (Commander) │  (stdio)    │   (REST)      │
└──────┬──────┴──────┬──────┴──────┬──────┴───────┬───────┘
       │             │             │              │
       └─────────────┴─────────────┴──────────────┘
                          │
              ┌───────────▼───────────┐
              │      @claimit/core     │
              │   (Pure TypeScript)   │
              ├───────────────────────┤
              │  • schema/            │
              │  • parser/            │
              │  • memory/            │
              │  • assistant/         │
              │  • variant/           │
              │  • render/            │
              │  • llm/               │
              └───────────────────────┘
                          │
              ┌───────────▼───────────┐
              │     vault/ (data)     │
              │   Local JSON files    │
              └───────────────────────┘
```

### Key Principles
1. **Core has zero UI dependencies** — can run in Node, Bun, or browser
2. **CLI outputs JSON by default** — parseable by any agent
3. **Every action is stateless-capable** — can pass data inline without vault
4. **MCP-compatible** — can be called by Claude Desktop, OpenClaw, etc.

---

## 2. Data Schema (Zod)

### File: `packages/core/src/schema/resume.ts`

```typescript
import { z } from 'zod';

// === Basic Types ===
export const DateRangeSchema = z.object({
  start: z.string().regex(/^\d{4}(-\d{2})?(-\d{2})?$/), // YYYY or YYYY-MM or YYYY-MM-DD
  end: z.string().regex(/^\d{4}(-\d{2})?(-\d{2})?$/).optional(),
  ongoing: z.boolean().optional(),
});

export const EvidenceSchema = z.object({
  type: z.enum(['link', 'file', 'screenshot', 'quote']),
  value: z.string(),
  label: z.string().optional(),
});

export const ImpactSchema = z.object({
  metric: z.string(), // e.g., "revenue_increase", "time_saved", "users_acquired"
  value: z.number().optional(),
  unit: z.string().optional(), // e.g., "%", "hours", "users", "$"
  note: z.string().optional(), // e.g., "rough estimate"
  quantified: z.boolean().default(false),
});

export const ScopeSchema = z.object({
  team_size: z.number().optional(),
  budget: z.string().optional(), // e.g., "$50K", "¥100万"
  users: z.number().optional(),
  region: z.string().optional(), // e.g., "APAC", "Global"
  duration_months: z.number().optional(),
});

// === Achievement (Canonical Fact) ===
export const AchievementSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  date_range: DateRangeSchema,
  role_context: z.string().optional(), // reference to experience.id
  summary: z.string().max(500),
  actions: z.array(z.object({
    text: z.string(),
    verb: z.string().optional(), // extracted strong verb
  })),
  impact: z.array(ImpactSchema),
  scope: ScopeSchema.optional(),
  tools: z.array(z.string()),
  evidence: z.array(EvidenceSchema),
  tags: z.array(z.string()),
  confidence: z.number().min(0).max(1).default(0.5),
  source: z.enum(['imported', 'user', 'ai_suggested']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// === Claim (Render-Ready Bullet) ===
export const ClaimSchema = z.object({
  id: z.string().uuid(),
  achievement_id: z.string().uuid(),
  text: z.string(), // The actual bullet point
  style: z.enum(['ats', 'modern', 'technical']),
  target_role: z.string().optional(),
  keywords: z.array(z.string()),
  priority: z.number().min(0).max(100).default(50),
});

// === Experience Entry ===
export const ExperienceSchema = z.object({
  id: z.string().uuid(),
  company: z.string(),
  title: z.string(),
  location: z.string().optional(),
  date_range: DateRangeSchema,
  description: z.string().optional(),
  highlights: z.array(z.string()), // raw bullets from import
  achievement_ids: z.array(z.string().uuid()), // linked achievements
});

// === Project Entry ===
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  role: z.string().optional(),
  date_range: DateRangeSchema.optional(),
  description: z.string(),
  url: z.string().url().optional(),
  highlights: z.array(z.string()),
  achievement_ids: z.array(z.string().uuid()),
  tools: z.array(z.string()),
});

// === Education Entry ===
export const EducationSchema = z.object({
  id: z.string().uuid(),
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  date_range: DateRangeSchema,
  gpa: z.string().optional(),
  highlights: z.array(z.string()),
});

// === Skills ===
export const SkillCategorySchema = z.object({
  category: z.string(), // e.g., "Languages", "Frameworks", "Tools"
  items: z.array(z.string()),
});

// === Basics (Contact Info) ===
export const BasicsSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
  summary: z.string().optional(), // Professional summary
});

// === Full Resume Schema ===
export const ResumeSchema = z.object({
  $schema: z.literal('claimit/v0.2').default('claimit/v0.2'),
  basics: BasicsSchema,
  experience: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  education: z.array(EducationSchema),
  skills: z.array(SkillCategorySchema),
  achievements: z.array(AchievementSchema), // The memory layer
  claims: z.array(ClaimSchema), // Generated bullets
  meta: z.object({
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    version: z.string(),
    raw_import: z.string().optional(), // Original text for reference
  }),
});

// === Variant Schema (extends Resume) ===
export const VariantSchema = ResumeSchema.extend({
  variant_meta: z.object({
    name: z.string(),
    target_role: z.string().optional(),
    target_jd: z.string().optional(), // Original JD text
    created_from: z.literal('base'),
    customizations: z.array(z.object({
      type: z.enum(['reorder', 'rewrite', 'include', 'exclude']),
      path: z.string(),
      reason: z.string(),
    })),
  }),
});

// === Export Types ===
export type Resume = z.infer<typeof ResumeSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type Claim = z.infer<typeof ClaimSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Variant = z.infer<typeof VariantSchema>;
```

### File: `packages/core/src/schema/assistant.ts`

```typescript
import { z } from 'zod';

// === Gap Analysis Output ===
export const GapItemSchema = z.object({
  path: z.string(), // JSON path like "/experience/0/highlights/2"
  field: z.string(), // "impact", "scope", "metrics"
  severity: z.enum(['missing', 'weak', 'vague']),
  reason: z.string(),
  suggestion: z.string().optional(),
});

export const QuestionSchema = z.object({
  id: z.string(),
  target_path: z.string(), // Which field this question improves
  goal: z.string(), // "quantify_impact", "add_scope", "clarify_action"
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

// === Patch Operation ===
export const PatchOperationSchema = z.object({
  op: z.enum(['add', 'replace', 'remove']),
  path: z.string(),
  value: z.any().optional(),
});

export const ApplyResultSchema = z.object({
  patches: z.array(PatchOperationSchema),
  change_log: z.array(z.object({
    description: z.string(),
    confidence: z.number().min(0).max(1),
    source_question: z.string().optional(),
  })),
  warnings: z.array(z.string()),
});

export type GapAnalysis = z.infer<typeof GapAnalysisSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type ApplyResult = z.infer<typeof ApplyResultSchema>;
```

---

## 3. CLI Design (Agent-First)

### File: `packages/cli/src/index.ts`

The CLI is designed so that any AI agent can:
1. Parse the help output and understand available commands
2. Execute commands with JSON input/output
3. Chain commands together via pipes

### Command Structure

```bash
resume <command> [options]

Commands:
  resume init                    Initialize a new vault
  resume import <file>           Import PDF/DOCX to base resume
  resume show [--format json]    Display current resume
  resume achievement <action>    Manage achievements (add/edit/list/delete)
  resume gap-fill                Run gap analysis and get questions
  resume apply <answers.json>    Apply answers to improve resume
  resume variant <action>        Manage variants (create/list/show)
  resume render <template>       Render to HTML
  resume export <format>         Export to PDF/DOCX/JSON
  resume mcp                     Start MCP server mode

Global Options:
  --vault <path>    Path to vault directory (default: ./vault)
  --json            Output as JSON (default for most commands)
  --human           Output human-readable format
  --quiet           Suppress non-essential output
  --stdin           Read input from stdin
```

### Example Agent Interactions

```bash
# Agent imports a resume
resume import ./old_resume.pdf --json
# Output: { "success": true, "resume": {...}, "parse_report": {...} }

# Agent gets gap analysis
resume gap-fill --json
# Output: { "gaps": [...], "questions": [...], "completeness_score": 65 }

# Agent answers questions and applies
echo '{"q1": "increased conversion by 15%", "q2": "skip"}' | resume apply --stdin --json
# Output: { "patches": [...], "change_log": [...] }

# Agent creates variant for a JD
echo '{"role": "Product Manager", "jd": "..."}' | resume variant create --stdin --json
# Output: { "variant_id": "pm_v1", "changes": [...] }

# Agent renders and exports
resume render ats_minimal --json | resume export pdf --stdin -o resume.pdf
```

### CLI Implementation Pattern

```typescript
// packages/cli/src/commands/gap-fill.ts
import { Command } from 'commander';
import { gapAnalysis } from '@claimit/core';
import { loadVault, output } from '../utils';

export const gapFillCommand = new Command('gap-fill')
  .description('Analyze resume for gaps and generate improvement questions')
  .option('--json', 'Output as JSON', true)
  .option('--human', 'Output human-readable')
  .option('--max-questions <n>', 'Maximum questions to generate', '7')
  .action(async (options) => {
    const vault = await loadVault(options.vault);
    const resume = vault.getBaseResume();
    
    const result = await gapAnalysis(resume, {
      maxQuestions: parseInt(options.maxQuestions),
    });
    
    if (options.human) {
      console.log(`\n📊 Resume Completeness: ${result.completeness_score}%\n`);
      console.log('Questions to improve your resume:\n');
      result.questions.forEach((q, i) => {
        console.log(`${i + 1}. ${q.question}`);
        if (q.examples?.length) {
          console.log(`   Examples: ${q.examples.join(', ')}`);
        }
      });
    } else {
      output(result, options);
    }
  });
```

---

## 4. MCP Server Interface

### File: `packages/mcp/src/server.ts`

The tool can run as an MCP (Model Context Protocol) server, allowing Claude Desktop, OpenClaw, or any MCP-compatible agent to call it directly.

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as core from '@claimit/core';

const server = new Server({
  name: 'claimit',
  version: '0.2.0',
}, {
  capabilities: {
    tools: {},
  },
});

// === Tool Definitions ===
server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'resume_import',
      description: 'Import a PDF or DOCX resume file and parse it into structured JSON',
      inputSchema: {
        type: 'object',
        properties: {
          file_path: { type: 'string', description: 'Path to the resume file' },
          file_type: { type: 'string', enum: ['pdf', 'docx'] },
        },
        required: ['file_path'],
      },
    },
    {
      name: 'resume_gap_analysis',
      description: 'Analyze the current resume for missing information and generate improvement questions',
      inputSchema: {
        type: 'object',
        properties: {
          max_questions: { type: 'number', default: 7 },
        },
      },
    },
    {
      name: 'resume_apply_answers',
      description: 'Apply user answers to improve the resume',
      inputSchema: {
        type: 'object',
        properties: {
          answers: {
            type: 'object',
            description: 'Map of question_id to answer string',
            additionalProperties: { type: 'string' },
          },
        },
        required: ['answers'],
      },
    },
    {
      name: 'resume_create_variant',
      description: 'Create a resume variant tailored to a specific role or job description',
      inputSchema: {
        type: 'object',
        properties: {
          role: { type: 'string', description: 'Target role name' },
          jd: { type: 'string', description: 'Job description text' },
          name: { type: 'string', description: 'Variant name' },
        },
      },
    },
    {
      name: 'resume_render',
      description: 'Render resume to HTML using a template',
      inputSchema: {
        type: 'object',
        properties: {
          template: { type: 'string', enum: ['ats_minimal', 'modern_clean'] },
          variant: { type: 'string', description: 'Variant name (optional, defaults to base)' },
        },
        required: ['template'],
      },
    },
    {
      name: 'resume_export_pdf',
      description: 'Export resume to PDF',
      inputSchema: {
        type: 'object',
        properties: {
          template: { type: 'string' },
          variant: { type: 'string' },
          output_path: { type: 'string' },
        },
        required: ['output_path'],
      },
    },
    {
      name: 'achievement_add',
      description: 'Add a new achievement to the resume memory',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          summary: { type: 'string' },
          date_start: { type: 'string' },
          date_end: { type: 'string' },
          actions: { type: 'array', items: { type: 'string' } },
          impact: { type: 'array', items: { type: 'object' } },
          tools: { type: 'array', items: { type: 'string' } },
          tags: { type: 'array', items: { type: 'string' } },
        },
        required: ['title', 'summary'],
      },
    },
    {
      name: 'achievement_list',
      description: 'List all achievements with optional filters',
      inputSchema: {
        type: 'object',
        properties: {
          tags: { type: 'array', items: { type: 'string' } },
          date_after: { type: 'string' },
          role_context: { type: 'string' },
        },
      },
    },
  ],
}));

// === Tool Handlers ===
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case 'resume_gap_analysis': {
      const resume = await core.loadBaseResume();
      const result = await core.gapAnalysis(resume, {
        maxQuestions: args.max_questions || 7,
      });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
    
    case 'resume_apply_answers': {
      const resume = await core.loadBaseResume();
      const result = await core.applyAnswers(resume, args.answers);
      await core.saveBaseResume(result.resume);
      return { content: [{ type: 'text', text: JSON.stringify(result.change_log, null, 2) }] };
    }
    
    // ... other handlers
  }
});

// Start server
const transport = new StdioServerTransport();
server.connect(transport);
```

### MCP Configuration (for Claude Desktop / OpenClaw)

```json
{
  "mcpServers": {
    "claimit": {
      "command": "npx",
      "args": ["claimit", "mcp"],
      "env": {
        "OPENAI_API_KEY": "${OPENAI_API_KEY}",
        "RESUME_VAULT": "~/Documents/resume-vault"
      }
    }
  }
}
```

---

## 5. API Contracts

### REST API (for Web UI)

```typescript
// All endpoints return JSON
// Error format: { error: string, code: string, details?: any }

// === Import ===
POST /api/import
Content-Type: multipart/form-data
Body: { file: File }
Response: { resume: Resume, parse_report: ParseReport }

// === Resume CRUD ===
GET /api/resume
Response: { resume: Resume }

PUT /api/resume
Body: { resume: Resume }
Response: { success: true }

// === Achievements ===
GET /api/achievements
Query: ?tags=growth,product&after=2025-01
Response: { achievements: Achievement[] }

POST /api/achievements
Body: { achievement: Omit<Achievement, 'id' | 'created_at' | 'updated_at'> }
Response: { achievement: Achievement }

PUT /api/achievements/:id
Body: { achievement: Partial<Achievement> }
Response: { achievement: Achievement }

DELETE /api/achievements/:id
Response: { success: true }

// === Assistant ===
POST /api/assistant/gap-analysis
Body: { max_questions?: number }
Response: { gaps: Gap[], questions: Question[], completeness_score: number }

POST /api/assistant/apply
Body: { answers: Record<string, string> }
Response: { patches: Patch[], change_log: ChangeLogEntry[] }

// === Variants ===
GET /api/variants
Response: { variants: VariantMeta[] }

POST /api/variants
Body: { name: string, role?: string, jd?: string }
Response: { variant: Variant }

GET /api/variants/:name
Response: { variant: Variant }

DELETE /api/variants/:name
Response: { success: true }

// === Render ===
POST /api/render
Body: { template: string, variant?: string }
Response: { html: string }

POST /api/export/pdf
Body: { template: string, variant?: string, filename?: string }
Response: { path: string, url: string }
```

---

## 6. LLM Prompts (Complete)

### File: `packages/core/src/llm/prompts.ts`

```typescript
export const PROMPTS = {
  // === Gap Analysis ===
  GAP_ANALYSIS_SYSTEM: `You are a resume improvement assistant. Your job is to analyze a resume and identify areas that could be strengthened.

Focus on:
1. Missing quantified metrics (numbers, percentages, dollar amounts)
2. Vague or weak action verbs
3. Missing scope information (team size, budget, user count, timeline)
4. Bullets that tell but don't show impact

Rules:
- Generate at most {max_questions} questions
- Questions must be specific to the content in the resume
- Never invent or assume information
- Prioritize high-impact improvements first
- Allow users to skip or say "unknown"

Output JSON matching this schema:
{
  "gaps": [
    {"path": "/experience/0/highlights/2", "field": "impact", "severity": "missing", "reason": "..."}
  ],
  "questions": [
    {"id": "q1", "target_path": "...", "goal": "quantify_impact", "question": "...", "examples": ["..."]}
  ],
  "summary": "Brief overall assessment",
  "completeness_score": 0-100
}`,

  GAP_ANALYSIS_USER: `Analyze this resume and identify improvement opportunities:

{resume_json}

Generate specific questions to fill gaps. Focus on the most impactful improvements first.`,

  // === Apply Answers ===
  APPLY_ANSWERS_SYSTEM: `You are a resume editor. Given a resume, a set of questions, and user answers, generate JSON Patch operations to improve the resume.

Rules:
- Only modify fields related to the answered questions
- If an answer is "skip", "unknown", or unclear, do NOT modify that field
- Keep the original wording if user just provides data (don't rewrite style)
- For new achievements, ensure all required fields are present
- Never invent information not provided by the user
- Add metrics exactly as provided (don't round or change units)

Output JSON matching this schema:
{
  "patches": [
    {"op": "replace", "path": "/experience/0/highlights/2", "value": "..."}
  ],
  "change_log": [
    {"description": "Added metric to highlight about...", "confidence": 0.9, "source_question": "q1"}
  ],
  "warnings": ["Any concerns about the changes"]
}`,

  APPLY_ANSWERS_USER: `Resume:
{resume_json}

Questions asked:
{questions_json}

User answers:
{answers_json}

Generate patches to apply these improvements. Be conservative - only change what the answers support.`,

  // === Claim Generation (Bullet Writing) ===
  CLAIM_GENERATION_SYSTEM: `You are an expert resume bullet writer. Given an achievement record, generate 1-3 polished resume bullets.

Each bullet must:
- Start with a strong action verb (Led, Built, Increased, Reduced, etc.)
- Include the quantified metric if available
- Mention scope if significant (team size, budget, user count)
- Be concise (under 150 characters preferred)
- Be truthful - only state what the achievement supports

Output JSON:
{
  "claims": [
    {"text": "...", "style": "ats", "keywords": ["..."], "priority": 0-100}
  ]
}`,

  CLAIM_GENERATION_USER: `Generate resume bullets for this achievement:

{achievement_json}

Target role (if any): {target_role}
Style: {style}`,

  // === Variant Generation ===
  VARIANT_SYSTEM: `You are a resume tailoring assistant. Given a base resume and a target role/JD, suggest how to customize the resume.

You can:
- Reorder sections or bullets to emphasize relevant experience
- Suggest which achievements to highlight vs de-emphasize
- Propose rewording bullets to match JD keywords (without lying)
- Recommend what to include/exclude

You cannot:
- Invent experience or skills the person doesn't have
- Change factual information (dates, companies, titles)
- Exaggerate or misrepresent

Output JSON:
{
  "customizations": [
    {"type": "reorder", "path": "/experience", "reason": "..."},
    {"type": "rewrite", "path": "/claims/0", "new_value": "...", "reason": "..."},
    {"type": "exclude", "path": "/projects/2", "reason": "..."}
  ],
  "keyword_matches": ["keywords from JD that match resume"],
  "keyword_gaps": ["keywords from JD missing from resume"],
  "rationale": "Overall explanation of changes"
}`,

  VARIANT_USER: `Base resume:
{resume_json}

Target role: {role}
Job description:
{jd}

Suggest customizations to tailor this resume for the role.`,
};
```

### LLM Wrapper

```typescript
// packages/core/src/llm/client.ts
import { z } from 'zod';

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'local';
  model: string;
  apiKey?: string;
  baseUrl?: string;
}

export async function llmCall<T>(
  config: LLMConfig,
  systemPrompt: string,
  userPrompt: string,
  outputSchema: z.ZodSchema<T>,
): Promise<T> {
  // Implementation varies by provider
  // Key: Always validate output against schema
  // Retry up to 2 times if validation fails
  
  const response = await callProvider(config, systemPrompt, userPrompt);
  
  try {
    const parsed = JSON.parse(response);
    return outputSchema.parse(parsed);
  } catch (e) {
    // Retry with error feedback
    throw new Error(`LLM output validation failed: ${e.message}`);
  }
}
```

---

## 7. Web UI Spec

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State**: Zustand (client) + React Query (server)
- **File Upload**: react-dropzone

### Pages & Components

```
app/
├── page.tsx                    # Landing / Dashboard
├── import/
│   └── page.tsx               # Upload resume
├── memory/
│   ├── page.tsx               # Achievement list
│   └── [id]/page.tsx          # Achievement detail/edit
├── assistant/
│   └── page.tsx               # Gap fill chat
├── variants/
│   ├── page.tsx               # Variant list
│   └── [name]/page.tsx        # Variant detail
├── render/
│   └── page.tsx               # Template selection + preview
└── api/
    └── [...route]/route.ts    # API handlers

components/
├── ui/                        # shadcn components
├── resume/
│   ├── ResumePreview.tsx      # Full resume preview
│   ├── AchievementCard.tsx    # Single achievement display
│   ├── AchievementForm.tsx    # Create/edit achievement
│   ├── ExperienceSection.tsx
│   └── SkillsSection.tsx
├── assistant/
│   ├── GapAnalysisPanel.tsx   # Shows gaps + completeness
│   ├── QuestionCard.tsx       # Single question with input
│   └── ChangeLogPanel.tsx     # Shows applied changes
├── variant/
│   ├── VariantCompare.tsx     # Side-by-side diff
│   └── JDInput.tsx            # Job description input
└── render/
    ├── TemplateSelector.tsx
    └── PDFPreview.tsx
```

### Key UI Components

```tsx
// components/assistant/QuestionCard.tsx
interface QuestionCardProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onSkip: () => void;
}

export function QuestionCard({ question, value, onChange, onSkip }: QuestionCardProps) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-2">
        <Badge variant="outline">{question.goal.replace('_', ' ')}</Badge>
        <Button variant="ghost" size="sm" onClick={onSkip}>Skip</Button>
      </div>
      <p className="text-lg font-medium mb-3">{question.question}</p>
      {question.examples && (
        <p className="text-sm text-muted-foreground mb-3">
          Examples: {question.examples.join(', ')}
        </p>
      )}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your answer..."
        rows={3}
      />
    </Card>
  );
}
```

---

## 8. Template System

### File: `templates/ats_minimal/template.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Times New Roman', Georgia, serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #000;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.5in;
    }
    h1 { font-size: 18pt; margin-bottom: 4pt; }
    h2 { font-size: 12pt; border-bottom: 1px solid #000; margin: 12pt 0 6pt; padding-bottom: 2pt; }
    .contact { font-size: 10pt; margin-bottom: 12pt; }
    .contact a { color: #000; text-decoration: none; }
    .entry { margin-bottom: 10pt; }
    .entry-header { display: flex; justify-content: space-between; }
    .entry-title { font-weight: bold; }
    .entry-subtitle { font-style: italic; }
    .entry-date { text-align: right; }
    ul { margin-left: 18pt; margin-top: 4pt; }
    li { margin-bottom: 2pt; }
    .skills-list { display: flex; flex-wrap: wrap; gap: 8pt; }
    .skill-category { margin-bottom: 4pt; }
    .skill-category strong { margin-right: 4pt; }
  </style>
</head>
<body>
  <header>
    <h1>{{basics.name}}</h1>
    <div class="contact">
      {{#if basics.email}}<span>{{basics.email}}</span>{{/if}}
      {{#if basics.phone}} | <span>{{basics.phone}}</span>{{/if}}
      {{#if basics.location}} | <span>{{basics.location}}</span>{{/if}}
      {{#if basics.linkedin}} | <a href="{{basics.linkedin}}">LinkedIn</a>{{/if}}
      {{#if basics.github}} | <a href="{{basics.github}}">GitHub</a>{{/if}}
    </div>
    {{#if basics.summary}}
    <p>{{basics.summary}}</p>
    {{/if}}
  </header>

  {{#if experience.length}}
  <section>
    <h2>Experience</h2>
    {{#each experience}}
    <div class="entry">
      <div class="entry-header">
        <div>
          <span class="entry-title">{{title}}</span> | <span class="entry-subtitle">{{company}}</span>
          {{#if location}}, {{location}}{{/if}}
        </div>
        <div class="entry-date">{{formatDateRange date_range}}</div>
      </div>
      {{#if highlights.length}}
      <ul>
        {{#each highlights}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
      {{/if}}
    </div>
    {{/each}}
  </section>
  {{/if}}

  {{#if projects.length}}
  <section>
    <h2>Projects</h2>
    {{#each projects}}
    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">{{name}}</span>
        {{#if date_range}}<span class="entry-date">{{formatDateRange date_range}}</span>{{/if}}
      </div>
      <p>{{description}}</p>
      {{#if highlights.length}}
      <ul>
        {{#each highlights}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
      {{/if}}
    </div>
    {{/each}}
  </section>
  {{/if}}

  {{#if education.length}}
  <section>
    <h2>Education</h2>
    {{#each education}}
    <div class="entry">
      <div class="entry-header">
        <div>
          <span class="entry-title">{{degree}}</span>{{#if field}} in {{field}}{{/if}}
          | <span class="entry-subtitle">{{institution}}</span>
        </div>
        <div class="entry-date">{{formatDateRange date_range}}</div>
      </div>
      {{#if gpa}}<p>GPA: {{gpa}}</p>{{/if}}
    </div>
    {{/each}}
  </section>
  {{/if}}

  {{#if skills.length}}
  <section>
    <h2>Skills</h2>
    {{#each skills}}
    <div class="skill-category">
      <strong>{{category}}:</strong> {{join items ", "}}
    </div>
    {{/each}}
  </section>
  {{/if}}
</body>
</html>
```

### Render Engine

```typescript
// packages/core/src/render/engine.ts
import Handlebars from 'handlebars';
import { chromium } from 'playwright';

// Register helpers
Handlebars.registerHelper('formatDateRange', (range) => {
  if (!range) return '';
  const start = range.start;
  const end = range.ongoing ? 'Present' : range.end || '';
  return end ? `${start} – ${end}` : start;
});

Handlebars.registerHelper('join', (arr, sep) => arr?.join(sep) || '');

export async function renderToHtml(resume: Resume, templateId: string): Promise<string> {
  const templatePath = `templates/${templateId}/template.html`;
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateSource);
  return template(resume);
}

export async function renderToPdf(html: string, outputPath: string): Promise<void> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.pdf({
    path: outputPath,
    format: 'Letter',
    margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' },
    printBackground: true,
  });
  await browser.close();
}
```

---

## 9. Implementation Plan

### Week 1: Core + CLI

**Day 1-2: Schema + Vault**
- [ ] Set up monorepo with pnpm workspaces
- [ ] Implement Zod schemas
- [ ] Create vault initialization
- [ ] Basic load/save functions

**Day 3-4: Parser**
- [ ] PDF text extraction (pdf-parse)
- [ ] Section detection heuristics
- [ ] Mapping to schema
- [ ] Parse report generation

**Day 5: Memory CRUD**
- [ ] Achievement CRUD operations
- [ ] CLI commands: achievement add/edit/list/delete

**Day 6-7: CLI Foundation**
- [ ] Commander setup
- [ ] import command
- [ ] show command
- [ ] JSON output formatting

### Week 2: Assistant + Render + Web

**Day 8-9: LLM Integration**
- [ ] LLM client wrapper
- [ ] Gap analysis implementation
- [ ] Apply answers implementation
- [ ] CLI: gap-fill, apply commands

**Day 10-11: Variants + Render**
- [ ] Variant creation logic
- [ ] Template engine (Handlebars)
- [ ] PDF export (Playwright)
- [ ] CLI: variant, render, export commands

**Day 12-13: Web UI**
- [ ] Next.js setup with shadcn
- [ ] Import page
- [ ] Memory/achievements page
- [ ] Assistant chat page
- [ ] Render/export page

**Day 14: Polish**
- [ ] MCP server mode
- [ ] README + docs
- [ ] Example vault
- [ ] Basic tests

---

## 10. First Task for Cursor

Copy this into Cursor as your first prompt:

```
I'm building "Claimit" - an AI tool to keep resumes always updated.

Start by setting up the monorepo structure:

1. Initialize with pnpm workspaces:
   - packages/core (TypeScript library)
   - packages/cli (Commander-based CLI)
   - apps/web (Next.js 14)

2. In packages/core, create:
   - src/schema/resume.ts - Copy the Zod schemas from the PRD
   - src/schema/assistant.ts - Copy assistant schemas
   - src/vault/index.ts - Functions to init, load, save vault
   - src/vault/paths.ts - Path utilities for vault structure

3. Create vault initialization:
   - Creates directory structure
   - Creates empty base resume
   - Creates .gitignore for sensitive data

4. Export everything from packages/core/src/index.ts

Use these dependencies:
- zod for validation
- uuid for IDs
- date-fns for date handling

Make sure:
- All functions are properly typed
- Errors are descriptive
- Code is well-commented

The vault structure should be:
vault/
  resume.base.json
  variants/
  artifacts/uploads/
  artifacts/evidence/
  exports/
  logs/
```

---

## Appendix: Environment Variables

```bash
# .env.example
# LLM Provider (required)
OPENAI_API_KEY=sk-...
# Or for Anthropic:
# ANTHROPIC_API_KEY=sk-ant-...

# Optional: Custom model
LLM_MODEL=gpt-4-turbo

# Vault location (defaults to ./vault)
RESUME_VAULT=~/Documents/resume-vault

# Web UI (if running hosted)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Appendix: Package.json (Root)

```json
{
  "name": "claimit",
  "private": true,
  "workspaces": ["packages/*", "apps/*"],
  "scripts": {
    "dev": "pnpm -r dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "cli": "pnpm --filter @claimit/cli start"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0"
  }
}
```

---

**End of PRD v0.2**

This document is designed to be self-contained. Drop it in a Cursor repo and start implementing.
