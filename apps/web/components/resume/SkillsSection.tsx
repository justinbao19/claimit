import type { SkillCategory } from "@claimit/core";
import { BrainCircuit } from "lucide-react";

import { EmptyState } from "../ui/empty-state";
import { Badge } from "../ui/badge";

export function SkillsSection({ skills }: { skills: SkillCategory[] }) {
  if (skills.length === 0) {
    return (
      <EmptyState
        icon={BrainCircuit}
        title="No skills listed yet"
        description="Skills become more useful once imported or grouped by category for variants and final rendering."
      />
    );
  }

  return (
    <div className="space-y-3">
      {skills.map((skill) => (
        <div key={skill.category} className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-sm font-medium text-slate-950 dark:text-white">{skill.category}</p>
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
