import { AUDIT_PHASE_SHORT_LABELS } from "@/constants/audit";
import type { AuditPhase, AuditPhaseId } from "@/types";

export const PHASE_ROUTES: Record<AuditPhaseId, string> = {
  website: "/website-audit",
  seo: "/seo-audit",
  ads: "/ads-audit",
};

const NEXT_PHASE: Record<AuditPhaseId, AuditPhaseId | null> = {
  website: "seo",
  seo: "ads",
  ads: null,
};

const PREV_PHASE: Record<AuditPhaseId, AuditPhaseId | null> = {
  website: null,
  seo: "website",
  ads: "seo",
};

export interface PhaseCardCopy {
  description: string;
  progressLabel: string;
  statusLine?: string;
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: "primary" | "outline" | "success";
  ctaDisabled?: boolean;
}

export interface LockedScreenCopy {
  title: string;
  description: string;
  unlockHint: string;
  actionLabel: string;
  actionHref: string;
}

function phaseById(phases: AuditPhase[], id: AuditPhaseId): AuditPhase | undefined {
  return phases.find((p) => p.id === id);
}

function progressTone(progress: number): string {
  if (progress >= 100) return "Tamam";
  if (progress >= 70) return "Bitişe yakın";
  if (progress >= 35) return "İyi gidiyor";
  if (progress > 0) return "Başladık";
  return "Hazır";
}

export function getPhaseDescription(phase: AuditPhase): string {
  if (phase.status === "completed") {
    switch (phase.id) {
      case "website":
        return "Tasarım, UX ve performans tarafı netleşti.";
      case "seo":
        return "Teknik SEO ve içerik tarafı güçlendi.";
      case "ads":
        return "Dönüşüm ve reklam izleme tarafı toparlandı.";
    }
  }
  if (phase.status === "locked") {
    switch (phase.id) {
      case "seo":
        return "Web tasarımı bitirince SEO analizi burada açılır.";
      case "ads":
        return "SEO tarafını toparlayınca dönüşüm modülü devreye girer.";
      default:
        return "Önceki adım tamamlanınca burası açılır.";
    }
  }
  switch (phase.id) {
    case "website":
      return "Arayüz, erişilebilirlik ve sayfa performansına bakıyoruz.";
    case "seo":
      return "Teknik SEO, içerik ve anahtar kelime tarafını güçlendiriyoruz.";
    case "ads":
      return "Huni, CTA ve reklam izleme tarafına odaklanıyoruz.";
  }
}

