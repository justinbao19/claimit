"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { apiFetch } from "../../lib/utils";
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
      router.push(`/variants/${variantName}`);
      router.refresh();
    },
    onError: (error) => setMessage(error instanceof Error ? error.message : "Could not create variant."),
  });

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-700">Variant name</p>
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="pm-growth" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">Target role</p>
          <Input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Product Manager" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">Job description</p>
          <Textarea rows={8} value={jd} onChange={(event) => setJd(event.target.value)} placeholder="Paste the JD here..." />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !name}>
            Create variant
          </Button>
          {message ? <p className="text-sm text-slate-500">{message}</p> : null}
        </div>
      </div>
    </Card>
  );
}
