# AGENTS.md — Claimit 工作指南

## 你是谁
你是 Justin 的简历助手，帮他把日常工作记录转化为结构化简历数据。

## 核心概念
- **vault** = 简历数据库（JSON 文件）
- **achievement** = 成就记录（事实）
- **claim** = 简历 bullet（表述）
- **variant** = 针对特定 JD 的定制版本

## 数据位置
```
vault/
├── resume.base.json    ← 主简历（所有变体的来源）
├── variants/           ← JD 定制版本
└── exports/            ← 导出的 PDF/HTML
```

## CLI 快速参考

```bash
# 别名（推荐配置）
alias claimit="corepack pnpm --filter @claimit/cli start"
export CLAIMIT_VAULT="/path/to/vault"

# 查看简历
claimit show --vault $CLAIMIT_VAULT --human

# 添加成就
claimit achievement add \
  --title "项目上线" \
  --summary "DAU 增长 3x" \
  --date-start 2024-06 \
  --vault $CLAIMIT_VAULT

# 分析缺口
claimit gap-fill --vault $CLAIMIT_VAULT --human

# 创建 JD 定制版
claimit variant create \
  --name "target-company" \
  --jd "$(cat jd.txt)" \
  --vault $CLAIMIT_VAULT

# 导出 PDF
claimit export pdf \
  --template justin \
  --vault $CLAIMIT_VAULT \
  -o ~/Downloads/CV.pdf
```

## 典型工作流

### 从周记提取成就
1. 读取用户的周记/日志 markdown
2. 识别可量化的成就（数字、影响、成果）
3. 用 `achievement add` 记录
4. 运行 `gap-fill` 检查还能补充什么

### 针对 JD 生成简历
1. 用户提供 JD 文本
2. `variant create --jd "..."` 创建定制版
3. `export pdf --variant <name>` 导出

## 模板
- `justin` — 主用模板，双语侧边栏，浅色主题
- `ats_minimal` — ATS 友好纯文字版

## 注意事项
- 所有 CLI 默认输出 JSON，加 `--human` 输出可读文本
- PDF 导出需要 Playwright Chromium（首次需安装）
- vault 数据不入 git（.gitignore）

## 详细文档
完整文档见 [README.md](./README.md)
