import { Activity, ArrowUpRight, Globe, ShieldAlert } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { websiteAuditSummary } from "@/data/mock-website-audit";
import { cn } from "@/lib/utils";

const riskStyles = {
  low: { label: "Düşük risk", color: "var(--success)" },
  medium: { label: "Orta risk", color: "var(--warning)" },
  high: { label: "Yüksek risk", color: "var(--danger)" },
};

export function AuditHero() {
  const { overallScore, previousScore, trend, riskLevel, lastScanAt, domain, pagesScanned, elementsAnalyzed } =
    websiteAuditSummary;
  const risk = riskStyles[riskLevel];
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (overallScore / 100) * circumference;
  const scoreColor =
    overallScore >= 70 ? "var(--success)" : overallScore >= 50 ? "var(--warning)" : "var(--danger)";

  return (
    <section className="audit-section card-interactive rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] lg:p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-xs font-medium text-[var(--primary)]">
              <Activity className="h-3.5 w-3.5" strokeWidth={1.75} />
              Canlı denetim merkezi
            </span>
            <StatusBadge variant="good" label="Tarama tamamlandı" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Web Tasarım Denetimi
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--text-secondary)]">
            <span className="inline-flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              {domain}
            </span>
            <span>·</span>
            <span>Son tarama: {lastScanAt}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <SummaryChip label="Taranan sayfa" value={String(pagesScanned)} />
            <SummaryChip label="Analiz edilen öğe" value={elementsAnalyzed.toLocaleString("tr-TR")} />
            <SummaryChip
              label="Skor değişimi"
              value={`+${trend}`}
              accent="success"
              icon={<ArrowUpRight className="h-3 w-3" />}
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-6">
          <div className="relative h-[128px] w-[128px]">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden>
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="var(--surface-soft)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={scoreColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="audit-ring-draw"
                style={
                  {
                    "--ring-circumference": circumference,
                    "--ring-offset": offset,
                  } as React.CSSProperties
                }
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
                {overallScore}
              </span>
              <span className="text-sm font-medium text-[var(--text-secondary)]">/ 100</span>
            </div>
          </div>
          <div className="hidden flex-col gap-3 sm:flex">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/80 px-4 py-3">
              <p className="text-xs text-[var(--text-secondary)]">Önceki skor</p>
              <p className="text-lg font-semibold tabular-nums text-[var(--text-primary)]">{previousScore}</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]/80 px-4 py-3">
              <p className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                <ShieldAlert className="h-3.5 w-3.5" style={{ color: risk.color }} />
                Risk seviyesi
              </p>
              <p className="text-sm font-semibold" style={{ color: risk.color }}>
                {risk.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryChip({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string;
  accent?: "success";
  icon?: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)]/60 px-3 py-1.5 text-xs">
      <span className="text-[var(--text-secondary)]">{label}</span>
      <span
        className={cn(
          "font-semibold tabular-nums text-[var(--text-primary)]",
          accent === "success" && "inline-flex items-center gap-0.5 text-[var(--success)]",
        )}
      >
        {icon}
        {value}
      </span>
    </span>
  );
}
