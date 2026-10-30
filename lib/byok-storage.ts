export interface CustomImageKitConfig {
  publicKey: string;
  privateKey: string;
}

const STORAGE_KEY = "aura_custom_imagekit_config";
export const BYOK_CHANGE_EVENT = "aura_byok_config_changed";

export function getCustomImageKitConfig(): CustomImageKitConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.publicKey && parsed.privateKey) {
      return {
        publicKey: parsed.publicKey,
        privateKey: parsed.privateKey,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveCustomImageKitConfig(config: CustomImageKitConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event(BYOK_CHANGE_EVENT));
  } catch (err) {
    console.error("Failed to save custom ImageKit config:", err);
  }
}

export function clearCustomImageKitConfig(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(BYOK_CHANGE_EVENT));
  } catch (err) {
    console.error("Failed to clear custom ImageKit config:", err);
  }
}
