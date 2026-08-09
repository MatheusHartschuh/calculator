// Formats numbers for display with a thousands separator and decimal comma.
export function formatDisplayValue(value: string): string {
  if (value == null || value === "" || value === "Erro") return value || "0";

  if (value.includes("e") || value.includes("E")) return value;

  const normalized = value.endsWith(".") ? `${value.slice(0, -1)},` : value;

  return normalized.replace(/-?\d+(\.\d+)?/g, (num) => {
    const [intPart, decimalPart] = num.split(".");
    const intWithSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return decimalPart ? `${intWithSep},${decimalPart}` : intWithSep;
  });
}
