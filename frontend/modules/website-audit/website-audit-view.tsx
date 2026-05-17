"use client";

import { Activity } from "lucide-react";
import { AnalysisCategoryCard } from "@/components/audit/analysis-category-card";
import { AnalysisSectionHeader } from "@/components/audit/analysis-section-header";
import { IntelligenceGuidancePanel } from "@/components/audit/intelligence-guidance-panel";
import { IntelligenceHero } from "@/components/audit/intelligence-hero";
import { IntelligenceIssueQueue } from "@/components/audit/intelligence-issue-queue";
import { IntelligenceMetricGrid } from "@/components/audit/intelligence-metric-grid";
import { IntelligencePerformancePanel } from "@/components/audit/intelligence-performance-panel";
import { useProjectWorkspace } from "@/lib/project-context";

export function WebsiteAuditView() {
  const { websiteAudit } = useProjectWorkspace();

  return (
    <div className="audit-page space-y-6 lg:space-y-8">
      <IntelligenceHero summary={websiteAudit.intelligenceSummary} icon={Activity} />

      <section className="audit-section" style={{ animationDelay: "90ms" }}>
        <AnalysisSectionHeader
          title="Analiz özeti"
          description="Altı denetim boyutunda derinlemesine metrikler ve optimizasyon potansiyeli"
        />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {websiteAudit.categories.map((category, index) => (
            <li key={category.id} className="list-none">
              <AnalysisCategoryCard category={category} animationDelay={120 + index * 55} />
            </li>
          ))}
        </ul>
      </section>

      <IntelligenceIssueQueue issues={websiteAudit.issues} animationDelay={200} />

      <IntelligenceMetricGrid
        title="Görsel analiz"
        subtitle="UI bileşenleri, layout ve marka tutarlılığı"
        findings={websiteAudit.metrics}
        animationDelay={280}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <IntelligencePerformancePanel
          title="Performans etkisi"
          subtitle="Core Web Vitals ve render yükü"
          factors={websiteAudit.performance}
          animationDelay={360}
        />
        <IntelligenceGuidancePanel
          title="Düzeltme rehberi"
          subtitle="Öncelikli aksiyonlar ve editör ipuçları"
          items={websiteAudit.guidance}
          animationDelay={400}
        />
      </div>
    </div>
  );
}
