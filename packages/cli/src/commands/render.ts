import { Command } from "commander";
import { renderToHtml } from "@claimit/core";

import { output } from "../utils/io.js";
import { loadResumeByVariant } from "../utils/resume.js";

export function createRenderCommand(): Command {
  return new Command("render")
    .description("Render a resume variant to HTML")
    .argument("<template>", "Template id")
    .option("--vault <path>", "Path to the vault directory")
    .option("--variant <name>", "Variant name")
    .option("--json", "Output JSON")
    .option("--human", "Output human-readable text")
    .option("--quiet", "Suppress non-essential output")
    .action(async (template, options) => {
      const resume = await loadResumeByVariant(options.vault, options.variant);
      const html = await renderToHtml(resume, template);
      output(
        options.human ? html : { template, variant: options.variant ?? "base", html },
        options,
      );
    });
}
