import {
  AlertTriangle,
  BarChart3,
  FileWarning,
  TrendingUp,
} from "lucide-react";
import { StatCardInfographic } from "@/components/cards/stat-card-infographic";
import { cn } from "@/lib/utils";
import type { DashboardStat } from "@/types";

const iconMap = {
  chart: BarChart3,
  alert: AlertTriangle,
  file: FileWarning,
  trending: TrendingUp,
};

const accentMap = {
  primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
  danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  info: "bg-[#eff6ff] text-[#3b82f6]",
  success: "bg-[var(--success-soft)] text-[var(--success)]",
};

interface StatCardProps {
  stat: DashboardStat;
  animationIndex?: number;
  compact?: boolean;
  chartRemountKey?: string;
}

export function StatCard({ stat, animationIndex = 0, compact, chartRemountKey }: StatCardProps) {
  const chartDelay = animationIndex * 100 + 180;
  const Icon = iconMap[stat.icon as keyof typeof iconMap] ?? BarChart3;
  const iconAccent = accentMap[stat.accent];
  const hasSideChart = stat.chart?.type === "ring";

  return (
    <article
      className={cn(
        "card-interactive page-enter flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]",
        compact ? "p-4" : "rounded-2xl p-5",
      )}
      style={{ animationDelay: `${animationIndex * 70}ms` }}
    >
      <div
        className={cn("flex items-start justify-between", compact ? "mb-2.5" : "mb-4")}
      >
        <div
          className={cn(
            "flex items-center justify-center rounded-xl",
            compact ? "h-9 w-9 rounded-lg" : "h-10 w-10",
            iconAccent,
          )}
        >
          <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} strokeWidth={1.75} />
        </div>
        {stat.trend && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-sm font-medium",
              stat.trendPositive ? "text-[var(--success)]" : "text-[var(--danger)]",
            )}
          >
            {stat.trend}
            <span>{stat.trendDirection === "up" ? "↑" : "↓"}</span>
          </span>
        )}
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col",
          hasSideChart && "sm:flex-row sm:items-end sm:justify-between sm:gap-3",
        )}
      >
        <div className="min-w-0">
          <p
            className={cn(
              "text-[var(--text-secondary)]",
              compact ? "mb-0.5 text-sm" : "mb-1 text-sm",
            )}
          >
            {stat.label}
          </p>
          <p className="flex items-baseline gap-1">
            <span
              className={cn(
                "font-semibold tracking-tight text-[var(--text-primary)]",
                compact ? "text-[1.75rem] leading-none" : "text-3xl",
              )}
            >
              {stat.value}
            </span>
            {stat.subValue && (
              <span
                className={cn(
                  "text-[var(--text-secondary)]",
                  compact ? "text-lg" : "text-lg",
                )}
              >
                {stat.subValue}
              </span>
            )}
          </p>
        </div>

        {hasSideChart && (
          <div className="mt-3 shrink-0 sm:mt-0">
            <StatCardInfographic
              key={chartRemountKey ?? stat.id}
              stat={stat}
              delay={chartDelay}
            />
          </div>
        )}
      </div>

      {stat.chart && !hasSideChart && (
        <div
          className={cn(
            "border-t border-[var(--border)]/60",
            compact ? "mt-2.5 pt-2.5" : "mt-4 pt-4",
          )}
        >
          <StatCardInfographic
            key={chartRemountKey ?? stat.id}
            stat={stat}
            delay={chartDelay}
          />
        </div>
      )}
    </article>
  );
}
