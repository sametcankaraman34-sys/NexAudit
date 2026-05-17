import { BarChart3 } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { complianceAnalytics } from "@/data/mock-brief-compliance";
import type { ComplianceAnalyticItem } from "@/data/mock-brief-compliance";
import { ComplianceBar } from "./mini-score-ring";
import { cn } from "@/lib/utils";

const statusToSeverity = {
  met: "low" as const,
  partial: "medium" as const,
  missing: "high" as const,
  critical: "critical" as const,
};

const statusLabels = {
  met: "Karşılandı",
  partial: "Kısmi",
  missing: "Eksik",
  critical: "Kritik",
};

export function ComplianceAnalyticsPanel() {
  return (
    <section
      className="audit-section rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:p-6"
      style={{ animationDelay: "260ms" }}
    >
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--primary)]">
          <BarChart3 className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Uygunluk analitiği
          </h2>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
            Her madde için uyum seviyesi, güven skoru, etki alanı ve öneri
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {complianceAnalytics.map((item, index) => (
          <ComplianceAnalyticRow key={item.id} item={item} index={index} />
        ))}
      </ul>
    </section>
  );
}

function ComplianceAnalyticRow({
  item,
  index,
}: {
  item: ComplianceAnalyticItem;
  index: number;
}) {
  return (
    <li
      className="audit-row card-interactive rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/30 p-4 lg:p-5"
      style={{ animationDelay: `${300 + index * 50}ms` }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <SeverityBadge severity={statusToSeverity[item.status]} size="sm" />
            <span className="text-[10px] font-medium text-[var(--text-secondary)]">
              {statusLabels[item.status]}
            </span>
            <span className="text-[10px] text-[var(--border)]">·</span>
            <span className="text-[10px] font-medium text-[var(--text-secondary)]">
              {item.affectedArea}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{item.label}</h3>
          {item.detail && (
            <p className="mt-1 text-xs text-[var(--text-secondary)]">{item.detail}</p>
          )}
          <p className="mt-3 rounded-lg border border-[var(--border)]/80 bg-[var(--surface)] px-3 py-2 text-xs leading-relaxed text-[var(--text-primary)]">
            <span className="font-medium text-[var(--primary)]">Öneri: </span>
            {item.recommendation}
          </p>
        </div>

        <div className="grid w-full shrink-0 grid-cols-3 gap-3 sm:w-auto lg:min-w-[220px]">
          <MetricCell label="Uyum" value={`${item.complianceLevel}%`} bar={item.complianceLevel} />
          <MetricCell
            label="Güven"
            value={`${item.confidence}%`}
            bar={item.confidence}
            muted
          />
          <MetricCell label="Etki" value={impactLabel(item.impact)} accent={item.impact} />
        </div>
      </div>
    </li>
  );
}

function MetricCell({
  label,
  value,
  bar,
  muted,
  accent,
}: {
  label: string;
  value: string;
  bar?: number;
  muted?: boolean;
  accent?: "high" | "medium" | "low";
}) {
  const impactColor =
    accent === "high"
      ? "var(--danger)"
      : accent === "medium"
        ? "var(--warning)"
        : accent === "low"
          ? "var(--success)"
          : undefined;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2">
      <p className="text-[10px] font-medium text-[var(--text-secondary)]">{label}</p>
      <p
        className={cn("mt-0.5 text-sm font-bold tabular-nums text-[var(--text-primary)]")}
        style={impactColor ? { color: impactColor } : undefined}
      >
        {value}
      </p>
      {bar !== undefined && (
        <ComplianceBar
          value={bar}
          className="mt-2"
          delayMs={muted ? 0 : 0}
        />
      )}
    </div>
  );
}

function impactLabel(impact: "high" | "medium" | "low") {
  if (impact === "high") return "Yüksek";
  if (impact === "medium") return "Orta";
  return "Düşük";
}
