import type { AuditPhaseId, AuditPhaseStatus } from "@/types";

export const DEMO_AUDIT_PHASE_STATUS: Record<AuditPhaseId, AuditPhaseStatus> = {
  website: "completed",
  seo: "active",
  ads: "active",
};

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
