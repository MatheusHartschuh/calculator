import type { Language } from "../i18n";

export type CalculatorSettings = {
  language: Language;
  decimalPlaces: number;
};

export const DEFAULT_SETTINGS: CalculatorSettings = {
  language: "en",
  decimalPlaces: 6,
};

const STORAGE_KEY = "calculadora.settings";
const MIN_DECIMALS = 0;
const MAX_DECIMALS = 12;

type StorageLike = Pick<Storage, "getItem" | "setItem">;

function getStorage(): StorageLike | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function normalizeLanguage(value: unknown): Language {
  return value === "pt-br" ? "pt-br" : "en";
}

export function normalizeDecimalPlaces(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value), 10);

  if (!Number.isFinite(parsed)) {
    return DEFAULT_SETTINGS.decimalPlaces;
  }

  return Math.min(MAX_DECIMALS, Math.max(MIN_DECIMALS, Math.trunc(parsed)));
}

export function parseSettings(value: string | null): CalculatorSettings {
  if (!value) {
    return DEFAULT_SETTINGS;
  }

  try {
    const parsed = JSON.parse(value) as Partial<CalculatorSettings>;
    return {
      language: normalizeLanguage(parsed.language),
      decimalPlaces: normalizeDecimalPlaces(parsed.decimalPlaces),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function loadSettings(storage: StorageLike | null = getStorage()): CalculatorSettings {
  if (!storage) {
    return DEFAULT_SETTINGS;
  }

  return parseSettings(storage.getItem(STORAGE_KEY));
}

export function saveSettings(settings: CalculatorSettings, storage: StorageLike | null = getStorage()): void {
  if (!storage) {
    return;
  }

  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      language: normalizeLanguage(settings.language),
      decimalPlaces: normalizeDecimalPlaces(settings.decimalPlaces),
    }),
  );
}
