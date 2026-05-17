import { Sparkles } from "lucide-react";
import { historicalInsights } from "@/data/mock-report-history";

export function HistoricalInsightsPanel() {
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
            className="audit-row card-interactive rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            style={{ animationDelay: `${320 + index * 50}ms` }}
          >
            <span className="mb-2 inline-block rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-0.5 text-[13px] font-medium uppercase tracking-wide text-[var(--text-secondary)]">
              {item.category}
            </span>
            <p className="text-sm leading-relaxed text-[var(--text-primary)]">{item.insight}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
