import { cn } from "../../lib/utils";

export function ClaimitMark({
  className,
  accentClassName,
}: {
  className?: string;
  accentClassName?: string;
}) {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden="true" className={cn("size-6", className)}>
      <rect x="10" y="10" width="76" height="76" rx="24" className={cn("fill-current opacity-[0.14]", accentClassName)} />
      <path
        d="M60 28H43C34.7157 28 28 34.7157 28 43V53C28 61.2843 34.7157 68 43 68H60"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M43 50L50 57L64 41"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
