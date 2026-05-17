interface AnalysisSectionHeaderProps {
  title: string;
  description: string;
}

export function AnalysisSectionHeader({ title, description }: AnalysisSectionHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="text-ui-section-title font-semibold text-[var(--text-primary)]">{title}</h2>
      <p className="mt-1 text-ui-secondary text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}
