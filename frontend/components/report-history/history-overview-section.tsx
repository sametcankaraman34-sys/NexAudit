"use client";

import { Calendar, CheckCircle2, FileBarChart, Search, TrendingUp } from "lucide-react";
import { AnalysisSectionHeader } from "@/components/audit/analysis-section-header";
import { useProjectWorkspace } from "@/lib/project-context";
import { cn } from "@/lib/utils";

function buildMetrics(reportHistoryOverview: ReturnType<typeof useProjectWorkspace>["reportHistory"]["overview"]) {
  return [
  {
    id: "total",
    label: "Toplam Denetim",
    value: String(reportHistoryOverview.totalAudits),
    trend: reportHistoryOverview.totalAuditsTrend,
    trendLabel: "bu ay",
    icon: FileBarChart,
    accent: "primary" as const,
    sparkline: [14, 16, 18, 20, 22, 24],
  },
  {
    id: "avg",
    label: "Ortalama Skor",
    value: String(reportHistoryOverview.averageScore),
    suffix: "/100",
    trend: reportHistoryOverview.averageScoreTrend,
    trendLabel: "puan",
    icon: TrendingUp,
    accent: "success" as const,
    sparkline: reportHistoryOverview.scoreSparkline,
  },
  {
    id: "resolved",
    label: "Çözülen Sorun",
    value: String(reportHistoryOverview.issuesResolved),
    trend: reportHistoryOverview.issuesResolvedTrend,
    trendLabel: "son dönem",
    icon: CheckCircle2,
    accent: "success" as const,
    sparkline: [120, 138, 152, 164, 178, 186],
  },
  {
    id: "seo",
    label: "SEO İyileştirmesi",
    value: String(reportHistoryOverview.seoImprovements),
    trend: reportHistoryOverview.seoImprovementsTrend,
    trendLabel: "madde",
    icon: Search,
    accent: "primary" as const,
    sparkline: [12, 16, 19, 22, 25, 28],
  },
  {
    id: "last",
    label: "Son Denetim",
    value: reportHistoryOverview.lastAuditDate,
    trendBadge: "Güncel",
    trendLabel: "aktif proje",
    icon: Calendar,
    accent: "info" as const,
    sparkline: [1, 1, 2, 2, 3, 3],
    isDate: true,
  },
  ];
}

const accentStyles = {
  primary: { bg: "var(--primary-soft)", color: "var(--primary)" },
  success: { bg: "var(--success-soft)", color: "var(--success)" },
  info: { bg: "var(--surface-soft)", color: "var(--text-secondary)" },
};

export function HistoryOverviewSection() {
  const { reportHistory } = useProjectWorkspace();
  const metrics = buildMetrics(reportHistory.overview);

  return (
    <section className="audit-section" style={{ animationDelay: "0ms" }}>
      <AnalysisSectionHeader
        title="Geçmiş özeti"
        description="Projelerinizde denetim evrimi ve optimizasyon ilerlemesi"
      />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const accent = accentStyles[metric.accent];
          const maxSpark = Math.max(...metric.sparkline);
          const trendDisplay =
            "trend" in metric && metric.trend != null
              ? `+${metric.trend}`
              : "trendBadge" in metric
                ? metric.trendBadge
                : null;
          const trendTone =
            "trend" in metric && metric.trend != null
              ? "text-[var(--success)]"
              : "text-[var(--text-secondary)]";

          return (
            <li key={metric.id} className="list-none">
              <article
                className="audit-row card-interactive flex min-h-[172px] flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]"
                style={{ animationDelay: `${60 + index * 50}ms` }}
              >
                <div className="flex h-9 shrink-0 items-center justify-between gap-2">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: accent.bg, color: accent.color }}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span
                    className={cn(
                      "min-w-[2.25rem] text-right text-xs font-semibold tabular-nums leading-none",
                      trendTone,
                    )}
                  >
                    {trendDisplay}
                  </span>
                </div>

                <p className="mt-3 h-4 shrink-0 truncate text-sm font-medium leading-4 text-[var(--text-secondary)]">
                  {metric.label}
                </p>

                <div className="mt-1 flex h-9 shrink-0 items-end">
                  <p
                    className={cn(
                      "font-bold tabular-nums leading-none text-[var(--text-primary)]",
                      metric.isDate ? "text-[15px] leading-tight" : "text-2xl",
                    )}
                  >
                    {metric.value}
                    {"suffix" in metric && metric.suffix && (
                      <span className="ml-0.5 text-sm font-semibold text-[var(--text-secondary)]">
                        {metric.suffix}
                      </span>
                    )}
                  </p>
                </div>

                <p className="mt-1 h-3.5 shrink-0 truncate text-[13px] leading-[14px] text-[var(--text-secondary)]">
                  {"trend" in metric && metric.trend != null && metric.trendLabel
                    ? `+${metric.trend} ${metric.trendLabel}`
                    : "trendLabel" in metric && metric.trendLabel
                      ? metric.trendLabel
                      : "\u00a0"}
                </p>

                <div className="mt-auto flex h-8 shrink-0 items-end gap-0.5 pt-3">
                  {metric.sparkline.map((v, i) => (
                    <span
                      key={i}
                      className="audit-vbar-grow min-w-0 flex-1 rounded-sm"
                      style={{
                        height: `${Math.max(20, (v / maxSpark) * 100)}%`,
                        backgroundColor: accent.color,
                        opacity: 0.35 + (i / metric.sparkline.length) * 0.5,
                        animationDelay: `${100 + index * 40 + i * 25}ms`,
                      }}
                    />
                  ))}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
