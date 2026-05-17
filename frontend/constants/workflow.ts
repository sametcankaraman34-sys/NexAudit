import type { AuditPhaseId } from "@/types";
import type { AuditRoleId, ScanStatus } from "@/types/workflow";

export const SCAN_STATUS_LABELS: Record<ScanStatus, string> = {
  idle: "Hazır",
  scanning: "Taranıyor",
  analyzing: "Analiz ediliyor",
  completed: "Tamamlandı",
  error: "Hata oluştu",
};

export const SCAN_STATUS_VARIANT: Record<
  ScanStatus,
  "detected" | "in_progress" | "good" | "locked"
> = {
  idle: "detected",
  scanning: "in_progress",
  analyzing: "in_progress",
  completed: "good",
  error: "locked",
};

export const PHASE_SCAN_LABELS: Record<AuditPhaseId, string> = {
  website: "Web Sitesini Tara",
  seo: "SEO Analizini Başlat",
  ads: "Reklam Denetimini Tara",
};

export const PHASE_ROLE_MAP: Record<AuditPhaseId, AuditRoleId> = {
  website: "web_design",
  seo: "seo",
  ads: "ads",
};

export const ROLE_LABELS: Record<AuditRoleId, string> = {
  web_design: "Web Tasarım Uzmanı",
  seo: "SEO Uzmanı",
  ads: "Reklam Uzmanı",
  owner: "Proje Sahibi",
};

export const UNLOCK_NOTIFY_ROLE: Record<AuditPhaseId, AuditRoleId | null> = {
  website: null,
  seo: "seo",
  ads: "ads",
};

export const SCAN_STEPS: Record<AuditPhaseId, string[]> = {
  website: [
    "Sayfa yapısı taranıyor…",
    "Görseller analiz ediliyor…",
    "Mobil uyumluluk kontrol ediliyor…",
    "Erişilebilirlik kuralları test ediliyor…",
    "Performans metrikleri toplanıyor…",
    "CTA alanları inceleniyor…",
  ],
  seo: [
    "Meta etiketler taranıyor…",
    "SEO başlıkları kontrol ediliyor…",
    "İçerik kalitesi analiz ediliyor…",
    "Anahtar kelime yoğunluğu hesaplanıyor…",
    "Schema işaretlemeleri doğrulanıyor…",
    "İndeksleme sinyalleri toplanıyor…",
  ],
  ads: [
    "Dönüşüm hunisi haritalanıyor…",
    "Landing sayfası taranıyor…",
    "CTA görünürlüğü ölçülüyor…",
    "Form alanları inceleniyor…",
    "İzleme kodları kontrol ediliyor…",
    "Reklam etiketleri doğrulanıyor…",
  ],
};
