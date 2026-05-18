import { Image, Search, Smartphone, Zap } from "lucide-react";
import Link from "next/link";
import { IMPACT_LABELS } from "@/constants/audit";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/types";

const iconMap = {
  image: Image,
  zap: Zap,
  search: Search,
  smartphone: Smartphone,
};

const impactStyles = {
  high: "bg-[var(--success-soft)] text-[var(--success)]",
  medium: "bg-[var(--warning-soft)] text-[var(--warning)]",
  low: "bg-[var(--surface-soft)] text-[var(--text-secondary)]",
};

interface RecommendationCardProps {
  item: Recommendation;
  compact?: boolean;
  animationDelay?: number;
}

export function RecommendationCard({
  item,
  compact,
  animationDelay = 0,
}: RecommendationCardProps) {
  const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Zap;

  return (
    <Link
      href="/website-audit"
      className={cn(
        "card-interactive radar-legend-item flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)]/40",
        compact ? "p-3" : "gap-4 rounded-xl bg-[var(--surface)] p-4",
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]",
          compact ? "h-9 w-9" : "h-10 w-10 rounded-xl",
        )}
      >
        <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <h4 className="text-sm font-medium text-[var(--text-primary)]">{item.title}</h4>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              impactStyles[item.impact],
            )}
          >
            {IMPACT_LABELS[item.impact]}
          </span>
        </div>
        <p
          className={cn(
            "text-[var(--text-secondary)]",
            "text-ui-secondary leading-relaxed",
          )}
        >
          {item.description}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <span
          className={cn(
            "font-semibold text-[var(--success)]",
            compact ? "text-sm" : "text-sm",
          )}
        >
          +{item.scoreGain}
        </span>
        <p className="text-xs text-[var(--text-secondary)]">puan</p>
      </div>
    </Link>
  );
}
