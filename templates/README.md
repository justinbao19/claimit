# ClaimIt Resume Templates

简历 HTML 模板开发指南。

## 快速开始

```bash
# 用 Cursor 打开模板目录
cursor ~/projects/claimit/templates/
```

## 目录结构

```
templates/
├── README.md           ← 你现在看的文件
├── _preview/           ← 预览用的示例数据和输出
│   ├── sample-data.json
│   └── preview.html
├── modern_clean/       ← 现代简洁风格
│   └── template.html
├── ats_minimal/        ← ATS 友好风格
│   └── template.html
└── [新模板名]/
    └── template.html
```

## 模板语法

使用 **Handlebars** 模板语法。

### 可用变量

```handlebars
{{basics.name}}           - 姓名
{{basics.email}}          - 邮箱
{{basics.phone}}          - 电话
{{basics.location}}       - 地点
{{basics.linkedin}}       - LinkedIn
{{basics.github}}         - GitHub
{{basics.summary}}        - 个人简介

{{#each experience}}      - 工作经历数组
  {{title}}               - 职位
  {{company}}             - 公司
  {{location}}            - 地点
  {{formatDateRange date_range}}  - 时间范围
  {{#each highlights}}    - 工作亮点
    {{this}}
  {{/each}}
{{/each}}

{{#each projects}}        - 项目数组
  {{name}}                - 项目名
  {{description}}         - 描述
  {{date_range}}          - 时间范围
  {{#each highlights}}    - 项目亮点
    {{this}}
  {{/each}}
{{/each}}

{{#each education}}       - 教育经历数组
  {{institution}}         - 学校
  {{degree}}              - 学位
  {{field}}               - 专业
  {{date_range}}          - 时间范围
  {{gpa}}                 - GPA
{{/each}}

{{#each skills}}          - 技能分类数组
  {{category}}            - 分类名
  {{join items ", "}}     - 技能列表（逗号分隔）
{{/each}}
```

### 条件判断

```handlebars
{{#if basics.summary}}
  <p>{{basics.summary}}</p>
{{/if}}

{{#if experience.length}}
  <section>...</section>
{{/if}}
```

### 辅助函数

- `{{formatDateRange date_range}}` - 格式化日期范围（如 "Jan 2024 - Present"）
- `{{join items ", "}}` - 数组转字符串

## 本地预览

### 方法 1：直接打开 HTML（推荐开发时用）

1. 复制 `_preview/sample-data.json` 的数据
2. 手动替换模板中的 `{{变量}}`
3. 浏览器打开 HTML 文件

### 方法 2：用 CLI 渲染

```bash
cd ~/projects/claimit
pnpm claimit render \
  --template modern_clean \
  --data examples/sample-vault/resume.base.json \
  --output templates/_preview/preview.html
```

## 创建新模板

1. 复制现有模板目录：
   ```bash
   cp -r modern_clean my_new_template
   ```

2. 编辑 `my_new_template/template.html`

3. 测试渲染

4. 完成后同步到 skill（见下文）

## 设计约束

- **页面尺寸**：8.5in × 11in（美国 Letter）或 A4
- **边距**：0.5in - 0.75in
- **字体**：使用系统字体或 Web Safe 字体
- **打印友好**：避免背景色、确保黑白可读
- **ATS 友好**：避免复杂布局、使用语义化 HTML

## 同步到 Skill

开发完成后，将模板同步到 skill 目录：

```bash
# 复制到 skill
cp -r ~/projects/claimit/templates/* ~/clawd/skills/claimit/html-templates/

# 发布到 ClawHub
cd ~/clawd/skills/claimit
clawhub publish
```

## 示例数据

见 `_preview/sample-data.json`
