"use client";

import type { ActivityEvent } from "@/types/workflow";
import { cn } from "@/lib/utils";

interface ActivityTimelineProps {
  events: ActivityEvent[];
  className?: string;
  maxItems?: number;
  title?: string;
}

export function ActivityTimeline({
  events,
  className,
  maxItems = 8,
  title = "Operasyon akışı",
}: ActivityTimelineProps) {
  const items = events.slice(0, maxItems);
  if (!items.length) {
    return (
      <section
        className={cn(
          "rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)]/50 p-4",
          className,
        )}
      >
        <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Tarama başlattığında adımlar burada listelenir.
        </p>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
      <ol className="relative space-y-0">
        {items.map((event, index) => (
          <li
            key={event.id}
            className="activity-timeline-row relative flex gap-3 pb-3 last:pb-0"
            style={{ animationDelay: `${index * 45}ms` }}
          >
            {index < items.length - 1 && (
              <span
                className="absolute left-[5px] top-3 h-[calc(100%-4px)] w-px bg-[var(--border)]"
                aria-hidden
              />
            )}
            <span className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--primary)]/80 ring-2 ring-[var(--surface)]" />
            <div className="min-w-0 flex-1">
              <p className="text-xs tabular-nums text-[var(--text-secondary)]">{event.timeLabel}</p>
              <p className="text-sm leading-snug text-[var(--text-primary)]">{event.message}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
