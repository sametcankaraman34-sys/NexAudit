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
import {
  adsGuidance,
  adsIssues,
  adsMetricFindings,
  adsPerformanceFactors,
  adsSummary,
  landingInsights,
  trackingCards,
} from "@/data/mock-ads-audit";
import { isPhaseLocked, getLockedMessage } from "@/lib/audit-lock";

export function AdsAuditView() {
  if (isPhaseLocked("ads")) {
    return (
      <>
        <PageHeader
          title="Reklam & Dönüşüm"
          description="Dönüşüm hunisi ve reklam performansı analizi."
        />
        <LockedState
          title="Reklam & Dönüşüm Kilitli"
          description={getLockedMessage("ads")}
          unlockHint="SEO Optimizasyonu tamamlandığında bu aşama açılacaktır."
          actionHref="/seo-audit"
          actionLabel="SEO Denetimine Git"
        />
      </>
    );
  }

  return (
    <div className="audit-page space-y-6 lg:space-y-8">
      <IntelligenceHero summary={adsSummary} icon={Megaphone} />

      <TrackingInfrastructureGrid cards={trackingCards} animationDelay={90} />

      <IntelligenceIssueQueue
        title="Dönüşüm öncelik kuyruğu"
        subtitle="Tracking ve landing bulguları — ROAS etkisine göre sıralı"
        issues={adsIssues}
        animationDelay={180}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <LandingPageAnalysis insights={landingInsights} animationDelay={260} />
        <AnalyticsHealthPanel findings={adsMetricFindings} animationDelay={300} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <IntelligencePerformancePanel
          title="Dönüşüm skor etkisi"
          subtitle="Ölçüm ve landing hızından kaynaklanan kayıplar"
          factors={adsPerformanceFactors}
          animationDelay={380}
        />
        <IntelligenceGuidancePanel
          title="Reklam düzeltme rehberi"
          subtitle="GTM, Google Ads ve consent yapılandırma adımları"
          items={adsGuidance}
          animationDelay={420}
        />
      </div>
    </div>
  );
}
