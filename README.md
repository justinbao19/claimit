# Claimit

Claimit is an agent-first resume workspace that keeps a base resume, achievement memory, tailored variants, and render/export flows in one local vault.

## Workspace layout

- `packages/core`: shared schema, vault, parser, assistant, variant, and render logic
- `packages/cli`: agent-friendly CLI with JSON-first commands
- `packages/mcp`: MCP server wrapper for automation clients
- `apps/web`: Next.js web UI and REST API
- `templates`: HTML templates for rendering and PDF export
- `examples/sample-vault`: example local data for demos and tests

## Quick start

```bash
corepack pnpm install --no-frozen-lockfile
corepack pnpm --filter @claimit/cli start init --vault ./vault
corepack pnpm --filter @claimit/cli start show --vault ./vault --json
corepack pnpm --filter @claimit/web dev
```

## Core flows

### CLI

```bash
corepack pnpm --filter @claimit/cli start import ./resume.pdf --vault ./vault --json
corepack pnpm --filter @claimit/cli start gap-fill --vault ./vault --json
echo '{"q1":"increased activation by 14%"}' | corepack pnpm --filter @claimit/cli start apply --stdin --vault ./vault --json
corepack pnpm --filter @claimit/cli start variant create --name pm-growth --role "Product Manager" --jd "..."
corepack pnpm --filter @claimit/cli start render ats_minimal --vault ./vault --json
corepack pnpm --filter @claimit/cli start export pdf --vault ./vault --template ats_minimal
```

### MCP

```bash
corepack pnpm --filter @claimit/mcp start
```

### Web

The web app exposes the PRD routes through `apps/web/app/api/[...route]/route.ts`, including:

- `POST /api/import`
- `GET|PUT /api/resume`
- `GET|POST|PUT|DELETE /api/achievements`
- `POST /api/assistant/gap-analysis`
- `POST /api/assistant/apply`
- `GET|POST|DELETE /api/variants`
- `POST /api/render`
- `POST /api/export/pdf`

## Testing

```bash
corepack pnpm test
corepack pnpm build
```

## Notes

- Local data is stored in `vault/` by default and ignored by git.
- PDF export requires Playwright Chromium. Install it with:

```bash
corepack pnpm exec playwright install chromium
```
