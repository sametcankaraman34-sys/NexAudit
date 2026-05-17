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
  projectCreated(projectName: string) {
    return toast({
      variant: "success",
      title: "Yeni proje oluşturuldu",
      description: `${projectName} başarıyla eklendi. Şimdi tarama başlatılabilir.`,
      action: { label: "Projeye git", href: "/projects" },
    });
  },
  auditCompleted(phaseLabel: string, score?: number) {
    return toast({
      variant: "success",
      title: "Denetim tamamlandı",
      description:
        score !== undefined
          ? `${phaseLabel} bitti · skor ${score}/100`
          : `${phaseLabel} analizi hazır.`,
      action: { label: "Sonuçları gör", href: "/website-audit" },
    });
  },
  criticalIssue(message: string) {
    return toast({
      variant: "critical",
      title: "Kritik sorun bulundu",
      description: message,
      duration: 7000,
      action: { label: "Denetimi aç", href: "/website-audit" },
    });
  },
  seoUnlocked() {
    return toast({
      variant: "info",
      title: "SEO aşaması açıldı",
      description: "Web Tasarım denetimi tamamlandı — SEO optimizasyonu kullanılabilir.",
      action: { label: "SEO'ya git", href: "/seo-audit" },
    });
  },
  briefScoreUpdated(score: number) {
    return toast({
      variant: "info",
      title: "Brief skoru güncellendi",
      description: `Brief uygunluk skoru ${score}/100 olarak hesaplandı.`,
      action: { label: "Karşılaştır", href: "/brief" },
    });
  },
  conversionIssue(message: string) {
    return toast({
      variant: "warning",
      title: "Dönüşüm sorunu tespit edildi",
      description: message,
      action: { label: "Reklam denetimi", href: "/ads-audit" },
    });
  },
  scanStarted(projectName?: string) {
    return toast({
      variant: "info",
      title: "Tarama başlatıldı",
      description: projectName
        ? `${projectName} için canlı denetim kuyruğa alındı.`
        : "Canlı denetim motoru çalışıyor.",
    });
  },
  auditStarted(
    phaseLabel: string,
    href?: string,
    projectName?: string,
  ) {
    return toast({
      variant: "info",
      title: "Denetim başladı",
      description: projectName
        ? `${projectName} · ${phaseLabel} kuyruğa alındı.`
        : `${phaseLabel} analizi başlatıldı.`,
      action: href ? { label: "İlerlemeyi gör", href } : undefined,
    });
  },
};
