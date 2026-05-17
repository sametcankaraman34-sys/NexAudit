import { Activity } from "lucide-react";
import { AnalysisCategoryCard } from "@/components/audit/analysis-category-card";
import { AnalysisSectionHeader } from "@/components/audit/analysis-section-header";
import { IntelligenceGuidancePanel } from "@/components/audit/intelligence-guidance-panel";
import { IntelligenceHero } from "@/components/audit/intelligence-hero";
import { IntelligenceIssueQueue } from "@/components/audit/intelligence-issue-queue";
import { IntelligenceMetricGrid } from "@/components/audit/intelligence-metric-grid";
import { IntelligencePerformancePanel } from "@/components/audit/intelligence-performance-panel";
import {
  analysisCategories,
  websiteGuidanceItems,
  websiteIntelligenceIssues,
  websiteIntelligenceSummary,
  websiteMetricFindings,
  websitePerformanceFactors,
} from "@/data/mock-website-audit";

export function WebsiteAuditView() {
  return (
    <div className="audit-page space-y-6 lg:space-y-8">
      <IntelligenceHero summary={websiteIntelligenceSummary} icon={Activity} />

      <section className="audit-section" style={{ animationDelay: "90ms" }}>
        <AnalysisSectionHeader
          title="Analiz özeti"
          description="Altı denetim boyutunda derinlemesine metrikler ve optimizasyon potansiyeli"
        />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {analysisCategories.map((category, index) => (
            <li key={category.id} className="list-none">
              <AnalysisCategoryCard category={category} animationDelay={120 + index * 55} />
            </li>
          ))}
        </ul>
      </section>

      <IntelligenceIssueQueue issues={websiteIntelligenceIssues} animationDelay={200} />

      <IntelligenceMetricGrid
        title="Görsel analiz"
        subtitle="Derinlemesine yapısal ve görsel inceleme bulguları"
        findings={websiteMetricFindings}
        animationDelay={280}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <IntelligencePerformancePanel factors={websitePerformanceFactors} animationDelay={360} />
        <IntelligenceGuidancePanel items={websiteGuidanceItems} animationDelay={400} />
      </div>
    </div>
  );
}
