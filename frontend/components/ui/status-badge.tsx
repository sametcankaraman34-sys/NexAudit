import { cn } from "@/lib/utils";

type StatusVariant = "detected" | "in_progress" | "resolved" | "ignored" | "good" | "locked";

const variants: Record<StatusVariant, string> = {
  detected: "bg-[var(--surface-soft)] text-[var(--text-secondary)]",
  in_progress: "bg-[var(--primary-soft)] text-[var(--primary)]",
  resolved: "bg-[var(--success-soft)] text-[var(--success)]",
  ignored: "bg-[var(--surface-soft)] text-[var(--text-secondary)]",
  good: "bg-[var(--success-soft)] text-[var(--success)]",
  locked: "bg-[var(--surface-soft)] text-[var(--text-secondary)]",
};

const labels: Record<StatusVariant, string> = {
  detected: "Tespit Edildi",
  in_progress: "Devam Ediyor",
  resolved: "Çözüldü",
  ignored: "Yok Sayıldı",
  good: "İyi",
  locked: "Sırada",
};

interface StatusBadgeProps {
  variant: StatusVariant;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ variant, label, className, size = "md" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-[13px]" : "px-2.5 py-0.5 text-ui-secondary",
        variants[variant],
        className,
      )}
    >
      {label ?? labels[variant]}
    </span>
  );
}
