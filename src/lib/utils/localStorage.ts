import { browser } from "$app/environment";

type LocalStorageKey = "sound-muted" | "sound-volume";

type LocalStorageSchema = {
  "sound-muted": boolean;
  "sound-volume": number;
};

class LocalStorageManager {
  static get<K extends LocalStorageKey>(key: K): LocalStorageSchema[K] | null {
    if (!browser) {
      console.warn(
        "LocalStorageManager.get called on the server. Returning null."
      );
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  static set<K extends LocalStorageKey>(key: K, value: LocalStorageSchema[K]) {
    if (!browser) {
      console.warn(
        "LocalStorageManager.set called on the server. No action taken."
      );
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  }

  static remove(key: LocalStorageKey) {
    if (!browser) {
      console.warn(
        "LocalStorageManager.remove called on the server. No action taken."
      );
      return;
    }

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  }

  static clear() {
    if (!browser) {
      console.warn(
        "LocalStorageManager.clear called on the server. No action taken."
      );
      return;
    }

    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
    }
  }
}

export default LocalStorageManager;
