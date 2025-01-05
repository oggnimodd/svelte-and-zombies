import { browser } from "$app/environment";
import { z } from "zod";

const schemas = {
  "sound-muted": z.boolean(),
  "sound-volume": z.number().min(0).max(1),
} as const;

const defaults = {
  "sound-muted": false,
  "sound-volume": 0.5,
} as const;

type LocalStorageKey = keyof typeof schemas;
type LocalStorageSchema = {
  [K in LocalStorageKey]: z.infer<(typeof schemas)[K]>;
};

class LocalStorageManager {
  static get<K extends LocalStorageKey>(
    key: K,
    options?: { defaultValue?: LocalStorageSchema[K] }
  ): LocalStorageSchema[K] {
    if (!browser) {
      console.warn(
        "LocalStorageManager.get called on the server. Returning default value."
      );
      return options?.defaultValue ?? defaults[key];
    }

    try {
      const item = localStorage.getItem(key);
      if (!item) return options?.defaultValue ?? defaults[key];

      const parsed = JSON.parse(item);
      const validationResult = schemas[key].safeParse(parsed);

      if (!validationResult.success) {
        console.warn(
          `Invalid value found in localStorage for key "${key}". Using default value.`,
          validationResult.error
        );
        // Reset to default value since the stored value is invalid
        this.set(key, options?.defaultValue ?? defaults[key]);
        return options?.defaultValue ?? defaults[key];
      }

      return validationResult.data as LocalStorageSchema[K];
    } catch {
      console.warn(
        `Error reading from localStorage for key "${key}". Using default value.`
      );
      return options?.defaultValue ?? defaults[key];
    }
  }

  static set<K extends LocalStorageKey>(
    key: K,
    value: LocalStorageSchema[K]
  ): boolean {
    if (!browser) {
      console.warn(
        "LocalStorageManager.set called on the server. No action taken."
      );
      return false;
    }

    try {
      // Validate value before setting
      const validationResult = schemas[key].safeParse(value);
      if (!validationResult.success) {
        console.error(
          `Invalid value provided for key "${key}":`,
          validationResult.error
        );
        return false;
      }

      localStorage.setItem(key, JSON.stringify(validationResult.data));
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
      return false;
    }
  }

  static remove(key: LocalStorageKey): boolean {
    if (!browser) {
      console.warn(
        "LocalStorageManager.remove called on the server. No action taken."
      );
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
      return false;
    }
  }

  static clear(): boolean {
    if (!browser) {
      console.warn(
        "LocalStorageManager.clear called on the server. No action taken."
      );
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
      return false;
    }
  }
}

export default LocalStorageManager;
