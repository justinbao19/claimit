import { Command } from "commander";
import { gapAnalysis, loadBaseResume } from "@claimit/core";

import { output } from "../utils/io.js";

export function createGapFillCommand(): Command {
  return new Command("gap-fill")
    .description("Analyze resume gaps and generate improvement questions")
    .option("--vault <path>", "Path to the vault directory")
    .option("--max-questions <number>", "Maximum question count", "7")
    .option("--json", "Output JSON")
    .option("--human", "Output human-readable text")
    .option("--quiet", "Suppress non-essential output")
    .action(async (options) => {
      const resume = await loadBaseResume(options.vault);
      const result = await gapAnalysis(resume, {
        maxQuestions: Number(options.maxQuestions),
      });

      output(
        options.human
          ? [
              `Resume completeness: ${result.completeness_score}%`,
              "",
              ...result.questions.map((question, index) => `${index + 1}. ${question.question}`),
            ].join("\n")
          : result,
        options,
      );
    });
}
