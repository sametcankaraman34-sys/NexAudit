"use client";

import { Megaphone } from "lucide-react";
import { IntelligenceGuidancePanel } from "@/components/audit/intelligence-guidance-panel";
import { IntelligenceHero } from "@/components/audit/intelligence-hero";
import { IntelligenceIssueQueue } from "@/components/audit/intelligence-issue-queue";
import { IntelligencePerformancePanel } from "@/components/audit/intelligence-performance-panel";
import { AnalyticsHealthPanel } from "@/components/ads-audit/analytics-health-panel";
import { LandingPageAnalysis } from "@/components/ads-audit/landing-page-analysis";
import { TrackingInfrastructureGrid } from "@/components/ads-audit/tracking-infrastructure-grid";
import { LockedState } from "@/components/feedback/locked-state";
import { PageHeader } from "@/components/layout/page-header";
import { getLockedScreenCopy, isPhaseLocked } from "@/lib/audit-lock";
import { AuditWorkflowPanel } from "@/components/workflow/audit-workflow-panel";
import { useActiveProject, useProjectWorkspace } from "@/lib/project-context";

export function AdsAuditView() {
  const { activeProject, activeProjectId } = useActiveProject();
  const { adsAudit } = useProjectWorkspace();

  if (isPhaseLocked("ads", activeProject.phases)) {
    const locked = getLockedScreenCopy("ads");
    return (
      <>
        <PageHeader
          title="Reklam & Dönüşüm"
          description="Huni, CTA ve reklam izleme — SEO oturunca burada devreye girer."
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
      <AuditWorkflowPanel projectId={activeProjectId} phaseId="ads" />

      <IntelligenceHero key={activeProjectId} summary={adsAudit.summary} icon={Megaphone} />

      <TrackingInfrastructureGrid cards={adsAudit.trackingCards} animationDelay={90} />

      <IntelligenceIssueQueue
        title="Dönüşüm öncelik kuyruğu"
        subtitle="Tracking ve landing bulguları — ROAS etkisine göre sıralı"
        issues={adsAudit.issues}
        animationDelay={180}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <LandingPageAnalysis insights={adsAudit.landingInsights} animationDelay={260} />
        <AnalyticsHealthPanel findings={adsAudit.metricFindings} animationDelay={300} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <IntelligencePerformancePanel
          title="Dönüşüm skor etkisi"
          subtitle="Ölçüm ve landing hızından kaynaklanan kayıplar"
          factors={adsAudit.performance}
          animationDelay={380}
        />
        <IntelligenceGuidancePanel
          title="Reklam düzeltme rehberi"
          subtitle="GTM, Google Ads ve consent yapılandırma adımları"
          items={adsAudit.guidance}
          animationDelay={420}
        />
      </div>
    </div>
  );
}
