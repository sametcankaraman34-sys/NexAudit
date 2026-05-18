"use client";

import {
  getProfile,
  getProfileInitials,
  updateProfile,
} from "@/services/profile.service";
import { useAppStore } from "@/stores/app-store";
import type { ProfileUpdateInput, UserProfile } from "@/types/profile.types";

export function useProfile(): UserProfile {
  return useAppStore((s) => s.settings.profile);
}

export function useProfileInitials(): string {
  const name = useAppStore((s) => s.settings.profile.name);
  return getProfileInitials(name);
}

export function useProfileStore() {
  const profile = useProfile();
  const initials = getProfileInitials(profile.name);
  return {
    profile,
    initials,
    updateProfile: (patch: ProfileUpdateInput) => updateProfile(patch),
    getProfile,
  };
}
