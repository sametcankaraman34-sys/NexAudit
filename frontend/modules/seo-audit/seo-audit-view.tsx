import { LockedState } from "@/components/feedback/locked-state";
import { PageHeader } from "@/components/layout/page-header";
import { getLockedMessage } from "@/lib/audit-lock";

export function SeoAuditView() {
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
