import { Radar } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { briefDeviations } from "@/data/mock-brief-compliance";
import type { IssueSeverity } from "@/types";

export function DeviationDetectionPanel() {
  return (
    <section
      className="audit-section rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:p-6"
      style={{ animationDelay: "180ms" }}
    >
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary-soft)] to-[var(--surface-soft)] text-[var(--primary)]">
          <Radar className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Sapma tespiti
          </h2>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
            AI destekli brief–site karşılaştırması; marka, CTA ve layout sapmaları
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {briefDeviations.map((dev, index) => (
          <li
            key={dev.id}
            className="audit-row card-interactive rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/40 p-4"
            style={{ animationDelay: `${220 + index * 55}ms` }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={dev.severity} size="sm" />
                  <span className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[13px] font-medium text-[var(--text-secondary)]">
                    {dev.category}
                  </span>
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{dev.message}</p>
              </div>
              {dev.deviationValue && (
                <div className="flex shrink-0 items-center gap-2 sm:pl-4">
                  <DeviationGauge label={dev.deviationValue} severity={dev.severity} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DeviationGauge({
  label,
  severity,
}: {
  label: string;
  severity: IssueSeverity;
}) {
  const fill =
    severity === "critical"
      ? 92
      : severity === "high"
        ? 72
        : severity === "medium"
          ? 48
          : severity === "improvement"
            ? 20
            : 28;
  const color =
    severity === "critical" || severity === "high"
      ? "var(--danger)"
      : severity === "medium"
        ? "var(--warning)"
        : "var(--text-secondary)";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
      <div className="relative h-10 w-10">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 40 40" aria-hidden>
          <circle cx="20" cy="20" r="14" fill="none" stroke="var(--surface-soft)" strokeWidth="4" />
          <circle
            cx="20"
            cy="20"
            r="14"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 14}
            strokeDashoffset={2 * Math.PI * 14 * (1 - fill / 100)}
            className="audit-ring-draw"
          />
        </svg>
      </div>
      <span className="max-w-[120px] text-xs font-semibold leading-tight text-[var(--text-primary)]">
        {label}
      </span>
    </div>
  );
}
