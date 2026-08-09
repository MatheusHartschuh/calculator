export type KeyType = "number" | "operator" | "action" | "func" | "memory";

const operatorKeys = new Set(["+", "-", "*", "/", "^"]);
const actionKeys = new Set(["AC", "C", "=", "+/-"]);
const funcKeys = new Set(["√", "x²", "%"]);
const memoryKeys = new Set(["MC", "MR", "M+", "M-"]);

// Normalizes a key received from the physical or virtual keyboard.
export function normalizeKey(raw: string): string {
  const key = (raw ?? "").toString().trim();
  if (!key) return "";

  const lower = key.toLowerCase();

  if (lower === "enter") return "=";
  if (lower === "escape") return "AC";
  if (lower === "backspace") return "C";
  if (key === ".") return ",";
  if (lower === "sqrt") return "√";
  if (lower === "raiz") return "√";
  if (lower === "x2" || lower === "x^2" || lower === "^2") return "x²";
  if (lower === "percent" || lower === "pct") return "%";
  if (lower === "negate" || key === "±") return "+/-";
  if (lower === "x") return "*";

  return key;
}

// Returns the type of the normalized key.
export function getKeyType(rawKey: string): KeyType | undefined {
  const key = normalizeKey(rawKey);

  if (key === "," || /^[0-9]$/.test(key)) {
    return "number";
  }

  if (operatorKeys.has(key)) return "operator";
  if (actionKeys.has(key)) return "action";
  if (funcKeys.has(key)) return "func";
  if (memoryKeys.has(key)) return "memory";

  return undefined;
}

// Appends a digit or decimal separator to the current string.
export function appendNumber(expression: string, rawKey: string): string {
  const key = normalizeKey(rawKey);
  const decimalKey = key === "," ? "." : key;
  const current = expression || "0";

  if (decimalKey === "." && current.includes(".")) {
    return current;
  }

  if (current === "0") {
    if (decimalKey === ".") return "0.";
    if (decimalKey === "0") return current;
    return decimalKey;
  }

  if (current === "-0") {
    if (decimalKey === ".") return "-0.";
    if (decimalKey === "0") return current;
    return `-${decimalKey}`;
  }

  return current + decimalKey;
}

// Toggles the sign of the current value.
export function toggleSign(expression: string): string {
  if (!expression || expression === "0") {
    return "-0";
  }

  if (expression === "-0") {
    return "0";
  }

  return expression.startsWith("-") ? expression.slice(1) : `-${expression}`;
}
