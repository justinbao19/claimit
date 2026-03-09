"use client";

import { useMutation } from "@tanstack/react-query";
import { BriefcaseBusiness, FileText, Sparkles, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { apiFetch } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function JDInput() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () =>
      apiFetch<{ variant: { variant_meta: { name: string } } }>("/api/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, jd }),
      }),
    onSuccess: (data) => {
      const variantName = data.variant.variant_meta.name;
      setMessage(`Created variant ${variantName}`);
      toast.success("Variant created", {
        description: `${variantName} is ready for review.`,
      });
      router.push(`/variants/${variantName}`);
      router.refresh();
    },
    onError: (error) => {
      const nextMessage = error instanceof Error ? error.message : "Could not create variant.";
      setMessage(nextMessage);
      toast.error("Could not create variant", { description: nextMessage });
    },
  });

  return (
    <Card variant="elevated" padding="lg">
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge variant="accent">Variant builder</Badge>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">Create a role-specific narrative</h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Use a job description to reorganize emphasis, surface the right claims, and prepare a more targeted
                resume version.
              </p>
            </div>
            <div className="flex size-14 items-center justify-center rounded-[22px] bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-white">
              <WandSparkles className="size-6" />
            </div>
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Variant name</p>
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="pm-growth" />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Target role</p>
          <Input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Product Manager" />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Job description</p>
          <Textarea rows={8} value={jd} onChange={(event) => setJd(event.target.value)} placeholder="Paste the JD here..." />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <BriefcaseBusiness className="size-4 text-cyan-300" />
            <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">Role fit</p>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Clarify which experience should lead the story.</p>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <FileText className="size-4 text-violet-300" />
            <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">Keyword signal</p>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Map the base resume against job-specific language.</p>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <Sparkles className="size-4 text-emerald-300" />
            <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">Reusable facts</p>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Tailor emphasis without changing underlying truth.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !name}>
            Create variant
          </Button>
          {message ? <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p> : null}
        </div>
      </div>
    </Card>
  );
}
