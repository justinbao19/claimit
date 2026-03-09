import path from "node:path";
import { mkdir } from "node:fs/promises";
import { Command } from "commander";
import { getVaultPaths, loadBaseResume, renderToHtml, renderToPdf } from "@claimit/core";

import { output, readStdin, writeTextFile } from "../utils/io.js";
import { loadResumeByVariant } from "../utils/resume.js";

function parseHtmlInput(raw: string): string {
  try {
    const parsed = JSON.parse(raw) as { html?: string };
    if (parsed.html) {
      return parsed.html;
    }
  } catch {
    // The input may already be raw HTML.
  }
  return raw;
}

export function createExportCommand(): Command {
  return new Command("export")
    .description("Export resume output to HTML, PDF, or JSON")
    .argument("<format>", "Export format: html | pdf | json")
    .option("--vault <path>", "Path to the vault directory")
    .option("--variant <name>", "Variant name")
    .option("--template <name>", "Template id for html/pdf export", "ats_minimal")
    .option("--stdin", "Read render output or raw HTML from stdin")
    .option("-o, --output <file>", "Output file path")
    .option("--json", "Output JSON")
    .option("--human", "Output human-readable text")
    .option("--quiet", "Suppress non-essential output")
    .action(async (format, options) => {
      const vaultPaths = getVaultPaths(options.vault);
      await mkdir(vaultPaths.exportsDir, { recursive: true });

      const extension = format.toLowerCase();
      const outputFile =
        options.output ??
        path.join(vaultPaths.exportsDir, `resume.${extension === "json" ? "json" : extension === "html" ? "html" : "pdf"}`);

      if (extension === "json") {
        const resume = await loadBaseResume(options.vault);
        await writeTextFile(outputFile, `${JSON.stringify(resume, null, 2)}\n`);
        output(options.human ? outputFile : { path: outputFile }, options);
        return;
      }

      let html: string;
      if (options.stdin) {
        html = parseHtmlInput(await readStdin());
      } else {
        const resume = await loadResumeByVariant(options.vault, options.variant);
        html = await renderToHtml(resume, options.template);
      }

      if (extension === "html") {
        await writeTextFile(outputFile, html);
        output(options.human ? outputFile : { path: outputFile }, options);
        return;
      }

      if (extension === "pdf") {
        await renderToPdf(html, outputFile);
        output(options.human ? outputFile : { path: outputFile }, options);
        return;
      }

      throw new Error(`Unsupported export format "${format}". Use html, pdf, or json.`);
    });
}
