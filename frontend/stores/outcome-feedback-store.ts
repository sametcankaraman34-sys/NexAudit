"use client";

import { create } from "zustand";
import { getOutcomePresentation } from "@/lib/outcome-copy";
import { toast } from "@/lib/nex-toast";
import {
  isModalOutcome,
  type OutcomeEvent,
  type ProjectOutcomeEvent,
  type StageOutcomeEvent,
} from "@/types/outcome-feedback";

function dispatchToastOutcome(event: OutcomeEvent) {
  const copy = getOutcomePresentation(event);
  const variant =
    event.type === "project.deleted"
      ? "neutral"
      : event.type === "stage.unlocked"
        ? "info"
        : "success";

  toast({
    variant,
    title: copy.title,
    description: copy.description,
    duration: event.type === "project.deleted" ? 3200 : 3800,
    action:
      copy.actionLabel && copy.actionHref
        ? { label: copy.actionLabel, href: copy.actionHref }
        : undefined,
  });
}

function createEventId(): string {
  return `outcome-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

type OutcomeEventInput =
  | Omit<ProjectOutcomeEvent, "id" | "createdAt">
  | Omit<StageOutcomeEvent, "id" | "createdAt">;

interface OutcomeFeedbackStore {
  modal: OutcomeEvent | null;
  modalExiting: boolean;
  emit: (event: OutcomeEventInput) => void;
  dismissModal: () => void;
  finalizeModalDismiss: () => void;
}

export const useOutcomeFeedbackStore = create<OutcomeFeedbackStore>((set, get) => ({
  modal: null,
  modalExiting: false,

  emit: (partial) => {
    const event = {
      ...partial,
      id: createEventId(),
      createdAt: Date.now(),
    } as OutcomeEvent;

    if (isModalOutcome(event)) {
      set({ modal: event, modalExiting: false });
      return;
    }

    dispatchToastOutcome(event);
  },

  dismissModal: () => {
    if (!get().modal) return;
    set({ modalExiting: true });
    window.setTimeout(() => get().finalizeModalDismiss(), 320);
  },

  finalizeModalDismiss: () => {
    set({ modal: null, modalExiting: false });
  },
}));
