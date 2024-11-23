type LocalStorageKey = "sound-muted" | "sound-volume";

type LocalStorageSchema = {
  "sound-muted": boolean;
  "sound-volume": number;
};

class LocalStorageManager {
  static get<K extends LocalStorageKey>(key: K): LocalStorageSchema[K] | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  static set<K extends LocalStorageKey>(
    key: K,
    value: LocalStorageSchema[K]
  ): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  }

  static remove(key: LocalStorageKey): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
    }
  }
}

export default LocalStorageManager;
