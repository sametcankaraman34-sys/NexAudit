import { notify } from "@/services/notification-service";
import type { ToastInput } from "@/types/toast";

export { registerNotificationToast as registerToastPush } from "@/services/notification-service";

/** @deprecated Doğrudan toast yerine NotificationService veya notify kullanın */
export function toast(input: ToastInput): string | undefined {
  return notify({
    variant: input.variant,
    title: input.title,
    description: input.description,
    duration: input.duration,
    action: input.action,
  });
}

export const NexToast = {
  success(title: string, description?: string) {
    return notify({ variant: "success", title, description });
  },
  projectCreated(projectName: string) {
    return notify({
      variant: "success",
      title: "Yeni proje oluşturuldu ✨",
      description: `${projectName} eklendi — ilk taramayı başlatabilirsin.`,
      action: { label: "Panele git", href: "/" },
    });
  },
  auditCompleted(phaseLabel: string, score?: number) {
    return notify({
      variant: "success",
      title: "Tur tamam",
      description:
        score !== undefined
          ? `${phaseLabel} bitti · skor ${score}/100`
          : `${phaseLabel} analizi hazır — sonuçlara göz atabilirsin.`,
      action: { label: "Sonuçlara bak", href: "/website-audit" },
    });
  },
  criticalIssue(message: string) {
    return notify({
      variant: "critical",
      title: "Kritik bulgu",
      description: message,
      duration: 7000,
      category: "critical",
      action: { label: "Denetime git", href: "/website-audit" },
    });
  },
  seoUnlocked() {
    return notify({
      variant: "info",
      title: "SEO tarafı açıldı",
      description: "Web tasarım turu bitti — SEO analizine geçebiliriz.",
      category: "seo",
      action: { label: "SEO'ya geç", href: "/seo-audit" },
    });
  },
  briefScoreUpdated(score: number) {
    return notify({
      variant: "info",
      title: "Brief skoru güncellendi",
      description: `Brief uyumu ${score}/100 — sapmaları birlikte toparlayalım.`,
      category: "brief",
      action: { label: "Karşılaştır", href: "/brief" },
    });
  },
  conversionIssue(message: string) {
    return notify({
      variant: "warning",
      title: "Dönüşüm sinyali",
      description: message,
      action: { label: "Reklam turuna git", href: "/ads-audit" },
    });
  },
  scanStarted(projectName?: string) {
    return notify({
      variant: "info",
      title: "Tarama başladı",
      description: projectName
        ? `${projectName} için canlı denetim çalışıyor.`
        : "Canlı denetim motoru devrede.",
    });
  },
  auditStarted(phaseLabel: string, href?: string, projectName?: string) {
    return notify({
      variant: "info",
      title: "Denetim devrede",
      description: projectName
        ? `${projectName} · ${phaseLabel} turu başladı.`
        : `${phaseLabel} analizi başladı — ilerlemeyi buradan takip edebilirsin.`,
      action: href ? { label: "İlerlemeyi gör", href } : undefined,
    });
  },
};
