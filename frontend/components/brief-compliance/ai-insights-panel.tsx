import { Sparkles } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { briefAiInsights } from "@/data/mock-brief-compliance";

export function AiInsightsPanel() {
  return (
    <section
      className="audit-section rounded-2xl border border-[var(--primary)]/15 bg-gradient-to-b from-[var(--primary-soft)]/35 to-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:p-6"
      style={{ animationDelay: "340ms" }}
    >
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <Sparkles className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            AI stratejik öngörüler
          </h2>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
            Brief hedefleri ile site gerçekliği arasındaki stratejik farklar
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {briefAiInsights.map((insight, index) => (
          <li
            key={insight.id}
            className="audit-row card-interactive rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            style={{ animationDelay: `${380 + index * 55}ms` }}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <SeverityBadge severity={insight.priority} size="sm" />
              <span className="text-[13px] font-medium uppercase tracking-wide text-[var(--primary)]">
                NexAudit Zeka
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-primary)]">{insight.insight}</p>
            <p className="mt-3 flex items-start gap-2 rounded-lg border border-[var(--primary)]/12 bg-[var(--primary-soft)]/20 px-3 py-2.5 text-xs leading-relaxed text-[var(--text-primary)]">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--primary)]" strokeWidth={1.75} />
              <span>
                <span className="font-medium text-[var(--primary)]">Strateji: </span>
                {insight.strategicNote}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
