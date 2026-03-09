import type { ApplyChangeLog } from "@claimit/core";

import { Card } from "../ui/card";

export function ChangeLogPanel({ entries }: { entries: ApplyChangeLog[] }) {
  return (
    <Card className="p-5">
      <h3 className="text-lg font-semibold text-slate-900">Applied changes</h3>
      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No changes applied yet.</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {entries.map((entry, index) => (
            <li key={`${entry.description}-${index}`}>{entry.description}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}
