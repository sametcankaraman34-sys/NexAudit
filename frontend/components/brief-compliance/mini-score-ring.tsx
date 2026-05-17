import { cn } from "@/lib/utils";

function scoreColor(score: number) {
  if (score >= 70) return "var(--success)";
  if (score >= 50) return "var(--warning)";
  return "var(--danger)";
}

interface MiniScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MiniScoreRing({ score, size = "md", className }: MiniScoreRingProps) {
  const radius = size === "lg" ? 44 : size === "md" ? 28 : 20;
  const stroke = size === "lg" ? 7 : size === "md" ? 5 : 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const dim = radius * 2 + (size === "lg" ? 16 : size === "md" ? 12 : 10);
  const center = dim / 2;
  const color = scoreColor(score);
  const scoreText =
    size === "lg" ? "text-2xl" : size === "md" ? "text-base" : "text-xs";
  const subText = size === "lg" ? "text-[13px]" : "text-[8px]";

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: dim, height: dim }}
    >
      <svg className="h-full w-full -rotate-90" viewBox={`0 0 ${dim} ${dim}`} aria-hidden>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--surface-soft)"
          strokeWidth={stroke}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
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
        <span className={cn("font-bold tabular-nums leading-none text-[var(--text-primary)]", scoreText)}>
          {score}
        </span>
        {size === "lg" && (
          <span className={cn("mt-0.5 font-medium text-[var(--text-secondary)]", subText)}>/ 100</span>
        )}
      </div>
    </div>
  );
}

export function ComplianceBar({
  value,
  className,
  delayMs = 0,
}: {
  value: number;
  className?: string;
  delayMs?: number;
}) {
  const color = scoreColor(value);
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-[var(--surface-soft)]", className)}>
      <div
        className="audit-bar-grow h-full rounded-full"
        style={{
          width: `${value}%`,
          backgroundColor: color,
          animationDelay: `${delayMs}ms`,
        }}
      />
    </div>
  );
}

export { scoreColor };
