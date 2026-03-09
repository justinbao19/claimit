import { Command } from "commander";
import { createAchievementRecord, loadBaseResume, saveBaseResume } from "@claimit/core";

import { output, readJsonInput } from "../utils/io.js";
import { parseCsv } from "../utils/resume.js";

interface AchievementPayload {
  title?: string;
  summary?: string;
  dateStart?: string;
  dateEnd?: string;
  actions?: string[];
  tools?: string[];
  tags?: string[];
}

function requireValue(value: string | undefined, field: string): string {
  if (!value?.trim()) {
    throw new Error(`Missing required field "${field}".`);
  }
  return value.trim();
}

export function createAchievementCommand(): Command {
  const command = new Command("achievement").description("Manage achievements");

  command
    .command("add")
    .description("Add a new achievement")
    .option("--vault <path>", "Path to the vault directory")
    .option("--title <value>", "Achievement title")
    .option("--summary <value>", "Achievement summary")
    .option("--date-start <value>", "Start date")
    .option("--date-end <value>", "End date")
    .option("--actions <value>", "Comma-separated actions")
    .option("--tools <value>", "Comma-separated tools")
    .option("--tags <value>", "Comma-separated tags")
    .option("--stdin", "Read achievement JSON from stdin")
    .option("--json", "Output JSON")
    .option("--human", "Output human-readable text")
    .option("--quiet", "Suppress non-essential output")
    .action(async (options) => {
      const payload = options.stdin
        ? await readJsonInput<AchievementPayload>(undefined, true)
        : {
            title: options.title,
            summary: options.summary,
            dateStart: options.dateStart,
            dateEnd: options.dateEnd,
            actions: parseCsv(options.actions),
            tools: parseCsv(options.tools),
            tags: parseCsv(options.tags),
          };

      const resume = await loadBaseResume(options.vault);
      const achievement = createAchievementRecord({
        title: requireValue(payload.title, "title"),
        summary: requireValue(payload.summary, "summary"),
        dateStart: payload.dateStart,
        dateEnd: payload.dateEnd,
        actions: payload.actions,
        tools: payload.tools,
        tags: payload.tags,
      });
      resume.achievements.push(achievement);
      await saveBaseResume(resume, options.vault);

      output(options.human ? `Added achievement "${achievement.title}"` : { achievement }, options);
    });

  command
    .command("list")
    .description("List achievements")
    .option("--vault <path>", "Path to the vault directory")
    .option("--tags <value>", "Filter by comma-separated tags")
    .option("--json", "Output JSON")
    .option("--human", "Output human-readable text")
    .option("--quiet", "Suppress non-essential output")
    .action(async (options) => {
      const resume = await loadBaseResume(options.vault);
      const tags = new Set(parseCsv(options.tags).map((tag) => tag.toLowerCase()));
      const achievements =
        tags.size === 0
          ? resume.achievements
          : resume.achievements.filter((achievement) =>
              achievement.tags.some((tag) => tags.has(tag.toLowerCase())),
            );

      output(
        options.human
          ? achievements.map((item) => `${item.title}: ${item.summary}`).join("\n")
          : { achievements },
        options,
      );
    });

  command
    .command("edit")
    .description("Edit an existing achievement")
    .argument("<id>", "Achievement id")
    .option("--vault <path>", "Path to the vault directory")
    .option("--title <value>", "New title")
    .option("--summary <value>", "New summary")
    .option("--actions <value>", "Comma-separated actions")
    .option("--tools <value>", "Comma-separated tools")
    .option("--tags <value>", "Comma-separated tags")
    .option("--stdin", "Read partial achievement JSON from stdin")
    .option("--json", "Output JSON")
    .option("--human", "Output human-readable text")
    .option("--quiet", "Suppress non-essential output")
    .action(async (id, options) => {
      const updates = options.stdin
        ? await readJsonInput<AchievementPayload>(undefined, true)
        : {
            ...(options.title ? { title: options.title } : {}),
            ...(options.summary ? { summary: options.summary } : {}),
            ...(options.actions ? { actions: parseCsv(options.actions) } : {}),
            ...(options.tools ? { tools: parseCsv(options.tools) } : {}),
            ...(options.tags ? { tags: parseCsv(options.tags) } : {}),
          };

      const resume = await loadBaseResume(options.vault);
      const achievement = resume.achievements.find((item) => item.id === id);
      if (!achievement) {
        throw new Error(`Achievement "${id}" not found.`);
      }

      if (updates.title) {
        achievement.title = updates.title;
      }
      if (updates.summary) {
        achievement.summary = updates.summary;
      }
      if (updates.actions) {
        achievement.actions = updates.actions.map((text) => ({ text }));
      }
      if (updates.tools) {
        achievement.tools = updates.tools;
      }
      if (updates.tags) {
        achievement.tags = updates.tags;
      }
      achievement.updated_at = new Date().toISOString();
      await saveBaseResume(resume, options.vault);

      output(options.human ? `Updated achievement "${achievement.title}"` : { achievement }, options);
    });

  command
    .command("delete")
    .description("Delete an achievement")
    .argument("<id>", "Achievement id")
    .option("--vault <path>", "Path to the vault directory")
    .option("--json", "Output JSON")
    .option("--human", "Output human-readable text")
    .option("--quiet", "Suppress non-essential output")
    .action(async (id, options) => {
      const resume = await loadBaseResume(options.vault);
      const nextAchievements = resume.achievements.filter((item) => item.id !== id);
      if (nextAchievements.length === resume.achievements.length) {
        throw new Error(`Achievement "${id}" not found.`);
      }
      resume.achievements = nextAchievements;
      await saveBaseResume(resume, options.vault);
      output(options.human ? `Deleted achievement ${id}` : { success: true }, options);
    });

  return command;
}
