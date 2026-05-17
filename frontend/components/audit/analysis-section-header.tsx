interface AnalysisSectionHeaderProps {
  title: string;
  description: string;
}

export function AnalysisSectionHeader({ title, description }: AnalysisSectionHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}