export function getPhaseCardCopy(phase: AuditPhase, allPhases: AuditPhase[]): PhaseCardCopy {
  const prev = PREV_PHASE[phase.id];
  const next = NEXT_PHASE[phase.id];
  const prevPhase = prev ? phaseById(allPhases, prev) : undefined;
  const nextPhase = next ? phaseById(allPhases, next) : undefined;
  const progressLabel = progressTone(phase.progress);

  if (phase.status === "completed") {
    const statusLines: Record<AuditPhaseId, string> = {
      website: "Web tasarım tamamlandı — SEO tarafına geçebiliriz",
      seo: "SEO puanı güzel görünüyor — dönüşüm tarafına bakalım",
      ads: "Üç modül tamam — genel resmi birlikte toparlayalım",
    };
    if (next && nextPhase) {
      return {
        description: getPhaseDescription(phase),
        progressLabel: "Tamam",
        statusLine: statusLines[phase.id],
        ctaLabel:
          phase.id === "website"
            ? "SEO tarafına geç"
            : phase.id === "seo"
              ? "Reklam optimizasyonuna geç"
              : "Tüm sistemi gözden geçir",
        ctaHref: phase.id === "ads" ? "/" : PHASE_ROUTES[next],
        ctaVariant: phase.id === "ads" ? "success" : "success",
      };
    }
    return {
      description: getPhaseDescription(phase),
      progressLabel: "Tamam",
      statusLine: statusLines[phase.id],
      ctaLabel: "Sonuçlara bak",
      ctaHref: PHASE_ROUTES[phase.id],
      ctaVariant: "outline",
    };
  }

  if (phase.status === "locked") {
    const unlockHref = prev ? PHASE_ROUTES[prev] : PHASE_ROUTES.website;
    const statusLines: Record<AuditPhaseId, string> = {
      website: "",
      seo:
        prevPhase?.status === "completed"
          ? "Kritik sorunlar kapatıldı — SEO analizi hazır olacak"
          : "Önce web tarafını netleştirelim",
      ads:
        prevPhase?.status === "completed"
          ? "SEO tarafı hazır olunca dönüşüm modülü açılır"
          : "Önce SEO tarafını toparlayalım",
    };
    const ctaLabels: Record<AuditPhaseId, string> = {
      website: "Henüz kapalı",
      seo: "Önce kritik sorunları kapatalım",
      ads: "Önce SEO'yu toparlayalım",
    };
    return {
      description: getPhaseDescription(phase),
      progressLabel: "Sırada",
      statusLine: statusLines[phase.id],
      ctaLabel: ctaLabels[phase.id],
      ctaHref: unlockHref,
      ctaVariant: "outline",
      ctaDisabled: phase.id === "website",
    };
  }

  const activeStatus: Record<AuditPhaseId, string | undefined> = {
    website:
      phase.progress >= 70
        ? "Mobil tarafta işler iyi gidiyor — performans turuna hazırız"
        : undefined,
    seo: phase.progress >= 40 ? "SEO tarafında ivme var" : undefined,
    ads: phase.progress >= 30 ? "Dönüşüm sinyalleri netleşiyor" : undefined,
  };

  const ctaLabels: Record<AuditPhaseId, string> = {
    website: phase.progress > 0 ? "Denetimi sürdür" : "Taramaya başla",
    seo: phase.progress > 0 ? "SEO'da ilerle" : "SEO taramasına başla",
    ads: phase.progress > 0 ? "Dönüşüm tarafına bak" : "Reklam turuna başla",
  };

  return {
    description: getPhaseDescription(phase),
    progressLabel,
    statusLine: activeStatus[phase.id],
    ctaLabel: ctaLabels[phase.id],
    ctaHref: PHASE_ROUTES[phase.id],
    ctaVariant: "primary",
  };
}

export function getLockedScreenCopy(phaseId: AuditPhaseId): LockedScreenCopy {
  if (phaseId === "seo") {
    return {
      title: "SEO tarafı henüz hazır değil",
      description:
        "Web tasarım denetimini bitirdiğinde burada teknik SEO ve içerik analizi seni bekliyor.",
      unlockHint: "Kritik sorunları kapattığında bu modül açılır ✨",
      actionLabel: "Web denetimine dön",
      actionHref: PHASE_ROUTES.website,
    };
  }
  if (phaseId === "ads") {
    return {
      title: "Dönüşüm modülü sırada",
      description:
        "SEO tarafı oturduğunda reklam, CTA ve huni analizi burada devreye girer.",
      unlockHint: "SEO tamamlanınca reklam optimizasyonuna geçeriz 🚀",
      actionLabel: "SEO tarafına git",
      actionHref: PHASE_ROUTES.seo,
    };
  }
  return {
    title: "Bu modül henüz kapalı",
    description: "Önceki adımı tamamladığında burası otomatik açılır.",
    unlockHint: "Sıradaki doğru adımı dashboard'dan takip edebilirsin.",
    actionLabel: "Dashboard'a dön",
    actionHref: "/",
  };
}

export function getLockedMessage(phaseId: AuditPhaseId): string {
  return getLockedScreenCopy(phaseId).description;
}

export function getAuditFinalMessage(phases: AuditPhase[]): string {
  const allDone = phases.every((p) => p.status === "completed");
  if (allDone) {
    return "Harika — üç modül de tamam. Rapor ve genel skora göz atabilirsin ✨";
  }
  const active = phases.find((p) => p.status === "active");
  if (active) {
    return `${AUDIT_PHASE_SHORT_LABELS[active.id]} tarafında ilerliyoruz — sıradaki adımı kartlardan takip et.`;
  }
  return "Üç modülü tamamlayınca sitenin tam resmi netleşir.";
}
