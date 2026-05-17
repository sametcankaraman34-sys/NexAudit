import { SeverityBadge } from "@/components/ui/severity-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { Issue } from "@/types";

interface IssueRowProps {
  issue: Issue;
  compact?: boolean;
}

export function IssueRow({ issue, compact }: IssueRowProps) {
  const cellPy = compact ? "py-2.5" : "py-3.5";

  return (
    <tr className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-soft)]/50">
      <td className={cn(cellPy, "pr-3")}>
        <SeverityBadge severity={issue.severity} />
      </td>
      <td className={cn(cellPy, "pr-3")}>
        <span
          className={cn(
            "font-medium text-[var(--text-primary)]",
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
        <StatusBadge variant="detected" />
      </td>
    </tr>
  );
}
