"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CONFETTI = [
  { left: "12%", delay: 0, color: "#6366f1", size: 5 },
  { left: "28%", delay: 40, color: "#10b981", size: 4 },
  { left: "44%", delay: 80, color: "#a78bfa", size: 5 },
  { left: "58%", delay: 20, color: "#38bdf8", size: 4 },
  { left: "72%", delay: 60, color: "#f59e0b", size: 5 },
  { left: "86%", delay: 100, color: "#6366f1", size: 4 },
];

interface CompletionFeedbackProps {
  className?: string;
}

export function CompletionFeedback({ className }: CompletionFeedbackProps) {
  return (
    <div className={cn("relative mx-auto flex h-24 w-24 items-center justify-center", className)}>
      <div className="outcome-confetti-field pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
        {CONFETTI.map((p, i) => (
          <span
            key={i}
            className="outcome-confetti-piece absolute bottom-1/2 rounded-full"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              animationDelay: `${p.delay}ms`,
            }}
          />
        ))}
      </div>
      <div className="outcome-ring-glow absolute inset-0 rounded-full" aria-hidden />
      <div className="outcome-check-ring relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--success)]/30 bg-[var(--success-soft)]">
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 80 80" aria-hidden>
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="var(--success)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="outcome-check-stroke"
            style={{ strokeDasharray: 226, strokeDashoffset: 226 } as React.CSSProperties}
          />
        </svg>
        <span className="outcome-check-icon flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success)] text-white">
          <Check className="h-5 w-5" strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );
}

interface NeutralOutcomeIconProps {
  className?: string;
}

export function NeutralOutcomeIcon({ className }: NeutralOutcomeIconProps) {
  return (
    <div
      className={cn(
        "outcome-neutral-icon relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)]",
        className,
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-secondary)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M5 8h14M5 12h10M5 16h6" strokeLinecap="round" />
          <rect x="3" y="4" width="18" height="16" rx="3" />
        </svg>
      </span>
    </div>
  );
}

interface RemoveOutcomeIconProps {
  className?: string;
}

export function RemoveOutcomeIcon({ className }: RemoveOutcomeIconProps) {
  return (
    <div
      className={cn(
        "outcome-remove-icon relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-soft)]",
        className,
      )}
    >
      <span className="h-8 w-8 rounded-full bg-[var(--border)]/80 outcome-remove-dot" />
    </div>
  );
}
