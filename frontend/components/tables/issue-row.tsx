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
  ignored: "ignored" as const,
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

  const setStatus = async (status: IssueStatus) => {
    await updateIssueStatus(activeProjectId, issue.id, status);
    if (status === "resolved") NexToast.success("Sorun çözüldü", issue.title);
    else if (status === "ignored") NexToast.success("Yok sayıldı", issue.title);
    else if (status === "detected") NexToast.success("Sorun yeniden açıldı", issue.title);
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
        <div className="flex flex-wrap justify-end gap-1">
          {issue.status !== "resolved" && issue.status !== "ignored" && (
            <>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => void setStatus("resolved")}
                className="btn-transition rounded-md bg-[var(--success-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--success)]"
              >
                Çöz
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => void setStatus("ignored")}
                className="btn-transition rounded-md border border-[var(--border)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-secondary)]"
              >
                Yok say
              </button>
            </>
          )}
          {(issue.status === "resolved" || issue.status === "ignored") && (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => void setStatus("detected")}
              className="btn-transition rounded-md border border-[var(--border)] px-2 py-0.5 text-[11px] font-semibold"
            >
              Aç
            </button>
          )}
          <StatusBadge variant={statusVariant[issue.status]} />
        </div>
      </td>
    </tr>
  );
}
