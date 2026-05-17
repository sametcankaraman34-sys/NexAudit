import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  greeting?: string;
  compact?: boolean;
}

export function PageHeader({ title, description, greeting, compact }: PageHeaderProps) {
  return (
    <header className={cn(compact ? "mb-0" : "mb-8")}>
      {greeting && (
        <p
          className={cn(
            "font-semibold tracking-tight text-[var(--text-primary)]",
            compact ? "mb-0.5 text-2xl" : "mb-1 text-2xl",
          )}
        >
          {greeting}
        </p>
      )}
      {!greeting && (
        <h1
          className={cn(
            "font-semibold tracking-tight text-[var(--text-primary)]",
            compact ? "text-xl" : "text-2xl",
          )}
        >
          {title}
        </h1>
      )}
      {greeting && <h1 className="sr-only">{title}</h1>}
      {description && (
        <p
          className={cn(
            "text-[var(--text-secondary)]",
            compact ? "text-sm" : "mt-1 text-sm",
          )}
        >
          {description}
        </p>
      )}
    </header>
  );
}
