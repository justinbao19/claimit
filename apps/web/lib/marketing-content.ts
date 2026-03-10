export const marketingQuickStartCommands = [
  "corepack pnpm install --no-frozen-lockfile",
  "corepack pnpm --filter @claimit/cli start init --vault ./vault",
  "corepack pnpm --filter @claimit/cli start show --vault ./vault --json",
  "corepack pnpm --filter @claimit/web dev",
] as const;

export const marketingHeroPreviewLines = [
  "claimit import ./resume.pdf --vault ./vault --json",
  "claimit gap-fill --vault ./vault --json",
  "claimit variant create --name pm-growth --role \"Product Manager\" --jd \"...\"",
] as const;

export const marketingTestimonialProfiles = [
  { id: "maya", initials: "ML" },
  { id: "ethan", initials: "EC" },
  { id: "sophia", initials: "SY" },
  { id: "leo", initials: "LR" },
  { id: "nina", initials: "NZ" },
  { id: "owen", initials: "OW" },
] as const;

export const marketingWorksWithTags = [
  "PDF",
  "DOCX",
  "JSON",
  "TXT",
  "CLI",
  "Web UI",
  "Local vault",
  "Job descriptions",
  "Role variants",
  "PDF export",
  "Structured evidence",
  "MCP-ready",
] as const;
