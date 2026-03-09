import { Command } from "commander";

import { output } from "../utils/io.js";
import { loadResumeByVariant } from "../utils/resume.js";

export function createShowCommand(): Command {
  return new Command("show")
    .description("Display the base resume or a variant")
    .option("--vault <path>", "Path to the vault directory")
    .option("--variant <name>", "Variant name")
    .option("--json", "Output JSON")
    .option("--human", "Output human-readable text")
    .option("--quiet", "Suppress non-essential output")
    .action(async (options) => {
      const resume = await loadResumeByVariant(options.vault, options.variant);
      output(
        options.human
          ? `Resume for ${resume.basics.name} with ${resume.experience.length} experience entries`
          : { resume },
        options,
      );
    });
}
