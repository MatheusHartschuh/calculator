import { getTranslations, type Language, type TooltipKey } from "../i18n";

// Returns a tooltip for each key.
export function getTooltipForKey(key: string, language: Language = "en"): string | undefined {
  const normalized = key === "Raiz" ? "√" : key;
  return getTranslations(language).tooltips[normalized as TooltipKey];
}
