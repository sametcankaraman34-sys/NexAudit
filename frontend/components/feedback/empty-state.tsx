import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-soft)]">
        <Icon className="h-6 w-6 text-[var(--text-secondary)]" strokeWidth={1.5} />
      </div>
      <h3 className="mb-1 text-base font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="max-w-sm text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}
