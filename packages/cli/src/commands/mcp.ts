import { Command } from "commander";

export function createMcpCommand(): Command {
  return new Command("mcp")
    .description("Start MCP server mode")
    .option("--vault <path>", "Path to the vault directory")
    .action(async (options) => {
      if (options.vault) {
        process.env.RESUME_VAULT = options.vault;
      }
      const mcpModule = await import("@claimit/mcp");
      await mcpModule.startMcpServer();
    });
}
