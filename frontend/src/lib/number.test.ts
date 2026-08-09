import { describe, expect, it } from "vitest";
import { cleanNumberString, parseNumber } from "./number";

describe("number helpers", () => {
  it("parses valid numbers", () => {
    expect(parseNumber("12.5")).toBe(12.5);
    expect(parseNumber("0")).toBe(0);
  });

  it("returns null for invalid numbers", () => {
    expect(parseNumber("")).toBeNull();
    expect(parseNumber("-")).toBeNull();
    expect(parseNumber("Erro")).toBeNull();
  });

  it("cleans numeric strings", () => {
    expect(cleanNumberString(12.340000000001)).toBe("12.34");
    expect(cleanNumberString(-0)).toBe("0");
    expect(cleanNumberString(12.6, 0)).toBe("13");
  });
});
