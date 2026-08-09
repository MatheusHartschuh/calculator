import { getTranslations } from "../i18n";

// Cleans a number's text representation for use in the display and history.
export function cleanNumberString(
  value: number,
  fractionDigits = 12,
  errorMessage = getTranslations("en").errors.display,
): string {
  if (!Number.isFinite(value)) {
    return errorMessage;
  }

  const digits = Math.max(0, Math.trunc(fractionDigits));
  const normalized =
    digits === 0 ? Number.parseFloat(value.toFixed(0)) : Number.parseFloat(value.toPrecision(digits));

  if (Object.is(normalized, -0)) {
    return "0";
  }

  return normalized.toString();
}

// Converts the calculator's internal string to a number.
export function parseNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "-" || trimmed === "+") {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}
