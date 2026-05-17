import type { AuditPhaseId } from "@/types";

export const AUDIT_PHASE_ORDER: AuditPhaseId[] = ["website", "seo", "ads"];

export const AUDIT_PHASE_LABELS: Record<AuditPhaseId, string> = {
  website: "Web Tasarım Denetimi",
  seo: "SEO Optimizasyonu",
  ads: "Reklam & Dönüşüm",
};

export const AUDIT_PHASE_SHORT_LABELS: Record<AuditPhaseId, string> = {
  website: "Web Tasarım",
  seo: "SEO",
  ads: "Reklam",
};

export const SEVERITY_LABELS = {
  critical: "Kritik",
  high: "Yüksek",
  medium: "Orta",
  low: "Düşük",
  improvement: "İyileştirme",
} as const;

export const IMPACT_LABELS = {
  high: "Yüksek Etki",
  medium: "Orta Etki",
  low: "Düşük Etki",
} as const;
