import { AnalysisCategoryCard } from "@/components/website-audit/analysis-category-card";
import { AuditHero } from "@/components/website-audit/audit-hero";
import { AuditIssueQueue } from "@/components/website-audit/audit-issue-queue";
import { FixGuidancePanel } from "@/components/website-audit/fix-guidance-panel";
import { PerformanceImpactPanel } from "@/components/website-audit/performance-impact-panel";
import { VisualAnalysisGrid } from "@/components/website-audit/visual-analysis-grid";
import {
  analysisCategories,
  fixGuidanceItems,
  performanceFactors,
  visualFindings,
  websiteAuditIssues,
} from "@/data/mock-website-audit";

export function WebsiteAuditView() {
  return (
    <div className="audit-page space-y-6 lg:space-y-8">
      <AuditHero />

      <section className="audit-section" style={{ animationDelay: "90ms" }}>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Analiz özeti</h2>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
            Altı denetim boyutunda derinlemesine metrikler ve optimizasyon potansiyeli
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {analysisCategories.map((category, index) => (
            <li key={category.id} className="list-none">
              <AnalysisCategoryCard category={category} animationDelay={120 + index * 55} />
            </li>
          ))}
        </ul>
      </section>

      <AuditIssueQueue issues={websiteAuditIssues} animationDelay={200} />

      <VisualAnalysisGrid findings={visualFindings} animationDelay={280} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PerformanceImpactPanel factors={performanceFactors} animationDelay={360} />
        <FixGuidancePanel items={fixGuidanceItems} animationDelay={400} />
      </div>
    </div>
  );
}
