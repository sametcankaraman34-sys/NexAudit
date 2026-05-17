/** Simüle edilmiş API gecikmesi ve yükleme hissi */
export const MOCK_API_DELAY_MS = 420;

export function delay(ms = MOCK_API_DELAY_MS): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function withMockApi<T>(
  action: () => T | Promise<T>,
  options?: { delayMs?: number },
): Promise<T> {
  await delay(options?.delayMs ?? MOCK_API_DELAY_MS);
  return action();
}
