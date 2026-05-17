"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface PremiumSelectOption {
  value: string;
  label: string;
}

interface PremiumSelectProps {
  id?: string;
  label: string;
  hint?: string;
  placeholder?: string;
  options: readonly PremiumSelectOption[];
  value?: string;
  onValueChange?: (value: string | null) => void;
  className?: string;
}

export function PremiumSelect({
  id,
  label,
  hint,
  placeholder = "Seçin",
  options,
  value,
  onValueChange,
  className,
}: PremiumSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--text-primary)]">
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id={id}
          className={cn(
            "h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5",
            "text-sm text-[var(--text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
            "transition-[border-color,box-shadow,background-color] duration-[var(--transition-fast)]",
            "hover:border-[var(--primary)]/35 hover:bg-[var(--surface-soft)]",
            "focus-visible:border-[var(--primary)] focus-visible:ring-4 focus-visible:ring-[var(--primary-soft)]",
            "data-placeholder:text-[var(--text-secondary)]",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className={cn(
            "rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5",
            "shadow-[var(--shadow-card-hover)] ring-0",
          )}
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)]",
                "transition-colors duration-[var(--transition-fast)]",
                "hover:bg-[var(--surface-soft)] focus:bg-[var(--primary-soft)] focus:text-[var(--primary)]",
                "data-highlighted:bg-[var(--primary-soft)] data-highlighted:text-[var(--primary)]",
              )}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hint && <p className="text-xs text-[var(--text-secondary)]">{hint}</p>}
    </div>
  );
}
