"use client";

import { Sparkles } from "lucide-react";
import { useProjectWorkspace } from "@/lib/project-context";

export function HistoricalInsightsPanel() {
  const { reportHistory } = useProjectWorkspace();
  const historicalInsights = reportHistory.insights;

  return (
    <section
      className="audit-section rounded-2xl border border-[var(--primary)]/15 bg-gradient-to-b from-[var(--primary-soft)]/30 to-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:p-6"
      style={{ animationDelay: "280ms" }}
    >
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <Sparkles className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Tarihsel öngörüler
          </h2>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
            NexAudit geçmiş denetimlerden çıkardığı optimizasyon içgörüleri
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {historicalInsights.map((item, index) => (
          <li
            key={item.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 px-4 py-3"
            style={{ animationDelay: `${320 + index * 45}ms` }}
          >
            <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--primary)]">
              {item.category}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--text-primary)]">
              {item.insight}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
