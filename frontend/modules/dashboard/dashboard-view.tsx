import { AuditFinalCard, AuditPhaseCard } from "@/components/cards/audit-phase-card";
import { BriefScoreCard } from "@/components/cards/brief-score-card";
import { IssueDistributionChart } from "@/components/cards/issue-distribution-chart";
import { RecommendationCard } from "@/components/cards/recommendation-card";
import { StatCard } from "@/components/cards/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { IssueList } from "@/components/tables/issue-list";
import { DEMO_USER } from "@/constants/navigation";
import {
  mockAuditPhases,
  mockDashboardStats,
  mockIssueDistribution,
  mockRecommendations,
} from "@/data/mock-audit";
import { mockFeaturedIssues } from "@/data/mock-issues";

export function DashboardView() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        greeting={`Merhaba, ${DEMO_USER.name}! 👋`}
        description="Sitelerini analiz et ve iyileştirme fırsatlarını yakala."
        compact
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {mockDashboardStats.map((stat, index) => (
          <StatCard key={stat.id} stat={stat} animationIndex={index} compact />
        ))}
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-stretch">
        <div className="flex min-w-0 flex-[1.65] flex-col gap-3">
          <section>
            <h2 className="mb-2.5 text-base font-semibold text-[var(--text-primary)]">
              Denetim Aşamaları
            </h2>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {mockAuditPhases.map((phase, index) => (
                <AuditPhaseCard
                  key={phase.id}
                  phase={phase}
                  showConnector={index > 0}
                  compact
                />
              ))}
              <AuditFinalCard compact />
            </div>
          </section>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <IssueList issues={mockFeaturedIssues} compact />
            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
              <h2 className="mb-2.5 text-base font-semibold text-[var(--text-primary)]">
                Önerilen İyileştirmeler
              </h2>
              <div className="space-y-2">
                {mockRecommendations.map((item, index) => (
                  <RecommendationCard
                    key={item.id}
                    item={item}
                    compact
                    animationDelay={index * 60 + 200}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>

        <aside className="flex min-w-0 flex-1 flex-col gap-3 xl:max-w-[340px]">
          <BriefScoreCard compact />
          <IssueDistributionChart
            data={mockIssueDistribution}
            stretch
            animationDelay={120}
          />
        </aside>
      </div>
    </div>
  );
}
