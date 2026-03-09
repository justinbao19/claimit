import type { SkillCategory } from "@claimit/core";

export function SkillsSection({ skills }: { skills: SkillCategory[] }) {
  if (skills.length === 0) {
    return <p className="text-sm text-slate-500">No skills listed yet.</p>;
  }

  return (
    <div className="space-y-3">
      {skills.map((skill) => (
        <div key={skill.category}>
          <p className="text-sm font-medium text-slate-900">{skill.category}</p>
          <p className="text-sm text-slate-600">{skill.items.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
