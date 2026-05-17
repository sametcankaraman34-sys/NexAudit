import type { DashboardStat } from "@/types";

const STACKED_COLORS = [
  "var(--danger)",
  "#ea580c",
  "var(--warning)",
  "#94a3b8",
  "var(--success)",
];

const SPARK_PATH_LENGTH = 140;

interface StatCardInfographicProps {
  stat: DashboardStat;
  delay?: number;
}

export function StatCardInfographic({ stat, delay = 0 }: StatCardInfographicProps) {
  if (!stat.chart) return null;

  const wrap = (node: React.ReactNode) => (
    <div className="stat-chart-reveal" style={{ animationDelay: `${delay}ms` }}>
      {node}
    </div>
  );

  switch (stat.chart.type) {
    case "sparkline":
      return wrap(
        <SparklineChart
          values={stat.chart.values}
          color="var(--primary)"
          id={stat.id}
          delay={delay}
        />,
      );
    case "ring":
      return wrap(
        <RingChart
          value={stat.chart.values[0] ?? 0}
          max={stat.chart.max ?? 100}
          color="var(--danger)"
          delay={delay}
        />,
      );
    case "stacked":
      return wrap(<StackedBarChart values={stat.chart.values} delay={delay} />);
    case "bars":
      return wrap(
        <VerticalBarChart
          values={stat.chart.values}
          color="var(--success)"
          id={stat.id}
          delay={delay}
        />,
      );
    default:
      return null;
  }
}

function SparklineChart({
  values,
  color,
  id,
  delay,
}: {
  values: number[];
  color: string;
  id: string;
  delay: number;
}) {
  const width = 120;
  const height = 36;
  const padding = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1 || 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `${points[0]?.x ?? 0},${height} ${linePoints} ${points[points.length - 1]?.x ?? 0},${height}`;
  const gradientId = `spark-${id}`;
  const last = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-9 w-full" aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#${gradientId})`}
        className="stat-spark-area"
        style={{ animationDelay: `${delay + 400}ms` }}
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={linePoints}
        className="stat-spark-line"
        style={
          {
            "--spark-length": SPARK_PATH_LENGTH,
            animationDelay: `${delay + 80}ms`,
          } as React.CSSProperties
        }
      />
      {last && (
        <circle
          cx={last.x}
          cy={last.y}
          r={3}
          fill={color}
          className="stat-spark-dot"
          style={{ animationDelay: `${delay + 750}ms` }}
        />
      )}
    </svg>
  );
}

function RingChart({
  value,
  max,
  color,
  delay,
}: {
  value: number;
  max: number;
  color: string;
  delay: number;
}) {
  const size = 44;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(value / max, 1);
  const offset = circumference * (1 - ratio);

  return (
    <div className="flex items-center justify-end gap-3">
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#eef0f4"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          className="stat-ring-progress"
          style={
            {
              "--ring-circ": circumference,
              "--ring-end": offset,
              animationDelay: `${delay + 120}ms`,
            } as React.CSSProperties
          }
        />
      </svg>
      <div
        className="stat-chart-label text-right"
        style={{ animationDelay: `${delay + 500}ms` }}
      >
        <p className="text-xs leading-tight text-[var(--text-secondary)]">Toplam içinde</p>
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          %{Math.round(ratio * 100)}
        </p>
      </div>
    </div>
  );
}

function StackedBarChart({ values, delay }: { values: number[]; delay: number }) {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const labels = ["Kritik", "Yüksek", "Orta", "Düşük", "İyileştirme"];

  return (
    <div className="space-y-2">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#eef0f4]">
        {values.map((v, i) => (
          <div
            key={labels[i]}
            className="stat-stack-segment h-full first:rounded-l-full last:rounded-r-full"
            style={
              {
                "--seg-width": `${(v / total) * 100}%`,
                backgroundColor: STACKED_COLORS[i],
                animationDelay: `${delay + 150 + i * 70}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div
        className="stat-chart-label grid grid-cols-5 gap-0.5"
        style={{ animationDelay: `${delay + 550}ms` }}
      >
        {labels.map((label, i) => (
          <div key={label} className="text-center">
            <p className="text-xs font-medium text-[var(--text-primary)]">{values[i]}</p>
            <p className="truncate text-[11px] text-[var(--text-secondary)]">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function VerticalBarChart({
  values,
  color,
  id,
  delay,
}: {
  values: number[];
  color: string;
  id: string;
  delay: number;
}) {
  const max = Math.max(...values, 1);
  const barWidth = 14;
  const gap = 6;
  const height = 36;
  const totalWidth = values.length * barWidth + (values.length - 1) * gap;
  const gradientId = `bars-${id}`;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${height}`}
      className="ml-auto h-9 w-full max-w-[120px]"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {values.map((v, i) => {
        const barHeight = (v / max) * (height - 4);
        const x = i * (barWidth + gap);
        const y = height - barHeight;
        const originX = x + barWidth / 2;
        return (
          <g
            key={i}
            className="stat-vbar"
            style={{
              transformOrigin: `${originX}px ${height}px`,
              animationDelay: `${delay + 120 + i * 75}ms`,
            }}
          >
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={3}
              fill={`url(#${gradientId})`}
              opacity={0.45 + (i / values.length) * 0.55}
            />
          </g>
        );
      })}
    </svg>
  );
}
