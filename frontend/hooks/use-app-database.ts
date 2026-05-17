import { useAppStore } from "@/stores/app-store";

/** Aktif proje + workspace için kısayol hook'ları */
export function useAppDatabase() {
  const store = useAppStore();
  return store;
}
