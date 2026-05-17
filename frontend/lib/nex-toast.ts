import type { ToastInput } from "@/types/toast";

type PushFn = (input: ToastInput) => string;

let pushToast: PushFn | null = null;

export function registerToastPush(fn: PushFn) {
  pushToast = fn;
  return () => {
    if (pushToast === fn) pushToast = null;
  };
}

/** Imperative toast API — works outside React components */
export function toast(input: ToastInput): string | undefined {
  return pushToast?.(input);
}

export const NexToast = {
  success(title: string, description?: string) {
    return toast({ variant: "success", title, description });
  },
  projectCreated(projectName: string) {
    return toast({
      variant: "success",
      title: "Proje hazır",
      description: `${projectName} eklendi — ilk taramayı birlikte başlatabiliriz.`,
      action: { label: "Projeye git", href: "/projects" },
    });
  },
  auditCompleted(phaseLabel: string, score?: number) {
    return toast({
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
    return toast({
      variant: "critical",
      title: "Kritik bulgu",
      description: message,
      duration: 7000,
      action: { label: "Denetime git", href: "/website-audit" },
    });
  },
  seoUnlocked() {
    return toast({
      variant: "info",
      title: "SEO tarafı açıldı",
      description: "Web tasarım turu bitti — SEO analizine geçebiliriz.",
      action: { label: "SEO'ya geç", href: "/seo-audit" },
    });
  },
  briefScoreUpdated(score: number) {
    return toast({
      variant: "info",
      title: "Brief skoru güncellendi",
      description: `Brief uyumu ${score}/100 — sapmaları birlikte toparlayalım.`,
      action: { label: "Karşılaştır", href: "/brief" },
    });
  },
  conversionIssue(message: string) {
    return toast({
      variant: "warning",
      title: "Dönüşüm sinyali",
      description: message,
      action: { label: "Reklam turuna git", href: "/ads-audit" },
    });
  },
  scanStarted(projectName?: string) {
    return toast({
      variant: "info",
      title: "Tarama başladı",
      description: projectName
        ? `${projectName} için canlı denetim çalışıyor.`
        : "Canlı denetim motoru devrede.",
    });
  },
  auditStarted(
    phaseLabel: string,
    href?: string,
    projectName?: string,
  ) {
    return toast({
      variant: "info",
      title: "Denetim devrede",
      description: projectName
        ? `${projectName} · ${phaseLabel} turu başladı.`
        : `${phaseLabel} analizi başladı — ilerlemeyi buradan takip edebilirsin.`,
      action: href ? { label: "İlerlemeyi gör", href } : undefined,
    });
  },
};
