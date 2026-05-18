import { NotificationService } from "@/services/notification-service";
import { useAppStore } from "@/stores/app-store";
import type { ProjectAuditSettings } from "@/types/app-database";
import type { TeamMemberRole } from "@/types/app-database";

export async function saveProjectAuditSettings(
  projectId: string,
  patch: Partial<ProjectAuditSettings>,
  successMessage = "Denetim ayarları kaydedildi",
) {
  await useAppStore.getState().updateProjectAuditSettings(projectId, patch);
  NotificationService.success(successMessage, undefined, projectId);
}

export async function saveProfileSettings(
  patch: Parameters<ReturnType<typeof useAppStore.getState>["updateSettings"]>[0],
) {
  await useAppStore.getState().updateSettings(patch);
  NotificationService.success("Ayarlar kaydedildi", "Profil bilgilerin güncellendi.");
}

export async function updateTeamMemberRole(memberId: string, role: TeamMemberRole) {
  await useAppStore.getState().updateTeamMember(memberId, { role });
  NotificationService.success("Rol güncellendi", "Ekip üyesi yetkisi kaydedildi.");
}

export async function inviteTeamMember(email: string, role: TeamMemberRole) {
  await useAppStore.getState().inviteTeamMember({ email, role });
}

export async function toggleIntegrationWithFeedback(integrationId: string, name: string) {
  const item = useAppStore
    .getState()
    .settings.integrations.find((i) => i.id === integrationId);
  await useAppStore.getState().toggleIntegration(integrationId);
  const connected = item ? !item.connected : true;
  NotificationService.success(
    connected ? "Entegrasyon bağlandı" : "Bağlantı kesildi",
    name,
  );
}

export async function resetDatabaseWithFeedback() {
  useAppStore.getState().resetDatabase();
  NotificationService.success("Veriler sıfırlandı", "Varsayılan demo verisi yüklendi.");
}

export async function clearReportHistoryWithFeedback(projectId: string) {
  await useAppStore.getState().clearReportHistory(projectId);
  NotificationService.success("Rapor geçmişi temizlendi");
}
