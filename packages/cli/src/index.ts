#!/usr/bin/env node

import { Command } from "commander";

import { createAchievementCommand } from "./commands/achievement.js";
import { createApplyCommand } from "./commands/apply.js";
import { createExportCommand } from "./commands/export.js";
import { createGapFillCommand } from "./commands/gap-fill.js";
import { createImportCommand } from "./commands/import.js";
import { createInitCommand } from "./commands/init.js";
import { createMcpCommand } from "./commands/mcp.js";
import { createRenderCommand } from "./commands/render.js";
import { createShowCommand } from "./commands/show.js";
import { createVariantCommand } from "./commands/variant.js";

export function createProgram(): Command {
  const program = new Command();

  program
    .name("claimit")
    .description("Agent-first resume memory and rendering toolkit")
    .version("0.2.0");

  program.addCommand(createInitCommand());
  program.addCommand(createImportCommand());
  program.addCommand(createShowCommand());
  program.addCommand(createAchievementCommand());
  program.addCommand(createGapFillCommand());
  program.addCommand(createApplyCommand());
  program.addCommand(createVariantCommand());
  program.addCommand(createRenderCommand());
  program.addCommand(createExportCommand());
  program.addCommand(createMcpCommand());

  return program;
}

const isDirectExecution = process.argv[1] && import.meta.url === new URL(process.argv[1], "file://").href;

if (isDirectExecution) {
  createProgram()
    .parseAsync(process.argv)
    .catch((error) => {
      process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
      process.exitCode = 1;
    });
}
