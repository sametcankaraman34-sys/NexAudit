import { Lightbulb, Wrench } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import type { GuidanceItem } from "@/types/audit-intelligence";

interface IntelligenceGuidancePanelProps {
  title?: string;
  subtitle?: string;
  items: GuidanceItem[];
  animationDelay?: number;
}

export function IntelligenceGuidancePanel({
  title = "Düzeltme rehberi",
  subtitle = "NexAudit yalnızca tespit etmez — WordPress ve Elementor içinde nerede düzelteceğinizi gösterir",
  items,
  animationDelay = 0,
}: IntelligenceGuidancePanelProps) {
  return (
    <section
      className="audit-section rounded-2xl border border-[var(--primary)]/15 bg-gradient-to-b from-[var(--primary-soft)]/30 to-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:p-6"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <Lightbulb className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{subtitle}</p>
        </div>
      </div>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="audit-row card-interactive rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            style={{ animationDelay: `${animationDelay + 60 + index * 55}ms` }}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <SeverityBadge severity={item.priority} size="sm" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">{item.issueTitle}</span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{item.guidance}</p>
            <p className="mt-3 flex items-start gap-2 rounded-lg border border-[var(--border)]/80 bg-[var(--surface-soft)] px-3 py-2.5 text-xs leading-relaxed text-[var(--text-primary)]">
              <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--primary)]" strokeWidth={1.75} />
              <span>
                <span className="font-medium text-[var(--primary)]">Düzenleme yolu: </span>
                {item.editorHint}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
