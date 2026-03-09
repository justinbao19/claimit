"use client";

import type { SkillCategory } from "@claimit/core";
import { BrainCircuit } from "lucide-react";

import { useTranslations } from "../layout/locale-provider";
import { EmptyState } from "../ui/empty-state";
import { Badge } from "../ui/badge";

export function SkillsSection({ skills }: { skills: SkillCategory[] }) {
  const t = useTranslations();

  if (skills.length === 0) {
    return (
      <EmptyState
        icon={BrainCircuit}
        title={t("memoryPage.skillsSection.emptyTitle")}
        description={t("memoryPage.skillsSection.emptyDescription")}
      />
    );
  }

  return (
    <div className="space-y-3">
      {skills.map((skill) => (
        <div key={skill.category} className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-overlay)] p-4">
          <p className="text-sm font-medium text-[color:var(--text-primary)]">{skill.category}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {skill.items.map((item) => (
              <Badge key={`${skill.category}-${item}`} variant="default">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
