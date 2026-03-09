"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Achievement } from "@claimit/core";

import { apiFetch } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface AchievementFormProps {
  achievement?: Achievement;
}

export function AchievementForm({ achievement }: AchievementFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(achievement?.title ?? "");
  const [summary, setSummary] = useState(achievement?.summary ?? "");
  const [tags, setTags] = useState(achievement?.tags.join(", ") ?? "");
  const [tools, setTools] = useState(achievement?.tools.join(", ") ?? "");
  const [message, setMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (achievement) {
        return apiFetch(`/api/achievements/${achievement.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            achievement: {
              title,
              summary,
              tags: tags
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              tools: tools
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            },
          }),
        });
      }

      return apiFetch("/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          achievement: {
            title,
            summary,
            tags: tags
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            tools: tools
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          },
        }),
      });
    },
    onSuccess: () => {
      setMessage("Saved successfully.");
      router.refresh();
      if (!achievement) {
        setTitle("");
        setSummary("");
        setTags("");
        setTools("");
      }
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : "Unable to save achievement.");
    },
  });

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-700">Title</p>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Launch growth experiment" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">Summary</p>
          <Textarea
            rows={4}
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="Describe the achievement and why it mattered."
          />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">Tags</p>
          <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="growth, product, analytics" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">Tools</p>
          <Input value={tools} onChange={(event) => setTools(event.target.value)} placeholder="SQL, Amplitude, Figma" />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !title || !summary}>
            {achievement ? "Update achievement" : "Add achievement"}
          </Button>
          {message ? <p className="text-sm text-slate-500">{message}</p> : null}
        </div>
      </div>
    </Card>
  );
}
