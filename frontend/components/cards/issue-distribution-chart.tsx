import { cn } from "@/lib/utils";
import type { IssueDistribution } from "@/types";

const SEGMENT_COLORS = [
  "var(--danger)",
  "#ea580c",
  "var(--warning)",
  "#94a3b8",
  "var(--success)",
];

const RADAR_PERIMETER = 520;

interface IssueDistributionChartProps {
  data: IssueDistribution[];
  compact?: boolean;
  stretch?: boolean;
  animationDelay?: number;
}

export function IssueDistributionChart({
  data,
  compact,
  stretch,
  animationDelay = 0,
}: IssueDistributionChartProps) {
  const size = stretch ? 220 : compact ? 140 : 200;
  const center = size / 2;
  const maxRadius = stretch ? 88 : compact ? 52 : 72;
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const angleStep = (2 * Math.PI) / data.length;
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const dataPoints = data.map((item, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (item.value / maxValue) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  });

  const gridBase = animationDelay + 120;
  const chartReveal = animationDelay + 200;
  const strokeDraw = animationDelay + 550;
  const fillIn = animationDelay + 900;
  const legendBase = animationDelay + 750;

  const radarSvg = (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={cn(
        "mx-auto w-full max-w-[240px]",
        stretch ? "h-[200px] min-h-[180px]" : compact ? "h-[110px] w-[110px]" : "h-[200px]",
      )}
      aria-hidden
    >
      <g
        className="radar-chart-mask"
        style={{
          transformOrigin: `${center}px ${center}px`,
          animationDelay: `${chartReveal}ms`,
        }}
      >
        {gridLevels.map((level, levelIndex) => {
          const gridPoints = data
            .map((_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const r = maxRadius * level;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            })
            .join(" ");
          return (
            <polygon
              key={level}
              points={gridPoints}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
              className="radar-grid-ring"
              style={{ animationDelay: `${gridBase + levelIndex * 70}ms` }}
            />
          );
        })}
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + maxRadius * Math.cos(angle)}
              y2={center + maxRadius * Math.sin(angle)}
              stroke="var(--border)"
              strokeWidth="1"
              className="radar-grid-line"
              style={{ animationDelay: `${gridBase + 280 + i * 45}ms` }}
            />
          );
        })}
        <polygon
          points={dataPoints.join(" ")}
          fill="var(--primary)"
          fillOpacity="0"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          className="radar-data-stroke"
          style={
            {
              "--radar-perimeter": RADAR_PERIMETER,
              animationDelay: `${strokeDraw}ms`,
            } as React.CSSProperties
          }
        />
        <polygon
          points={dataPoints.join(" ")}
          fill="var(--primary)"
          stroke="none"
          className="radar-data-fill-polygon"
          style={{ animationDelay: `${fillIn}ms` }}
        />
      </g>
    </svg>
  );

  const legend = (
    <ul className="flex w-full flex-col">
      {data.map((item, i) => (
        <li
          key={item.label}
          className={cn(
            "radar-legend-row flex items-center gap-3 border-b border-[var(--border)]/70 py-2.5 last:border-0",
            stretch ? "text-sm" : "text-xs",
          )}
          style={{ animationDelay: `${legendBase + i * 70}ms` }}
        >
          <span
            className={cn("shrink-0 rounded-full", stretch ? "h-2.5 w-2.5" : "h-2 w-2")}
            style={{ backgroundColor: SEGMENT_COLORS[i] }}
          />
          <span className="flex-1 font-medium text-[var(--text-secondary)]">{item.label}</span>
          <span
            className={cn(
              "min-w-[2ch] text-right font-semibold tabular-nums text-[var(--text-primary)]",
              stretch ? "text-base" : "text-sm",
            )}
          >
            {item.value}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section
      className={cn(
        "radar-card-enter rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]",
        stretch ? "flex flex-1 flex-col p-4" : compact ? "p-3.5" : "rounded-2xl p-5",
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <h2 className="mb-3 shrink-0 text-base font-semibold text-[var(--text-primary)]">
        Sorun Dağılımı
      </h2>

      {stretch ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-center py-1">{radarSvg}</div>
          <div className="mt-2 flex-1">{legend}</div>
          <p
            className="radar-legend-row mt-3 shrink-0 border-t border-[var(--border)] pt-3 text-center text-sm text-[var(--text-secondary)]"
            style={{ animationDelay: `${legendBase + data.length * 70 + 80}ms` }}
          >
            Toplam{" "}
            <span className="font-semibold text-[var(--text-primary)]">{total}</span> sorun
          </p>
        </div>
      ) : compact ? (
        <div className="flex flex-col gap-3">
          <div className="flex justify-center">{radarSvg}</div>
          {legend}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {radarSvg}
          <div className="w-full max-w-xs">{legend}</div>
        </div>
      )}

      {compact && !stretch && (
        <p
          className="radar-legend-row mt-3 border-t border-[var(--border)]/70 pt-3 text-center text-sm text-[var(--text-secondary)]"
          style={{ animationDelay: `${legendBase + data.length * 70 + 80}ms` }}
        >
          Toplam <span className="font-semibold text-[var(--text-primary)]">{total}</span> sorun
        </p>
      )}
    </section>
  );
}
