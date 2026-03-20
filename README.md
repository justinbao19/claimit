# Claimit — Agent-First Resume Workspace

> **一句话定位：** 用本地 JSON vault 存储简历主数据，通过 CLI / MCP 让 AI Agent 持续更新成就记录、生成 JD 定制变体、一键导出精美 PDF。Web UI 已暂停，当前只维护 CLI + MCP + 模板三条线。

---

## 目录

1. [为什么这样设计](#1-为什么这样设计)
2. [项目结构](#2-项目结构)
3. [数据架构](#3-数据架构)
4. [vault 目录布局](#4-vault-目录布局)
5. [CLI 完整命令参考](#5-cli-完整命令参考)
6. [MCP Server 工具参考](#6-mcp-server-工具参考)
7. [模板系统](#7-模板系统)
8. [LLM 集成](#8-llm-集成)
9. [Justin 的实际工作流](#9-justin-的实际工作流)
10. [当前状态 & 已知问题](#10-当前状态--已知问题)
11. [下一步建议](#11-下一步建议)
12. [开发环境启动](#12-开发环境启动)

---

## 1. 为什么这样设计

### 核心设计哲学

**数据和表现分离。** 简历的所有内容存在本地 `vault/resume.base.json`，模板（Handlebars HTML）只负责呈现。Agent 操作的永远是结构化 JSON，而不是格式化文档。

**CLI / MCP 优先，Web UI 是可选的消费者。** 所有核心逻辑在 `packages/core`，CLI 和 MCP 直接调用。Web UI (`apps/web`) 目前功能可以跑但处于**暂停维护**状态——Justin 的主要工作流是 Cursor Agent + CLI，不需要 Web。

**Agent 友好的 I/O 约定：**
- 所有 CLI 命令默认输出 JSON（`--human` 可切换为人类可读文本）
- 支持 stdin pipe（`--stdin` 读取 JSON 输入）
- 退出码严格：成功 0，错误 1
- 错误信息输出到 stderr，数据输出到 stdout

**成就记忆系统（Achievement Memory）。** 用户不直接编写简历 bullet，而是记录"成就"（achievement），AI 从成就中生成 bullet（claim）。成就是事实，claim 是表述——同一个成就可以生成 ATS 风格、现代风格等多个 claim，针对不同 JD 优先展示不同 claim。

---

## 2. 项目结构

```
claimit/
├── packages/
│   ├── core/                    ← 核心逻辑，零 UI 依赖
│   │   └── src/
│   │       ├── schema/resume.ts ← Zod schema（唯一数据约定）
│   │       ├── vault/           ← 本地 JSON 读写
│   │       ├── parser/          ← PDF/DOCX 解析
│   │       ├── assistant/       ← gap 分析、apply answers、claim 生成
│   │       ├── variant/         ← 变体创建逻辑
│   │       ├── render/          ← Handlebars 渲染 + Playwright PDF
│   │       └── llm/             ← OpenAI / Anthropic / 兼容接口
│   │
│   ├── cli/                     ← 命令行工具（Commander.js）
│   │   └── src/
│   │       ├── index.ts
│   │       └── commands/        ← init / import / show / achievement /
│   │                               gap-fill / apply / variant / render /
│   │                               export / mcp
│   │
│   └── mcp/                     ← MCP Server（stdio transport）
│       └── src/server.ts
│
├── templates/                   ← Handlebars HTML 模板
│   ├── justin/                  ← ★ Justin 的主用模板（高设计质量）
│   ├── ats_minimal/             ← ATS 纯文字模板
│   ├── chinese_sidebar/         ← 中文侧边栏模板（旧版 Justin 设计）
│   ├── modern_clean/            ← 现代简洁
│   ├── creative_dynamic/        ← 创意风格
│   └── professional_cv/         ← 通用专业风格
│
├── apps/
│   └── web/                     ← Next.js Web UI（暂停维护，不要动）
│
├── vault/                       ← Justin 的本地数据（gitignore，不入库）
│   ├── resume.base.json         ← 主简历数据
│   ├── variants/                ← 各 JD 定制变体
│   ├── exports/                 ← 导出的 PDF / HTML
│   └── artifacts/               ← 上传文件、证据文件
│
├── examples/sample-vault/       ← 示例数据（English，用于测试）
└── docs/                        ← PRD 和设计文档
```

---

## 3. 数据架构

### 核心 schema（`packages/core/src/schema/resume.ts`）

所有字段都经过 Zod 验证，加载时自动报错。

```typescript
Resume {
  $schema: "claimit/v0.2"
  basics: {
    name: string               // 姓名（中文）
    name_en?: string           // ★ 新增：英文名/昵称（如 "Justin"）
    email?: string
    phone?: string
    location?: string
    linkedin?: string          // 可以不带 https:// 前缀
    github?: string
    website?: string
    summary?: string           // 个人简介
    highlights?: string[]      // ★ 新增：侧边栏亮点列表
    photo?: string             // 本地路径或 data URL
  }
  experience: Experience[]     // 工作经历
  projects: Project[]          // 项目经历
  education: Education[]       // 教育经历
  skills: SkillCategory[]      // 技能分类 { category, items[] }
  achievements: Achievement[]  // 成就记录（AI 助手的素材库）
  claims: Claim[]              // 从成就生成的简历 bullet
  meta: { created_at, updated_at, version }
}
```

> **重要变更记录（2026-03-20）：**
> - `BasicsSchema` 新增 `name_en?: string` 和 `highlights?: string[]`
> - `linkedin` / `github` / `website` 从 `z.string().url()` 改为 `z.string().optional()`，允许无协议头 URL

### Variant 是 Resume 的超集

```typescript
Variant extends Resume {
  variant_meta: {
    name: string               // 变体名称，如 "bytedance-pm"
    target_role?: string
    target_jd?: string
    created_from: "base"
    customizations: [{         // LLM 建议的调整记录
      type: "reorder" | "rewrite" | "include" | "exclude"
      path: string             // JSON Pointer
      reason: string
    }]
  }
}
```

### Experience / Project 核心字段

```typescript
Experience {
  id: UUID
  company: string
  title: string
  location?: string
  date_range: { start: "YYYY-MM", end?: "YYYY-MM", ongoing?: boolean }
  description?: string
  highlights: string[]        // 工作成就 bullet 点
  achievement_ids: UUID[]     // 关联的 achievement
}

Project {
  id: UUID
  name: string
  role?: string
  date_range?: DateRange
  description: string
  url?: string
  highlights: string[]
  achievement_ids: UUID[]
  tools: string[]
}
```

---

## 4. vault 目录布局

```
vault/
├── .gitignore          ← 自动生成，内容全部 ignore（确保数据不入库）
├── README.md           ← 自动生成的提示文件
├── resume.base.json    ← 主简历，所有变体的来源
├── variants/
│   ├── bytedance-pm.json
│   └── *.json
├── exports/
│   ├── resume.pdf
│   └── *.html / *.pdf
├── artifacts/
│   ├── uploads/        ← 导入的原始 PDF/DOCX
│   └── evidence/       ← 成就的证明材料
└── logs/               ← LLM 操作日志
```

**vault 路径解析优先级：**
1. CLI `--vault <path>` 参数
2. 环境变量 `RESUME_VAULT`
3. 默认 `./vault`（相对于执行目录）

**Justin 的实际 vault 路径：** `/Users/justin/Projects/claimit/vault/`

---

## 5. CLI 完整命令参考

### 全局安装 / 运行方式

```bash
# 当前推荐运行方式（monorepo 内）
corepack pnpm --filter @claimit/cli start <命令> [选项]

# 简写别名（推荐配置）
alias claimit="corepack pnpm --filter @claimit/cli start"
```

所有命令都有 `--vault <path>` 选项，不传则走默认解析逻辑。

---

### `init` — 初始化 vault

```bash
claimit init --vault ./vault --json
```

创建 vault 目录结构 + 空白 `resume.base.json`。已存在时不覆盖数据。

---

### `import` — 导入简历文件

```bash
claimit import ./resume.pdf --vault ./vault --json
claimit import ./resume.docx --vault ./vault --json
```

用 LLM 解析 PDF/DOCX，写入 `resume.base.json`。**会覆盖现有数据**，谨慎使用。

---

### `show` — 查看当前简历

```bash
claimit show --vault ./vault --json       # 结构化 JSON
claimit show --vault ./vault --human      # 人类可读摘要
```

---

### `achievement` — 成就管理

```bash
# 添加新成就
claimit achievement add \
  --title "上线 AI 小程序" \
  --summary "负责增长运营，DAU 增长 3x" \
  --date-start 2024-06 \
  --vault ./vault --json

# 列出所有成就
claimit achievement list --vault ./vault --json

# 从成就生成 bullet（claims）
claimit achievement generate-claims <achievement-id> \
  --style ats \
  --vault ./vault --json
```

---

### `gap-fill` — AI 分析简历缺口

```bash
claimit gap-fill --vault ./vault --max-questions 7 --json
```

输出：
```json
{
  "gaps": [{ "path": "/experience/0/highlights/2", "severity": "missing", "reason": "..." }],
  "questions": [{ "id": "q1", "question": "你在这个项目中影响了多少用户？", "examples": ["影响了 5000 用户"] }],
  "completeness_score": 72
}
```

---

### `apply` — 应用 AI 建议的改进

```bash
# 从 stdin 传入 Q&A 对
echo '{"q1": "影响了 5000 用户", "q2": "skip"}' | \
  claimit apply --stdin --vault ./vault --json
```

输出 JSON Patch 操作列表 + change_log。

---

### `variant` — 变体管理

```bash
# 创建变体（可选传 JD）
claimit variant create \
  --name bytedance-pm \
  --role "产品运营" \
  --jd "字节跳动 xxx 岗位要求..." \
  --vault ./vault --json

# 列出所有变体
claimit variant list --vault ./vault --json

# 查看某变体
claimit variant show bytedance-pm --vault ./vault --json

# 删除变体
claimit variant delete bytedance-pm --vault ./vault
```

---

### `render` — 渲染为 HTML

```bash
# 渲染 base 简历
claimit render justin --vault ./vault --json

# 渲染特定变体
claimit render justin --variant bytedance-pm --vault ./vault --json
```

输出 `{ "html": "<full HTML string>", "path": "..." }`

---

### `export` — 导出文件

```bash
# 导出 PDF（默认输出到 vault/exports/resume.pdf）
claimit export pdf \
  --vault ./vault \
  --template justin \
  -o ~/Downloads/CV/Justin_CV.pdf

# 导出特定变体 PDF
claimit export pdf \
  --vault ./vault \
  --template justin \
  --variant bytedance-pm \
  -o ~/Downloads/CV/Justin_CV_ByteDance.pdf

# 导出 HTML
claimit export html \
  --vault ./vault \
  --template justin \
  -o /tmp/resume.html

# 导出原始 JSON
claimit export json --vault ./vault -o ./resume_backup.json

# 从 stdin 读取渲染好的 HTML 直接转 PDF
claimit render justin --vault ./vault | claimit export pdf --stdin -o output.pdf
```

**注意：** PDF 导出依赖 Playwright Chromium，第一次需要安装：

```bash
corepack pnpm exec playwright install chromium
```

---

### `mcp` — 启动 MCP 服务器

```bash
claimit mcp
# 或
RESUME_VAULT=/Users/justin/Projects/claimit/vault claimit mcp
```

---

## 6. MCP Server 工具参考

MCP Server 通过 stdio transport 运行，供 Cursor / Claude Desktop 等客户端连接。

**环境变量：** `RESUME_VAULT` 指定 vault 路径（默认 `./vault`）

### Cursor 配置（`.cursor/mcp.json` 或全局 MCP 配置）

```json
{
  "mcpServers": {
    "claimit": {
      "command": "corepack",
      "args": ["pnpm", "--filter", "@claimit/mcp", "start"],
      "cwd": "/Users/justin/Projects/claimit",
      "env": {
        "RESUME_VAULT": "/Users/justin/Projects/claimit/vault",
        "OPENAI_API_KEY": "sk-..."
      }
    }
  }
}
```

### 工具列表

| 工具名 | 功能 | 关键参数 |
|--------|------|----------|
| `resume_import` | 导入 PDF/DOCX | `file_path` |
| `resume_gap_analysis` | 分析缺口，生成问题 | `max_questions` (默认 7) |
| `resume_apply_answers` | 应用 Q&A 改进简历 | `answers: Record<string, string>` |
| `resume_create_variant` | 创建 JD 定制变体 | `role?`, `jd?`, `name?` |
| `resume_render` | 渲染为 HTML | `template`, `variant?` |
| `resume_export_pdf` | 导出 PDF | `template`, `variant?`, `output_path` |
| `achievement_add` | 添加成就记录 | `title`, `summary`, `date_start?`, `actions?`, `tools?`, `tags?` |
| `achievement_list` | 列出成就 | `tags?`, `role_context?` |

> **注意：** `resume_render` 的 `template` 参数目前硬编码了 enum `["ats_minimal", "modern_clean", "chinese_sidebar"]`，需要更新以支持 `justin` 模板（见[已知问题](#10-当前状态--已知问题)）。

---

## 7. 模板系统

### 工作原理

```
resume.base.json
       │
       ▼
Handlebars.compile(template.html)(resumeData)
       │
       ▼
完整 HTML 字符串
       │
       ▼
Playwright page.pdf() → PDF 文件
```

引擎位于 `packages/core/src/render/engine.ts`，核心函数：

```typescript
renderToHtml(resume: Resume, templateId: string): Promise<string>
renderToPdf(html: string, outputPath: string): Promise<void>
```

模板路径解析顺序：
1. `{cwd}/templates/{templateId}/template.html`
2. `{cwd}/../../templates/{templateId}/template.html`
3. `{moduleDir}/../../../../templates/{templateId}/template.html`

### 可用模板

| 模板 ID | 说明 | 适用场景 |
|---------|------|----------|
| `justin` | ★ 主用，高设计质量，双语侧边栏，浅色主题 | Justin 的所有简历 |
| `ats_minimal` | 纯文字，ATS 友好 | 北美投递 |
| `chinese_sidebar` | 旧版中文侧边栏（深色） | 参考用 |
| `modern_clean` | 现代简洁 | 欧美风格 |
| `professional_cv` | 通用专业 | 通用 |
| `creative_dynamic` | 创意风格 | 设计类岗位 |

### Handlebars 可用变量

```handlebars
{{basics.name}}               ← 姓名
{{basics.name_en}}            ← 英文名（新增）
{{basics.email}}
{{basics.phone}}
{{basics.location}}
{{basics.linkedin}}
{{basics.github}}
{{basics.website}}
{{basics.summary}}
{{basics.photo}}              ← 本地路径会自动转 base64 data URL
{{#if basics.highlights}}     ← 侧边栏亮点列表（新增）
  {{#each basics.highlights}}
    {{this}}
  {{/each}}
{{/if}}

{{#each experience}}
  {{company}} · {{title}}
  {{formatDateRange date_range}}
  {{location}}
  {{#each highlights}}{{this}}{{/each}}
{{/each}}

{{#each projects}}
  {{name}} · {{role}}
  {{formatDateRange date_range}}
  {{#each highlights}}{{this}}{{/each}}
{{/each}}

{{#each education}}
  {{institution}} — {{degree}} {{field}}
  {{formatDateRange date_range}}
  {{gpa}}
  {{join highlights "；"}}
{{/each}}

{{#each skills}}
  {{category}}: {{join items "、"}}
{{/each}}
```

**内置 helper：**
- `{{formatDateRange date_range}}` → `"2022-01 - 2024-05"` 或 `"2024-06 - Present"`
- `{{join items "、"}}` → `"海外运营、市场营销、BD"`
- `{{initials basics.name}}` → `"包宇"` 或 `"BJ"`
- `{{abbr basics.name}}` → 首字母缩写

### 创建新模板

```bash
cp -r templates/justin templates/my_template
# 编辑 templates/my_template/template.html
# 测试：
corepack pnpm --filter @claimit/cli start render my_template --vault ./vault
```

---

## 8. LLM 集成

### 环境变量配置

```bash
# OpenAI（默认）
OPENAI_API_KEY=sk-...
LLM_MODEL=gpt-4.1-mini          # 默认

# Anthropic
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
LLM_MODEL=claude-3-5-sonnet-latest

# 兼容 OpenAI 接口（如 Ollama 本地）
LLM_PROVIDER=local
LLM_BASE_URL=http://localhost:11434/v1
LLM_MODEL=llama3
```

### LLM 调用的功能

| 功能 | 是否需要 LLM | 降级行为 |
|------|-------------|---------|
| `import` 解析文件 | 是 | 失败报错 |
| `gap-fill` 分析 | 是 | 失败报错 |
| `apply` 应用答案 | 是 | 失败报错 |
| `variant create`（有 role/jd） | 是 | 降级为关键词匹配排序 |
| `variant create`（无 role/jd） | 否 | 直接克隆 base |
| `achievement generate-claims` | 是 | 失败报错 |
| `render` / `export` | 否 | — |

**LLM 调用特性：**
- 自动重试 3 次
- 输出严格 JSON 格式（`response_format: json_object`）
- 用 Zod schema 验证 LLM 输出，不合格则重试

---

## 9. Justin 的实际工作流

### 日常记录 → 更新简历

```bash
# 1. 写完一个项目/里程碑后，记到 Markdown 里
# 2. 让 Agent 从 MD 中提炼成就
claimit achievement add \
  --title "IZAR Bridge 测试网上线" \
  --summary "单月推特自然粉丝增长 20k，42万钱包地址" \
  --date-start 2023-05 \
  --tools "Discord,Twitter,Aleo" \
  --tags "web3,growth,community" \
  --vault /Users/justin/Projects/claimit/vault

# 3. 运行 gap 分析，看哪里可以补充数据
claimit gap-fill --vault /Users/justin/Projects/claimit/vault --human

# 4. 回答问题，AI 自动 patch 简历
echo '{"q1": "测试期间累计跨链 ETH 超过 11 万", "q2": "skip"}' | \
  claimit apply --stdin --vault /Users/justin/Projects/claimit/vault
```

### 针对 JD 输出定制 PDF

```bash
# 1. 创建定制变体
claimit variant create \
  --name "bytedance-web3-ops" \
  --role "Web3 产品运营" \
  --jd "$(cat ~/Jobs/bytedance_jd.txt)" \
  --vault /Users/justin/Projects/claimit/vault --json

# 2. 导出 PDF
claimit export pdf \
  --vault /Users/justin/Projects/claimit/vault \
  --template justin \
  --variant bytedance-web3-ops \
  -o ~/Downloads/CV/Justin_ByteDance.pdf
```

### 直接浏览器可视化编辑

Justin_CV.html（`~/Downloads/CV/Justin_CV.html`）是独立的可视化编辑器：
- 完全自包含的 HTML 文件，直接浏览器打开
- contenteditable 支持直接点击编辑所有内容
- 配色选择器（6 种浅色 + 5 种深色方案）
- 工具栏：添加工作/教育/项目条目、新增页面、导出 PDF（浏览器打印）
- 和 vault 数据**互相独立**，手动编辑后需要手动同步回 JSON（或反过来）

### 两种工作流的关系

```
vault/resume.base.json  ←→  Justin_CV.html
      (CLI/MCP)               (浏览器编辑)
         │                         │
         ▼                         ▼
  claimit export pdf        浏览器打印 PDF
（精确数据驱动，适合批量）   （直觉编辑，适合微调）
```

---

## 10. 当前状态 & 已知问题

### ✅ 已完成、可用

- `packages/core` 全部核心逻辑（schema / vault / render / llm / assistant / variant）
- `packages/cli` 全部命令
- `packages/mcp` MCP Server，8 个工具
- `templates/justin` — Justin 的高质量浅色主题模板（Handlebars 版）
- `vault/resume.base.json` — Justin 的完整结构化简历数据
- `Justin_CV.html`（`~/Downloads/CV/`）— 独立可视化编辑器（浅色主题）
- CLI `export pdf` 端到端链路验证通过（5秒出 PDF）

### ⚠️ 已知问题 / 待修复

1. **MCP `resume_render` 工具的 `template` 参数是硬编码 enum**
   - 文件：`packages/mcp/src/server.ts` 第 129 行
   - 问题：`z.enum(["ats_minimal", "modern_clean", "chinese_sidebar"])`，不包含 `justin`
   - 修复方案：改为 `z.string()`，或调用 `listTemplates()` 动态生成 enum

2. **`apps/web` 已暂停维护但代码还在**
   - 不影响 CLI/MCP 使用
   - 将来可以考虑整体删除或单独维护

3. **`Justin_CV.html` 与 vault 数据不自动同步**
   - 两者目前完全独立，需要手动保持一致
   - 理想状态：有一个简单脚本可以 vault → HTML 注入数据

4. **`linkedin` 字段格式不统一**
   - Justin 的 vault 里是 `linkedin.com/in/justin-bao`（无协议头）
   - 模板里直接 `{{basics.linkedin}}` 展示，不能点击跳转
   - 修复：模板里用 `<a href="https://{{basics.linkedin}}">{{basics.linkedin}}</a>`

5. **`gpa` 字段在 `education` 里存在 schema，但模板里渲染方式需确认**
   - 模板：`{{#if gpa}} GPA：{{gpa}} {{/if}}` + highlights join
   - 浙江外国语学院的 GPA 3.72 是通过 `gpa` 字段，"校优秀毕业生"是 highlights[0]

### 🔵 schema 变更历史（2026-03-20）

```diff
// packages/core/src/schema/resume.ts
  BasicsSchema = z.object({
    name: z.string().default("Your Name"),
+   name_en: z.string().optional(),         // 新增：英文名
    email: z.string().email().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
-   linkedin: z.string().url().optional(),  // 改：去除 URL 验证
+   linkedin: z.string().optional(),
-   github: z.string().url().optional(),
+   github: z.string().optional(),
-   website: z.string().url().optional(),
+   website: z.string().optional(),
    summary: z.string().optional(),
+   highlights: z.array(z.string()).optional(), // 新增：侧边栏亮点列表
    photo: z.string().optional(),
  })
```

---

## 11. 下一步建议

按优先级排列：

### P0 — 立即可以做

**修复 MCP `resume_render` 模板枚举**（5 分钟）

```typescript
// packages/mcp/src/server.ts
// 改第 129 行：
template: z.enum(["ats_minimal", "modern_clean", "chinese_sidebar"]),
// 改为：
template: z.string().default("justin"),
```

**linkedin 链接修复**（模板层）

在 `templates/justin/template.html` 里给 LinkedIn 行加 `href`：
```handlebars
<a href="https://{{basics.linkedin}}" target="_blank">{{basics.linkedin}}</a>
```

### P1 — 近期重要

**建立 vault → Justin_CV.html 数据同步脚本**

写一个 `scripts/sync-html.ts`：读取 vault/resume.base.json，用 JS 将数据注入 Justin_CV.html 的 contenteditable 元素，输出填充好数据的 HTML。这样手动编辑版和 CLI 版可以双向对齐。

**在 Cursor 里配置 MCP Server**

让 Agent 直接调用 claimit 工具，完成「MD 笔记 → achievement → gap-fill → variant → PDF」的全自动链路。

**为 `justin` 模板添加第二页分页逻辑**

当前模板是流式布局（内容多时自然分页），不像 Justin_CV.html 的两页固定编辑器。打印时效果依赖 Playwright，需要验证长内容是否自然分页美观。

### P2 — 想做但不急

**Agent Skill 文件（SKILL.md）**

写一个 Claimit skill，让 AI Agent 知道如何用 MCP 工具更新简历：读 MD 笔记 → 提炼成就 → gap 分析 → 导出 PDF。

**多语言变体**

同一份 vault 数据用 `justin` 模板输出中文版，用 `ats_minimal` 输出英文版，分别针对中国和海外公司。

**把 achievements 补充完整**

Justin 目前的 vault 里 `achievements: []` 和 `claims: []` 都是空的。下一步把每段工作经历的 highlights 提炼为成就记录，让 gap-fill 和 variant 功能真正发挥作用。

---

## 12. 开发环境启动

### 依赖安装

```bash
cd /Users/justin/Projects/claimit
corepack pnpm install --no-frozen-lockfile
```

### 构建

```bash
corepack pnpm build          # 构建全部 packages
corepack pnpm --filter @claimit/core build    # 只构建 core
corepack pnpm --filter @claimit/cli build     # 只构建 cli
```

### 测试

```bash
corepack pnpm test
```

### 环境变量（`.env` 或 shell）

```bash
# LLM（选一个）
export OPENAI_API_KEY=sk-...
# 或
export LLM_PROVIDER=anthropic
export ANTHROPIC_API_KEY=sk-ant-...

# vault 路径（可选，也可以每次传 --vault 参数）
export RESUME_VAULT=/Users/justin/Projects/claimit/vault
```

### 常用快捷命令（建议加到 shell 配置）

```bash
export CLAIMIT_VAULT="/Users/justin/Projects/claimit/vault"
alias claimit="corepack pnpm --filter @claimit/cli start"

# 然后就可以：
claimit show --vault $CLAIMIT_VAULT --human
claimit export pdf --vault $CLAIMIT_VAULT --template justin -o ~/Downloads/Justin_CV.pdf
```

---

## 附录：Justin 简历数据概览

**主数据文件：** `/Users/justin/Projects/claimit/vault/resume.base.json`

| 字段 | 内容摘要 |
|------|---------|
| `basics.name` | 包宇嘉 |
| `basics.name_en` | Justin |
| `basics.location` | 上海 |
| `basics.highlights` | 6 条个人亮点（Web3/AI 运营、英语能力、社区运营等） |
| `experience` | 3 条（AI小程序创业 / 焜耀科技 / 新东方前途出国） |
| `projects` | 5 条（ve(3,3) DEX / IZAR Bridge / ZKRush / Aleo Ambassador / 原力区） |
| `education` | 3 条（爱丁堡大学 MSc TESOL / UCLA Exchange / 浙外英汉口译） |
| `skills` | 3 类（技能 / 证书 / 语言） |
| `achievements` | 空（待补充） |
| `claims` | 空（待补充） |

**可视化编辑文件：** `/Users/justin/Downloads/CV/Justin_CV.html`（独立，与 vault 不同步）

---

*最后更新：2026-03-20 · 由 Cursor Agent 生成*
