import { AUDIT_PHASE_LABELS } from "@/constants/audit";
import { PHASE_ROUTES } from "@/lib/phase-copy";
import type { AuditPhaseId } from "@/types";
import type { OutcomeEvent } from "@/types/outcome-feedback";

export interface OutcomePresentation {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  tone: "success" | "neutral" | "remove";
}

const STAGE_COMPLETE_COPY: Record<
  AuditPhaseId,
  { title: string; description: string; nextHref: string; nextLabel: string }
> = {
  website: {
    title: "Web Tasarım tamamlandı ✨",
    description: "SEO tarafına geçebiliriz.",
    nextHref: PHASE_ROUTES.seo,
    nextLabel: "SEO'ya geç",
  },
  seo: {
    title: "SEO tamamlandı 🚀",
    description: "Şimdi dönüşüm tarafına bakalım.",
    nextHref: PHASE_ROUTES.ads,
    nextLabel: "Reklam turuna geç",
  },
  ads: {
    title: "Reklam & Dönüşüm tamamlandı 🎯",
    description: "Proje final kontrolüne hazır.",
    nextHref: "/",
    nextLabel: "Dashboard'a dön",
  },
};

const STAGE_UNLOCKED_COPY: Record<AuditPhaseId, { title: string; description: string }> = {
  website: {
    title: "Web turu hazır",
    description: "İlk taramayı başlatabilirsin.",
  },
  seo: {
    title: "SEO tarafı açıldı ✨",
    description: "Web tasarım turu bitti — SEO analizine geçebiliriz.",
  },
  ads: {
    title: "Dönüşüm modülü açıldı 🚀",
    description: "SEO oturdu — reklam ve huni tarafına bakalım.",
  },
};

export function getOutcomePresentation(event: OutcomeEvent): OutcomePresentation {
  switch (event.type) {
    case "project.completed":
      return {
        tone: "success",
        title: "Proje tamamlandı 🎉",
        description:
          "İyi iş — tüm denetim aşamaları bitti. Site teslim için çok daha güçlü görünüyor.",
        actionLabel: "Dashboard'a dön",
        actionHref: "/",
      };
    case "project.cancelled":
      return {
        tone: "neutral",
        title: "Proje iptal edildi",
        description:
          "Canın sağ olsun — bu proje arşive kaldırıldı. İstersen yeni bir denetime başlayabilirsin.",
        actionLabel: "Projelere git",
        actionHref: "/projects",
      };
    case "project.deleted":
      return {
        tone: "remove",
        title: "Proje silindi",
        description: "Bu proje artık listede görünmeyecek.",
        actionLabel: "Projelere git",
        actionHref: "/projects",
      };
    case "stage.completed": {
      const copy = STAGE_COMPLETE_COPY[event.stageId];
      return {
        tone: "success",
        title: copy.title,
        description: copy.description,
        actionLabel: copy.nextLabel,
        actionHref: copy.nextHref,
      };
    }
    case "stage.unlocked": {
      const copy = STAGE_UNLOCKED_COPY[event.stageId];
      return {
        tone: "success",
        title: copy.title,
        description: `${event.projectName} · ${copy.description}`,
        actionLabel:
          event.stageId === "seo"
            ? "SEO'ya geç"
            : event.stageId === "ads"
              ? "Reklam turuna geç"
              : "Denetime git",
        actionHref: PHASE_ROUTES[event.stageId],
      };
    }
    default: {
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}

export function getStageLabel(stageId: AuditPhaseId): string {
  return AUDIT_PHASE_LABELS[stageId];
}
