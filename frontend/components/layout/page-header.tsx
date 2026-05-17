import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  greeting?: string;
  compact?: boolean;
}

export function PageHeader({ title, description, greeting, compact }: PageHeaderProps) {
  return (
    <header className={cn(compact ? "mb-0" : "mb-6 lg:mb-8")}>
      {greeting && (
        <p
          className={cn(
            "font-semibold tracking-tight text-[var(--text-primary)]",
            compact ? "mb-0.5 text-ui-page-title" : "mb-1 text-ui-page-title",
          )}
        >
          {greeting}
        </p>
      )}
      {!greeting && (
        <h1
          className={cn(
            "font-semibold tracking-tight text-[var(--text-primary)]",
            compact ? "text-ui-section-title" : "text-ui-page-title",
          )}
        >
          {title}
        </h1>
      )}
      {greeting && <h1 className="sr-only">{title}</h1>}
      {description && (
        <p
          className={cn(
            "text-ui-secondary text-[var(--text-secondary)]",
            compact ? "mt-0.5" : "mt-1.5",
          )}
        >
          {description}
        </p>
      )}
    </header>
  );
}
