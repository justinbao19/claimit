"use client";

import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, BadgePlus, LibraryBig, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { Achievement } from "@claimit/core";

import { apiFetch } from "../../lib/utils";
import { Badge } from "../ui/badge";
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
      toast.success(achievement ? "Achievement updated" : "Achievement added", {
        description: "The memory layer has been refreshed.",
      });
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
      toast.error("Unable to save achievement", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    },
  });

  return (
    <Card variant="elevated" padding="lg">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <Badge variant="accent">{achievement ? "Edit fact" : "Add fact"}</Badge>
            <div>
              <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
                {achievement ? "Refine this achievement" : "Capture a reusable achievement"}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Structure high-signal facts once so the assistant, variants, and render pipeline can reuse them later.
              </p>
            </div>
          </div>
          <div className="flex size-14 items-center justify-center rounded-[22px] bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-white">
            {achievement ? <LibraryBig className="size-6" /> : <BadgePlus className="size-6" />}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="grid gap-5"
        >
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Title</p>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Launch growth experiment" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Summary</p>
          <Textarea
            rows={4}
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="Describe the achievement and why it mattered."
          />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Tags</p>
          <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="growth, product, analytics" />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Tools</p>
          <Input value={tools} onChange={(event) => setTools(event.target.value)} placeholder="SQL, Amplitude, Figma" />
            </div>
          </div>
          <div className="grid gap-3 rounded-[24px] border border-slate-200 bg-white/80 p-4 md:grid-cols-[1.2fr_0.8fr] dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/12 dark:text-violet-200">
                <Sparkles className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Write facts with reuse in mind</p>
                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Mention the action, impact, and tools so variants and claim generation have stronger raw material.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-3 rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-white/8 dark:bg-slate-950/30 dark:text-slate-400">
              <p className="font-medium text-slate-700 dark:text-slate-200">Suggested tags</p>
              <p>impact, growth, product, platform, ops, ai</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !title || !summary}>
              {achievement ? "Update achievement" : "Add achievement"}
              <ArrowRight className="size-4" />
            </Button>
            {message ? <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p> : null}
          </div>
        </motion.div>
      </div>
    </Card>
  );
}
