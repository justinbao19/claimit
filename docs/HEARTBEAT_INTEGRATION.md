# Claimit Heartbeat Integration PRD

> Auto-capture achievements from daily memory files via OpenClaw heartbeat.

**Version**: 1.0  
**Date**: 2026-03-10  
**Target**: OpenClaw skill integration

---

## Overview

Claimit should passively scan the user's daily memory files during OpenClaw heartbeat cycles and:
1. Detect achievement signals (shipped, launched, improved, etc.)
2. Prompt user to log when high-confidence signals found
3. Run weekly review on Sundays

---

## Integration Points

### 1. Skill Registration

The skill is already registered at:
```
~/clawd/skills/claimit/SKILL.md
```

OpenClaw will auto-load via description matching when user mentions:
- 简历, resume, CV
- 记录成就, log achievement
- claimit

### 2. Heartbeat Hook

Add to user's `HEARTBEAT.md`:

```markdown
## 🎯 Claimit 成就扫描

**频率**：每次 heartbeat

**逻辑**：
1. 读取 `memory/YYYY-MM-DD.md`（今天 + 昨天）
2. 扫描成就信号（参考 `skills/claimit/SKILL.md` 中的 patterns）
3. 如果检测到高置信度信号（>0.8）：
   - 询问用户是否要记录
   - 用户确认后写入 `~/.claimit/achievements/`
4. 如果今天是周日：
   - 执行简历健康检查
   - 输出 review 摘要

**状态追踪**：`memory/heartbeat-state.json` → `claimit_last_scan` 字段
```

---

## Achievement Signal Patterns

### English Patterns
```regex
(shipped|launched|released|deployed)\s+(.+)
(increased|improved|boosted)\s+(.+)\s+by\s+(\d+%?)
(reduced|decreased|cut)\s+(.+)\s+by\s+(\d+%?)
(led|managed|coordinated)\s+(.+)\s+team
(promoted to|started as|joined as)\s+(.+)
(saved|generated)\s+\$?[\d,]+
(completed|finished|delivered)\s+(.+)\s+(ahead of|on)\s+schedule
```

### Chinese Patterns
```regex
(上线了?|发布了?|完成了?|交付了?)\s*(.+)
(提升|增长|提高)了?\s*(\d+%?)
(降低|减少|优化)了?\s*(\d+%?)
(带领|负责|主导)\s*(.+)\s*(团队|项目)
(晋升|升职|转岗)\s*(为|到)\s*(.+)
(节省|创造|带来)\s*[\d,]+\s*(万|元|美元)
```

---

## Detection Logic

### Step 1: Scan Memory Files

```typescript
// Pseudocode for heartbeat scan
async function claimitHeartbeatScan() {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = getYesterday();
  
  const memoryFiles = [
    `memory/${today}.md`,
    `memory/${yesterday}.md`
  ];
  
  const signals = [];
  
  for (const file of memoryFiles) {
    if (await fileExists(file)) {
      const content = await readFile(file);
      const detected = detectAchievementSignals(content);
      signals.push(...detected);
    }
  }
  
  return signals.filter(s => s.confidence > 0.7);
}
```

### Step 2: User Prompt on Detection

When signals found with confidence > 0.8:

```
📝 我在你今天的记录中发现了一个可能的成就：

「{detected_text}」

这听起来像是值得记录到简历库的内容。要我帮你整理吗？

[是，帮我记录] [暂时跳过] [以后不要提醒这类]
```

### Step 3: Interactive Capture

If user confirms, follow the capture flow in `SKILL.md`:
1. Ask for missing details (impact, scope, tools)
2. Generate achievement markdown
3. Write to `~/.claimit/achievements/YYYY-MM-DD_slug.md`
4. Confirm save

### Step 4: Weekly Review (Sundays)

```typescript
function isReviewDay(): boolean {
  return new Date().getDay() === 0; // Sunday
}

async function runWeeklyReview() {
  const vault = await loadVault('~/.claimit');
  const review = await generateReview(vault);
  await writeFile('~/.claimit/review.md', review);
  
  // Output summary to user
  return `
📊 简历周检 | ${review.overall_score}/100

${review.summary}

Top 改进项：
${review.top_improvements.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}
`;
}
```

---

## State Tracking

Add to `memory/heartbeat-state.json`:

```json
{
  "claimit_last_scan": 1710028800,
  "claimit_last_review": 1709856000,
  "claimit_skipped_signals": [
    {
      "text": "deployed hotfix",
      "date": "2026-03-09",
      "reason": "user_skipped"
    }
  ]
}
```

**Fields**:
- `claimit_last_scan`: Unix timestamp of last scan
- `claimit_last_review`: Unix timestamp of last full review
- `claimit_skipped_signals`: Signals user chose to skip (avoid re-prompting)

---

## Configuration

User can customize in `~/.claimit/config.md`:

```markdown
## Signal Detection
- **Auto-suggest on Detection**: true
- **Minimum Confidence for Prompt**: 0.8
- **Scan Frequency**: every_heartbeat | daily | manual_only

## Review Schedule
- **Weekly Review Day**: Sunday
- **Monthly Full Review**: 1st of month
- **Auto-review on Achievement Count**: 5 (trigger review after N new achievements)
```

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Vault doesn't exist | Prompt user to initialize: "要创建简历库吗？" |
| Memory file missing | Skip silently, no error |
| Write permission denied | Alert user, suggest fix |
| User repeatedly skips | Reduce prompt frequency for that signal type |

---

## Testing

### Test Case 1: Signal Detection
1. Add to `memory/2026-03-10.md`: "今天上线了新的推荐算法，转化率提升了15%"
2. Run heartbeat
3. Expected: Prompt user to log achievement

### Test Case 2: Weekly Review
1. Populate vault with 5+ achievements
2. Set system date to Sunday (or mock)
3. Run heartbeat
4. Expected: Generate review.md and output summary

### Test Case 3: Skip Memory
1. User skips a signal
2. Same signal appears next day
3. Expected: Do not re-prompt for same signal

---

## Implementation Checklist

- [ ] Add claimit section to HEARTBEAT.md
- [ ] Implement signal detection regex matching
- [ ] Add state tracking to heartbeat-state.json
- [ ] Implement user prompt flow
- [ ] Implement interactive capture flow
- [ ] Implement weekly review trigger
- [ ] Add skip/ignore functionality
- [ ] Test end-to-end flow
