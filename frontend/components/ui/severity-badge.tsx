import { SEVERITY_LABELS } from "@/constants/audit";
import { cn } from "@/lib/utils";
import type { IssueSeverity } from "@/types";

const severityStyles: Record<IssueSeverity, string> = {
  critical: "bg-[var(--danger-soft)] text-[var(--danger)]",
  high: "bg-[#fff7ed] text-[#ea580c]",
  medium: "bg-[var(--warning-soft)] text-[var(--warning)]",
  low: "bg-[var(--surface-soft)] text-[var(--text-secondary)]",
  improvement: "bg-[var(--success-soft)] text-[var(--success)]",
};

interface SeverityBadgeProps {
  severity: IssueSeverity;
  className?: string;
  size?: "sm" | "md";
}

export function SeverityBadge({ severity, className, size = "md" }: SeverityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-0.5 text-sm",
        severityStyles[severity],
        className,
      )}
    >
      {SEVERITY_LABELS[severity]}
    </span>
  );
}
