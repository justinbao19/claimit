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
  { id: "maya", initials: "ML", avatarSrc: "/testimonials/testimonial-avatar-maya.png" },
  { id: "ethan", initials: "EC", avatarSrc: "/testimonials/testimonial-avatar-ethan.png" },
  { id: "sophia", initials: "SY", avatarSrc: "/testimonials/testimonial-avatar-sophia.png" },
  { id: "leo", initials: "LR", avatarSrc: "/testimonials/testimonial-avatar-leo.png" },
  { id: "nina", initials: "NZ", avatarSrc: "/testimonials/testimonial-avatar-nina.png" },
  { id: "owen", initials: "OW", avatarSrc: "/testimonials/testimonial-avatar-owen.png" },
  { id: "amara", initials: "AI", avatarSrc: "/testimonials/testimonial-avatar-amara.png" },
  { id: "julien", initials: "JB", avatarSrc: "/testimonials/testimonial-avatar-julien.png" },
  { id: "priya", initials: "PS", avatarSrc: "/testimonials/testimonial-avatar-priya.png" },
  { id: "hana", initials: "HM", avatarSrc: "/testimonials/testimonial-avatar-hana.png" },
  { id: "diego", initials: "DS", avatarSrc: "/testimonials/testimonial-avatar-diego.png" },
  { id: "clara", initials: "CB", avatarSrc: "/testimonials/testimonial-avatar-clara.png" },
  { id: "marcus", initials: "MJ", avatarSrc: "/testimonials/testimonial-avatar-marcus.png" },
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
