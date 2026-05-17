"use client";

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
import { getLockedScreenCopy, isPhaseLocked } from "@/lib/audit-lock";
import { AuditWorkflowPanel } from "@/components/workflow/audit-workflow-panel";
import { useActiveProject, useProjectWorkspace } from "@/lib/project-context";

export function SeoAuditView() {
  const { activeProject, activeProjectId } = useActiveProject();
  const { seoAudit } = useProjectWorkspace();

  if (isPhaseLocked("seo", activeProject.phases)) {
    const locked = getLockedScreenCopy("seo");
    return (
      <>
        <PageHeader
          title="SEO Optimizasyonu"
          description="Teknik SEO, içerik ve anahtar kelime — web tarafı hazır olunca burada."
        />
        <LockedState
          title={locked.title}
          description={locked.description}
          unlockHint={locked.unlockHint}
          actionHref={locked.actionHref}
          actionLabel={locked.actionLabel}
        />
      </>
    );
  }

  return (
    <div className="audit-page space-y-6 lg:space-y-8">
      <AuditWorkflowPanel projectId={activeProjectId} phaseId="seo" />

      <IntelligenceHero key={activeProjectId} summary={seoAudit.summary} icon={Search} />

      <section className="audit-section" style={{ animationDelay: "90ms" }}>
        <AnalysisSectionHeader
          title="SEO analiz özeti"
          description="Sekiz denetim boyutunda teknik ve içerik metrikleri"
        />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {seoAudit.categories.map((category, index) => (
            <li key={`${activeProjectId}-${category.id}`} className="list-none">
              <AnalysisCategoryCard
                category={category}
                barChartKey={`${activeProjectId}-${category.barValues.join("-")}`}
                animationDelay={120 + index * 55}
              />
            </li>
          ))}
        </ul>
      </section>

      <IntelligenceIssueQueue
        title="SEO öncelik kuyruğu"
        subtitle="İndeksleme, meta ve schema bulguları — etkiye göre sıralı"
        issues={seoAudit.issues}
        animationDelay={200}
      />

      <KeywordAnalysisSection keywords={seoAudit.keywords} animationDelay={280} />

      <ContentQualityPanel findings={seoAudit.contentFindings} animationDelay={360} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <IntelligencePerformancePanel
          title="SEO skor etkisi"
          subtitle="Sıralama ve görünürlüğü düşüren faktörler"
          factors={seoAudit.performance}
          animationDelay={440}
        />
        <IntelligenceGuidancePanel
          title="SEO düzeltme rehberi"
          subtitle="Rank Math ve Yoast içinde adım adım düzeltme yolları"
          items={seoAudit.guidance}
          animationDelay={480}
        />
      </div>
    </div>
  );
}
