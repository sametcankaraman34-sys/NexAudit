import { AiInsightsPanel } from "@/components/brief-compliance/ai-insights-panel";
import { BriefItemsEditor } from "@/components/brief-compliance/brief-items-editor";
import { BriefMultiScoreHero } from "@/components/brief-compliance/brief-multi-score-hero";
import { ComplianceAnalyticsPanel } from "@/components/brief-compliance/compliance-analytics-panel";
import { DeviationDetectionPanel } from "@/components/brief-compliance/deviation-detection-panel";
import { VisualComparisonGrid } from "@/components/brief-compliance/visual-comparison-grid";

export function BriefView() {
  return (
    <div className="audit-page space-y-6 lg:space-y-8">
      <BriefMultiScoreHero />
      <BriefItemsEditor />
      <VisualComparisonGrid />
      <DeviationDetectionPanel />
      <ComplianceAnalyticsPanel />
      <AiInsightsPanel />
    </div>
  );
}
