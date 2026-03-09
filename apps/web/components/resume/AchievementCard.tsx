import Link from "next/link";
import type { Achievement } from "@claimit/core";

import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{achievement.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{achievement.summary}</p>
        </div>
        <Link
          href={`/memory/${achievement.id}`}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Edit
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {achievement.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </Card>
  );
}
