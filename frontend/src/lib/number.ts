// Limpa a representação textual de um número para uso no display e no histórico.
export function cleanNumberString(value: number, fractionDigits = 12): string {
  if (!Number.isFinite(value)) {
    return "Erro";
  }

  const digits = Math.max(0, Math.trunc(fractionDigits));
  const normalized =
    digits === 0 ? Number.parseFloat(value.toFixed(0)) : Number.parseFloat(value.toPrecision(digits));

  if (Object.is(normalized, -0)) {
    return "0";
  }

  return normalized.toString();
}

// Converte a string interna da calculadora em número.
export function parseNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "-" || trimmed === "+") {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}
