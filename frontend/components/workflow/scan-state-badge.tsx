"use client";

import { SCAN_STATUS_LABELS, SCAN_STATUS_VARIANT } from "@/constants/workflow";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ScanStatus } from "@/types/workflow";
import { cn } from "@/lib/utils";

interface ScanStateBadgeProps {
  status: ScanStatus;
  className?: string;
  pulse?: boolean;
}

export function ScanStateBadge({ status, className, pulse }: ScanStateBadgeProps) {
  const active = status === "scanning" || status === "analyzing";
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      {active && pulse && (
        <span className="scan-pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--primary)]" aria-hidden />
      )}
      <StatusBadge
        variant={SCAN_STATUS_VARIANT[status]}
        label={SCAN_STATUS_LABELS[status]}
        size="sm"
      />
    </span>
  );
}
