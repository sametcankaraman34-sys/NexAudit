import { PageHeader } from "@/components/layout/page-header";
import { AuditTimelineSection } from "@/components/report-history/audit-timeline-section";
import { EvolutionComparisonSection } from "@/components/report-history/evolution-comparison-section";
import { HistoricalInsightsPanel } from "@/components/report-history/historical-insights-panel";
import { HistoryOverviewSection } from "@/components/report-history/history-overview-section";

export function ReportHistoryView() {
  return (
    <div className="audit-page space-y-6 lg:space-y-8">
      <PageHeader
        title="Rapor Geçmişi"
        description="Denetim evrimi, skor ilerlemesi ve optimizasyon arşivi."
      />
      <HistoryOverviewSection />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <AuditTimelineSection />
        <div className="space-y-6">
          <EvolutionComparisonSection />
          <HistoricalInsightsPanel />
        </div>
      </div>
    </div>
  );
}
