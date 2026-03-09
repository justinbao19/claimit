import { Command } from "commander";
import { importResumeFile, initVault, saveBaseResume } from "@claimit/core";

import { output } from "../utils/io.js";

export function createImportCommand(): Command {
  return new Command("import")
    .description("Import a resume file into the base resume")
    .argument("<file>", "Path to a PDF, DOCX, JSON, or TXT resume")
    .option("--vault <path>", "Path to the vault directory")
    .option("--json", "Output JSON")
    .option("--human", "Output human-readable text")
    .option("--quiet", "Suppress non-essential output")
    .action(async (file, options) => {
      await initVault(options.vault);
      const result = await importResumeFile(file);
      await saveBaseResume(result.resume, options.vault);

      output(
        options.human
          ? `Imported ${file} into the base resume.`
          : { success: true, resume: result.resume, parse_report: result.parse_report },
        options,
      );
    });
}
