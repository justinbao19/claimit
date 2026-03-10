"use client";

import { useEffect, useMemo, useState } from "react";

export function HeroRoleMatchMeter({ label = "Role Match" }: { label?: string }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhase((current) => current + 1);
    }, 170);

    return () => window.clearInterval(timer);
  }, []);

  const progress = useMemo(() => {
    const drift = Math.sin(phase * 0.24) * 0.85 + Math.sin(phase * 0.11 + 0.8) * 0.45;

    return Math.max(90.8, Math.min(93.8, 92 + drift));
  }, [phase]);

  const roundedProgress = Math.round(progress);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-tertiary)]">{label}</p>
        <div className="hero-chip-glow rounded-full bg-[rgba(69,106,90,0.12)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[color:var(--success)]">
          {roundedProgress}%
        </div>
      </div>
      <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-[rgba(96,117,138,0.14)]">
        <div
          className="hero-progress-sheen h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--field-focus),var(--accent))]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}
