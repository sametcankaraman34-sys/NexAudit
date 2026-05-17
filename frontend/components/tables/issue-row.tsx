"use client";

import { SeverityBadge } from "@/components/ui/severity-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAppStore } from "@/stores/app-store";
import { useActiveProject } from "@/lib/project-context";
import { NexToast } from "@/lib/nex-toast";
import { cn } from "@/lib/utils";
import type { Issue, IssueStatus } from "@/types";

const statusVariant = {
  detected: "detected" as const,
  in_progress: "in_progress" as const,
  resolved: "resolved" as const,
};

interface IssueRowProps {
  issue: Issue;
  compact?: boolean;
}

export function IssueRow({ issue, compact }: IssueRowProps) {
  const { activeProjectId } = useActiveProject();
  const updateIssueStatus = useAppStore((s) => s.updateIssueStatus);
  const isLoading = useAppStore((s) => s.async.isLoading);
  const cellPy = compact ? "py-2.5" : "py-3.5";

  const cycleStatus = async () => {
    const next: IssueStatus =
      issue.status === "detected"
        ? "in_progress"
        : issue.status === "in_progress"
          ? "resolved"
          : "detected";
    await updateIssueStatus(activeProjectId, issue.id, next);
    if (next === "resolved") {
      NexToast.success("Sorun çözüldü", issue.title);
    }
  };

  return (
    <tr className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-soft)]/50">
      <td className={cn(cellPy, "pr-3")}>
        <SeverityBadge severity={issue.severity} />
      </td>
      <td className={cn(cellPy, "pr-3")}>
        <span
          className={cn(
            "font-medium text-[var(--text-primary)]",
            issue.status === "resolved" && "text-[var(--text-secondary)] line-through",
            compact ? "text-sm" : "text-sm",
          )}
        >
          {issue.title}
        </span>
      </td>
      <td
        className={cn(
          "hidden text-[var(--text-secondary)] sm:table-cell",
          compact ? "py-2.5 pr-3 text-sm" : "py-3.5 pr-4 text-sm",
        )}
      >
        {issue.location}
      </td>
      <td className={cn(cellPy, "text-right")}>
        <button
          type="button"
          disabled={isLoading}
          onClick={cycleStatus}
          className="btn-transition inline-flex"
          title="Durumu değiştir"
        >
          <StatusBadge variant={statusVariant[issue.status]} />
        </button>
      </td>
    </tr>
  );
}
