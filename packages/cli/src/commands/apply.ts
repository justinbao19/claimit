import { Command } from "commander";
import { applyAnswers, loadBaseResume, saveBaseResume } from "@claimit/core";

import { output, readJsonInput } from "../utils/io.js";

export function createApplyCommand(): Command {
  return new Command("apply")
    .description("Apply question answers to improve the current resume")
    .argument("[answersFile]", "Path to a JSON file containing answers")
    .option("--vault <path>", "Path to the vault directory")
    .option("--stdin", "Read JSON answers from stdin")
    .option("--json", "Output JSON")
    .option("--human", "Output human-readable text")
    .option("--quiet", "Suppress non-essential output")
    .action(async (answersFile, options) => {
      const answers = await readJsonInput<Record<string, string>>(answersFile, options.stdin);
      const resume = await loadBaseResume(options.vault);
      const result = await applyAnswers(resume, answers);
      await saveBaseResume(result.resume, options.vault);

      output(
        options.human
          ? result.change_log.map((entry) => `- ${entry.description}`).join("\n")
          : {
              patches: result.patches,
              change_log: result.change_log,
              warnings: result.warnings,
            },
        options,
      );
    });
}
