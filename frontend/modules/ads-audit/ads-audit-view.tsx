import { LockedState } from "@/components/feedback/locked-state";
import { PageHeader } from "@/components/layout/page-header";
import { getLockedMessage } from "@/lib/audit-lock";

export function AdsAuditView() {
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
        actionHref="/website-audit"
        actionLabel="Önceki Aşamalara Git"
      />
    </>
  );
}
