import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, normalizeDecimalPlaces, normalizeLanguage, parseSettings } from "./preferences";

describe("preferences", () => {
  it("defaults to english and six decimals", () => {
    expect(DEFAULT_SETTINGS).toEqual({ language: "en", decimalPlaces: 6 });
  });

  it("normalizes language and decimal places", () => {
    expect(normalizeLanguage("pt-br")).toBe("pt-br");
    expect(normalizeLanguage("en")).toBe("en");
    expect(normalizeDecimalPlaces(3)).toBe(3);
    expect(normalizeDecimalPlaces(99)).toBe(12);
    expect(normalizeDecimalPlaces(-2)).toBe(0);
  });

  it("parses persisted settings safely", () => {
    expect(parseSettings(JSON.stringify({ language: "pt-br", decimalPlaces: 8 }))).toEqual({
      language: "pt-br",
      decimalPlaces: 8,
    });
    expect(parseSettings("invalid json")).toEqual(DEFAULT_SETTINGS);
  });
});
