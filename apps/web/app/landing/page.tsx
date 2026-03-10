import {
  Bot,
  FileStack,
  FolderKanban,
  LayoutTemplate,
  Rocket,
  ScanSearch,
  TerminalSquare,
  Wand2,
} from "lucide-react";

import { FeaturesGrid } from "../../components/marketing/features-grid";
import { FinalCta } from "../../components/marketing/final-cta";
import { MarketingHero } from "../../components/marketing/marketing-hero";
import { OpenToolingStrip } from "../../components/marketing/open-tooling-strip";
import { QuickStartSection } from "../../components/marketing/quick-start-section";
import { TestimonialsSection } from "../../components/marketing/testimonials-section";
import { WorksWithSection } from "../../components/marketing/works-with-section";
import { WorkflowSection } from "../../components/marketing/workflow-section";
import { getServerI18n } from "../../lib/i18n";
import {
  marketingHeroPreviewLines,
  marketingQuickStartCommands,
  marketingTestimonialProfiles,
  marketingWorksWithTags,
} from "../../lib/marketing-content";

export const metadata = {
  title: "Claimit Landing",
  description: "Quick start Claimit from the CLI, keep resume evidence in one local vault, and move from raw resume files to polished exports.",
};

export default async function LandingPage() {
  const { t } = await getServerI18n();

  const featureItems = [
    {
      icon: TerminalSquare,
      title: t("marketing.features.items.cliFirst.title"),
      description: t("marketing.features.items.cliFirst.description"),
    },
    {
      icon: FolderKanban,
      title: t("marketing.features.items.localVault.title"),
      description: t("marketing.features.items.localVault.description"),
    },
    {
      icon: ScanSearch,
      title: t("marketing.features.items.assistedReview.title"),
      description: t("marketing.features.items.assistedReview.description"),
    },
    {
      icon: Wand2,
      title: t("marketing.features.items.roleVariants.title"),
      description: t("marketing.features.items.roleVariants.description"),
    },
    {
      icon: LayoutTemplate,
      title: t("marketing.features.items.exportFlow.title"),
      description: t("marketing.features.items.exportFlow.description"),
    },
    {
      icon: Rocket,
      title: t("marketing.features.items.webCompanion.title"),
      description: t("marketing.features.items.webCompanion.description"),
    },
  ];

  const workflowItems = [
    {
      icon: FileStack,
      title: t("marketing.workflow.items.import.title"),
      description: t("marketing.workflow.items.import.description"),
    },
    {
      icon: FolderKanban,
      title: t("marketing.workflow.items.library.title"),
      description: t("marketing.workflow.items.library.description"),
    },
    {
      icon: Bot,
      title: t("marketing.workflow.items.assistant.title"),
      description: t("marketing.workflow.items.assistant.description"),
    },
    {
      icon: Wand2,
      title: t("marketing.workflow.items.variants.title"),
      description: t("marketing.workflow.items.variants.description"),
    },
    {
      icon: LayoutTemplate,
      title: t("marketing.workflow.items.export.title"),
      description: t("marketing.workflow.items.export.description"),
    },
  ];

  const testimonials = marketingTestimonialProfiles.map((profile) => ({
    ...profile,
    name: t(`marketing.testimonials.items.${profile.id}.name`),
    role: t(`marketing.testimonials.items.${profile.id}.role`),
    quote: t(`marketing.testimonials.items.${profile.id}.quote`),
  }));

  return (
    <div className="space-y-8 pb-10">
      <MarketingHero
        eyebrow={t("marketing.hero.eyebrow")}
        title={t("marketing.hero.title")}
        description={t("marketing.hero.description")}
        badges={[
          { label: t("marketing.hero.badges.cli"), variant: "accent" },
          { label: t("marketing.hero.badges.web") },
          { label: t("marketing.hero.badges.local") },
        ]}
        primaryCta={{ href: "#quick-start", label: t("marketing.hero.primaryCta") }}
        secondaryCta={{ href: "/workspace", label: t("marketing.hero.secondaryCta") }}
        previewTitle={t("marketing.hero.previewLabel")}
        previewDescription={t("marketing.hero.previewTitle")}
        previewTabs={[
          {
            value: "cli",
            label: t("marketing.hero.previewTabs.cli"),
            headline: t("marketing.hero.previewModes.cli.headline"),
            description: t("marketing.hero.previewModes.cli.description"),
            kind: "terminal",
            lines: [...marketingHeroPreviewLines],
            details: [
              t("marketing.hero.previewModes.cli.details.import"),
              t("marketing.hero.previewModes.cli.details.gapFill"),
              t("marketing.hero.previewModes.cli.details.variant"),
              t("marketing.hero.previewModes.cli.details.export"),
            ],
          },
          {
            value: "web",
            label: t("marketing.hero.previewTabs.web"),
            headline: t("marketing.hero.previewModes.web.headline"),
            description: t("marketing.hero.previewModes.web.description"),
            kind: "surface",
            lines: [
              t("marketing.hero.previewModes.web.lines.base"),
              t("marketing.hero.previewModes.web.lines.library"),
              t("marketing.hero.previewModes.web.lines.assistant"),
              t("marketing.hero.previewModes.web.lines.render"),
            ],
            details: [
              t("marketing.hero.previewModes.web.details.workspace"),
              t("marketing.hero.previewModes.web.details.review"),
              t("marketing.hero.previewModes.web.details.export"),
            ],
          },
        ]}
        proofStats={[
          {
            value: t("marketing.hero.proofStats.setup.value"),
            label: t("marketing.hero.proofStats.setup.label"),
            description: t("marketing.hero.proofStats.setup.description"),
          },
          {
            value: t("marketing.hero.proofStats.vault.value"),
            label: t("marketing.hero.proofStats.vault.label"),
            description: t("marketing.hero.proofStats.vault.description"),
          },
          {
            value: t("marketing.hero.proofStats.output.value"),
            label: t("marketing.hero.proofStats.output.label"),
            description: t("marketing.hero.proofStats.output.description"),
          },
        ]}
      />

      <OpenToolingStrip
        eyebrow={t("marketing.openSource.eyebrow")}
        title={t("marketing.openSource.title")}
        description={t("marketing.openSource.description")}
        badge={t("marketing.openSource.badge")}
      />

      <QuickStartSection
        eyebrow={t("marketing.quickStart.eyebrow")}
        title={t("marketing.quickStart.title")}
        description={t("marketing.quickStart.description")}
        badge={t("marketing.quickStart.badge")}
        terminalLabel={t("marketing.quickStart.terminalLabel")}
        commandBlock={marketingQuickStartCommands.join("\n")}
        copyLabel={t("marketing.quickStart.copy")}
        copiedLabel={t("marketing.quickStart.copied")}
        steps={[
          {
            label: t("marketing.quickStart.steps.install.label"),
            title: t("marketing.quickStart.steps.install.title"),
            description: t("marketing.quickStart.steps.install.description"),
          },
          {
            label: t("marketing.quickStart.steps.init.label"),
            title: t("marketing.quickStart.steps.init.title"),
            description: t("marketing.quickStart.steps.init.description"),
          },
          {
            label: t("marketing.quickStart.steps.inspect.label"),
            title: t("marketing.quickStart.steps.inspect.title"),
            description: t("marketing.quickStart.steps.inspect.description"),
          },
          {
            label: t("marketing.quickStart.steps.launch.label"),
            title: t("marketing.quickStart.steps.launch.title"),
            description: t("marketing.quickStart.steps.launch.description"),
          },
        ]}
        ctaLabel={t("marketing.quickStart.cta")}
        ctaHref="/workspace"
      />

      <FeaturesGrid
        eyebrow={t("marketing.features.eyebrow")}
        title={t("marketing.features.title")}
        description={t("marketing.features.description")}
        badge={t("marketing.features.badge")}
        items={featureItems}
      />

      <WorksWithSection
        eyebrow={t("marketing.worksWith.eyebrow")}
        title={t("marketing.worksWith.title")}
        description={t("marketing.worksWith.description")}
        badge={t("marketing.worksWith.badge")}
        tags={[...marketingWorksWithTags]}
        highlights={[
          {
            title: t("marketing.worksWith.highlights.formats.title"),
            description: t("marketing.worksWith.highlights.formats.description"),
          },
          {
            title: t("marketing.worksWith.highlights.workflow.title"),
            description: t("marketing.worksWith.highlights.workflow.description"),
          },
          {
            title: t("marketing.worksWith.highlights.output.title"),
            description: t("marketing.worksWith.highlights.output.description"),
          },
        ]}
      />

      <WorkflowSection
        eyebrow={t("marketing.workflow.eyebrow")}
        title={t("marketing.workflow.title")}
        description={t("marketing.workflow.description")}
        badge={t("marketing.workflow.badge")}
        items={workflowItems}
      />

      <TestimonialsSection
        eyebrow={t("marketing.testimonials.eyebrow")}
        title={t("marketing.testimonials.title")}
        description={t("marketing.testimonials.description")}
        badge={t("marketing.testimonials.badge")}
        items={testimonials}
      />

      <FinalCta
        eyebrow={t("marketing.cta.eyebrow")}
        title={t("marketing.cta.title")}
        description={t("marketing.cta.description")}
        badge={t("marketing.cta.badge")}
        primaryCta={{ href: "#quick-start", label: t("marketing.cta.primary") }}
        secondaryCta={{ href: "/workspace", label: t("marketing.cta.secondary") }}
      />
    </div>
  );
}
