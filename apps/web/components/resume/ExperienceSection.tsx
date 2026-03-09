import type { Experience } from "@claimit/core";

export function ExperienceSection({ experience }: { experience: Experience[] }) {
  if (experience.length === 0) {
    return <p className="text-sm text-slate-500">No experience entries yet.</p>;
  }

  return (
    <div className="space-y-4">
      {experience.map((entry) => (
        <div key={entry.id} className="rounded-lg border border-slate-200 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">
                {entry.title} · {entry.company}
              </h3>
              {entry.location ? <p className="text-sm text-slate-500">{entry.location}</p> : null}
            </div>
            <p className="text-sm text-slate-500">
              {entry.date_range.start}
              {entry.date_range.ongoing ? " - Present" : entry.date_range.end ? ` - ${entry.date_range.end}` : ""}
            </p>
          </div>
          {entry.highlights.length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {entry.highlights.map((highlight, index) => (
                <li key={`${entry.id}-${index}`}>{highlight}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}
