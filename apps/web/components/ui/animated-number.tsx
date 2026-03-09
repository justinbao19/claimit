"use client";

import { animate, useMotionValue, useTransform, motion, type MotionValue } from "framer-motion";
import { useEffect } from "react";

function useCount(value: number): MotionValue<number> {
  const motionValue = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.9,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [motionValue, value]);

  return motionValue;
}

export function AnimatedNumber({ value, compact = false }: { value: number; compact?: boolean }) {
  const motionValue = useCount(value);
  const rounded = useTransform(() => {
    const current = Math.round(motionValue.get());
    return compact ? new Intl.NumberFormat("en-US", { notation: "compact" }).format(current) : current.toString();
  });

  return <motion.span>{rounded}</motion.span>;
}
