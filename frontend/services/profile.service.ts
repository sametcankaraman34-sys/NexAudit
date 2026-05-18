import { buildActivityEntry, prependActivity } from "@/stores/workflow-helpers";
import { useAppStore } from "@/stores/app-store";
import { NotificationService } from "@/services/notification-service";
import type { UserProfile, ProfileUpdateInput } from "@/types/profile.types";
import type { TeamMemberRole } from "@/types/app-database";

const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
const AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function createDefaultProfile(seed?: Partial<UserProfile>): UserProfile {
  return {
    id: "u1",
    name: "Ajans Demo",
    email: "demo@nexaudit.app",
    avatarUrl: null,
    companyName: "Ajans Demo",
    role: "owner",
    website: "ajansdemo.com.tr",
    timezone: "eu-istanbul",
    language: "tr",
    ...seed,
  };
}

export function getProfileInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function validateAvatarFile(file: File): string | null {
  if (!AVATAR_TYPES.includes(file.type)) {
    return "Yalnızca PNG, JPG veya WEBP yükleyebilirsin.";
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return "Dosya en fazla 2 MB olabilir.";
  }
  return null;
}

export function readAvatarAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Avatar okunamadı."));
    };
    reader.onerror = () => reject(new Error("Avatar okunamadı."));
    reader.readAsDataURL(file);
  });
}

function syncOwnerTeamMember(profile: UserProfile) {
  const state = useAppStore.getState();
  const ownerId = profile.id;
  const initials = getProfileInitials(profile.name);
  useAppStore.setState({
    settings: {
      ...state.settings,
      team: state.settings.team.map((member) =>
        member.id === ownerId
          ? {
              ...member,
              name: profile.name,
              email: profile.email,
              role: profile.role,
              initials,
            }
          : member,
      ),
    },
  });
}

export async function updateProfile(patch: ProfileUpdateInput): Promise<UserProfile> {
  const state = useAppStore.getState();
  const current = state.settings.profile;
  const next: UserProfile = {
    ...current,
    ...patch,
    name: (patch.name ?? current.name).trim() || current.name,
    email: (patch.email ?? current.email).trim() || current.email,
    companyName: (patch.companyName ?? current.companyName).trim() || current.companyName,
  };

  await useAppStore.getState().updateSettings({ profile: next });
  syncOwnerTeamMember(next);

  const projectId = state.activeProjectId;
  useAppStore.setState((s) => ({
    activityByProject: {
      ...s.activityByProject,
      [projectId]: prependActivity(
        s.activityByProject[projectId] ?? [],
        buildActivityEntry("notification.sent", "Profil bilgileri güncellendi"),
      ),
    },
  }));

  NotificationService.success("Profil bilgileri kaydedildi.");
  return next;
}

export function getProfile(): UserProfile {
  return useAppStore.getState().settings.profile;
}

export const PROFILE_ROLE_OPTIONS: { value: TeamMemberRole; label: string }[] = [
  { value: "owner", label: "Sahip" },
  { value: "admin", label: "Yönetici" },
  { value: "editor", label: "Editör" },
  { value: "viewer", label: "Görüntüleyici" },
];
