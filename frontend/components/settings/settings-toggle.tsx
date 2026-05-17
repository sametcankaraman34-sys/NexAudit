"use client";

import { cn } from "@/lib/utils";

interface SettingsToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function SettingsToggle({
  checked,
  onChange,
  label,
  disabled,
}: SettingsToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "settings-toggle relative h-6 w-11 shrink-0 rounded-full border transition-[background-color,border-color] duration-[var(--transition-fast)]",
        checked
          ? "border-[var(--primary)] bg-[var(--primary)]"
          : "border-[var(--border)] bg-[var(--surface-soft)]",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span
        className={cn(
          "settings-toggle-thumb absolute top-0.5 left-0.5 h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-[var(--transition-fast)]",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}
