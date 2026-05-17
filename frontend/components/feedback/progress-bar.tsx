import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  barClassName?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  className,
  barClassName,
  animated = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-[#eef0f4]", className)}>
      <div
        className={cn(
          "h-full rounded-full bg-[var(--primary)]",
          animated && "progress-animate",
          barClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
