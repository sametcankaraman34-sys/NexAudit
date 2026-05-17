import { Search } from "lucide-react";
import { AnalysisCategoryCard } from "@/components/audit/analysis-category-card";
import { AnalysisSectionHeader } from "@/components/audit/analysis-section-header";
import { IntelligenceGuidancePanel } from "@/components/audit/intelligence-guidance-panel";
import { IntelligenceHero } from "@/components/audit/intelligence-hero";
import { IntelligenceIssueQueue } from "@/components/audit/intelligence-issue-queue";
import { IntelligencePerformancePanel } from "@/components/audit/intelligence-performance-panel";
import { LockedState } from "@/components/feedback/locked-state";
import { PageHeader } from "@/components/layout/page-header";
import { ContentQualityPanel } from "@/components/seo-audit/content-quality-panel";
import { KeywordAnalysisSection } from "@/components/seo-audit/keyword-analysis-section";
import {
  seoCategories,
  seoContentFindings,
  seoGuidance,
  seoIssues,
  seoKeywords,
  seoPerformanceFactors,
  seoSummary,
} from "@/data/mock-seo-audit";
import { isPhaseLocked, getLockedMessage } from "@/lib/audit-lock";

export function SeoAuditView() {
  if (isPhaseLocked("seo")) {
    return (
      <>
        <PageHeader
          title="SEO Optimizasyonu"
          description="Teknik SEO, içerik ve anahtar kelime analizi."
        />
        <LockedState
          title="SEO Optimizasyonu Kilitli"
          description={getLockedMessage("seo")}
          unlockHint="Web Tasarım Denetimi %100 tamamlandığında bu aşama açılacaktır."
          actionHref="/website-audit"
          actionLabel="Web Tasarım Denetimine Git"
        />
      </>
    );
  }

  return (
    <div className="audit-page space-y-6 lg:space-y-8">
      <IntelligenceHero summary={seoSummary} icon={Search} />

      <section className="audit-section" style={{ animationDelay: "90ms" }}>
        <AnalysisSectionHeader
          title="SEO analiz özeti"
          description="Sekiz denetim boyutunda teknik ve içerik metrikleri"
        />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {seoCategories.map((category, index) => (
            <li key={category.id} className="list-none">
              <AnalysisCategoryCard category={category} animationDelay={120 + index * 55} />
            </li>
          ))}
        </ul>
      </section>

      <IntelligenceIssueQueue
        title="SEO öncelik kuyruğu"
        subtitle="İndeksleme, meta ve schema bulguları — etkiye göre sıralı"
        issues={seoIssues}
        animationDelay={200}
      />

      <KeywordAnalysisSection keywords={seoKeywords} animationDelay={280} />

      <ContentQualityPanel findings={seoContentFindings} animationDelay={360} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <IntelligencePerformancePanel
          title="SEO skor etkisi"
          subtitle="Sıralama ve görünürlüğü düşüren faktörler"
          factors={seoPerformanceFactors}
          animationDelay={440}
        />
        <IntelligenceGuidancePanel
          title="SEO düzeltme rehberi"
          subtitle="Rank Math ve Yoast içinde adım adım düzeltme yolları"
          items={seoGuidance}
          animationDelay={480}
        />
      </div>
    </div>
  );
}
