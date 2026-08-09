import { describe, expect, it } from "vitest";
import { appendNumber, getKeyType, normalizeKey, toggleSign } from "./keyUtils";

describe("keyUtils", () => {
  it("normalizes common keyboard aliases", () => {
    expect(normalizeKey("Enter")).toBe("=");
    expect(normalizeKey("Backspace")).toBe("C");
    expect(normalizeKey("Escape")).toBe("AC");
    expect(normalizeKey(".")).toBe(",");
    expect(normalizeKey("x2")).toBe("x²");
    expect(normalizeKey("sqrt")).toBe("√");
    expect(normalizeKey("raiz")).toBe("√");
  });

  it("classifies key types", () => {
    expect(getKeyType("7")).toBe("number");
    expect(getKeyType("+")).toBe("operator");
    expect(getKeyType("=")).toBe("action");
    expect(getKeyType("x²")).toBe("func");
    expect(getKeyType("%")).toBe("func");
    expect(getKeyType("M+")).toBe("memory");
    expect(getKeyType("MC")).toBe("memory");
  });

  it("appends digits and decimals safely", () => {
    expect(appendNumber("0", "5")).toBe("5");
    expect(appendNumber("12", ",")).toBe("12.");
    expect(appendNumber("12.", ",")).toBe("12.");
    expect(appendNumber("0", ",")).toBe("0.");
  });

  it("toggles sign", () => {
    expect(toggleSign("12")).toBe("-12");
    expect(toggleSign("-12")).toBe("12");
    expect(toggleSign("0")).toBe("-0");
  });
});
