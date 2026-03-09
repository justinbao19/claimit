import { Command } from "commander";
import { initVault } from "@claimit/core";

import { output } from "../utils/io.js";

export function createInitCommand(): Command {
  return new Command("init")
    .description("Initialize a new resume vault")
    .option("--vault <path>", "Path to the vault directory")
    .option("--json", "Output JSON")
    .option("--human", "Output human-readable text")
    .option("--quiet", "Suppress non-essential output")
    .action(async (options) => {
      const result = await initVault(options.vault);
      output(
        options.human
          ? `Initialized vault at ${result.root}${result.created ? "" : " (already existed)"}`
          : result,
        options,
      );
    });
}
