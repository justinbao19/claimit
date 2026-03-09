import { Command } from "commander";
import {
  createVariant,
  createVariantName,
  listVariants,
  loadBaseResume,
  loadVariant,
  saveVariant,
  deleteVariant,
} from "@claimit/core";

import { output, readJsonInput } from "../utils/io.js";

interface VariantPayload {
  name?: string;
  role?: string;
  jd?: string;
}

export function createVariantCommand(): Command {
  const command = new Command("variant").description("Manage resume variants");

  command
    .command("create")
    .description("Create a tailored variant")
    .option("--vault <path>", "Path to the vault directory")
    .option("--name <value>", "Variant name")
    .option("--role <value>", "Target role")
    .option("--jd <value>", "Job description text")
    .option("--stdin", "Read variant input JSON from stdin")
    .option("--json", "Output JSON")
    .option("--human", "Output human-readable text")
    .option("--quiet", "Suppress non-essential output")
    .action(async (options) => {
      const payload = options.stdin
        ? await readJsonInput<VariantPayload>(undefined, true)
        : {
            name: options.name,
            role: options.role,
            jd: options.jd,
          };

      const baseResume = await loadBaseResume(options.vault);
      const result = await createVariant(baseResume, {
        name: payload.name ?? createVariantName(payload.role),
        role: payload.role,
        jd: payload.jd,
      });
      await saveVariant(result.variant, options.vault);

      output(
        options.human
          ? `Created variant "${result.variant.variant_meta.name}"`
          : result,
        options,
      );
    });

  command
    .command("list")
    .description("List variants")
    .option("--vault <path>", "Path to the vault directory")
    .option("--json", "Output JSON")
    .option("--human", "Output human-readable text")
    .option("--quiet", "Suppress non-essential output")
    .action(async (options) => {
      const variants = await listVariants(options.vault);
      output(options.human ? variants.join("\n") : { variants }, options);
    });

  command
    .command("show")
    .description("Show a variant")
    .argument("<name>", "Variant name")
    .option("--vault <path>", "Path to the vault directory")
    .option("--json", "Output JSON")
    .option("--human", "Output human-readable text")
    .option("--quiet", "Suppress non-essential output")
    .action(async (name, options) => {
      const variant = await loadVariant(name, options.vault);
      output(
        options.human ? `Variant ${name} for ${variant.basics.name}` : { variant },
        options,
      );
    });

  command
    .command("delete")
    .description("Delete a variant")
    .argument("<name>", "Variant name")
    .option("--vault <path>", "Path to the vault directory")
    .option("--json", "Output JSON")
    .option("--human", "Output human-readable text")
    .option("--quiet", "Suppress non-essential output")
    .action(async (name, options) => {
      await deleteVariant(name, options.vault);
      output(options.human ? `Deleted variant ${name}` : { success: true }, options);
    });

  return command;
}
