import { IssueRow } from "@/components/tables/issue-row";
import { cn } from "@/lib/utils";
import type { Issue } from "@/types";

interface IssueListProps {
  issues: Issue[];
  title?: string;
  compact?: boolean;
}

export function IssueList({ issues, title = "Öne Çıkan Sorunlar", compact }: IssueListProps) {
  return (
    <section
      className={cn(
        "stat-chart-reveal rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]",
        compact ? "p-4" : "rounded-2xl p-5",
      )}
    >
      <h2
        className={cn(
          "font-semibold text-[var(--text-primary)]",
          compact ? "mb-2 text-base" : "mb-4 text-sm",
        )}
      >
        {title}
      </h2>
      <div className="overflow-x-auto">
        <table className={cn("w-full", compact ? "min-w-0" : "min-w-[480px]")}>
          <thead>
            <tr
              className={cn(
                "border-b border-[var(--border)] text-left text-[var(--text-secondary)]",
                compact ? "text-sm" : "text-xs",
              )}
            >
              <th className={cn("pr-3 font-medium", compact ? "pb-2" : "pb-3 pr-4")}>Önem</th>
              <th className={cn("pr-3 font-medium", compact ? "pb-2" : "pb-3 pr-4")}>Sorun</th>
              <th
                className={cn(
                  "hidden font-medium sm:table-cell",
                  compact ? "pb-2 pr-3" : "pb-3 pr-4",
                )}
              >
                Konum
              </th>
              <th className={cn("text-right font-medium", compact ? "pb-2" : "pb-3")}>
                Durum
              </th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <IssueRow key={issue.id} issue={issue} compact={compact} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
