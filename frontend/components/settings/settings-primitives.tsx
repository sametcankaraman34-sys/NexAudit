import { cn } from "@/lib/utils";

export function SettingsSectionCard({
  title,
  description,
  children,
  className,
  danger,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  danger?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] lg:p-6",
        danger
          ? "border-[var(--danger)]/25 bg-gradient-to-b from-[var(--danger-soft)]/40 to-[var(--surface)]"
          : "border-[var(--border)]",
        className,
      )}
    >
      <header className="mb-4 border-b border-[var(--border)]/80 pb-4">
        <h3
          className={cn(
            "text-sm font-semibold",
            danger ? "text-[var(--danger)]" : "text-[var(--text-primary)]",
          )}
        >
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{description}</p>
        )}
      </header>
      {children}
    </section>
  );
}

export function SettingsRow({
  label,
  description,
  children,
  bordered,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  bordered?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between",
        bordered && "border-b border-[var(--border)]/80 last:border-0 last:pb-0",
      )}
    >
      <div className="min-w-0 flex-1 sm:max-w-[55%]">
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0 sm:pl-4">{children}</div>
    </div>
  );
}

export const settingsInputClass =
  "h-10 w-full min-w-[200px] rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text-primary)] transition-[border-color,box-shadow] duration-[var(--transition-fast)] placeholder:text-[var(--text-secondary)] hover:border-[var(--primary)]/30 focus:border-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[var(--primary-soft)] sm:max-w-xs";
