import { describe, expect, it } from "vitest";
import { addMemoryValue, clearMemory, getLastMemoryValue, removeMemoryValue } from "./memory";

describe("memory helpers", () => {
  it("adds values to memory", () => {
    expect(addMemoryValue([1], 2)).toEqual([1, 2]);
  });

  it("removes a memory item by index", () => {
    expect(removeMemoryValue([1, 2, 3], 1)).toEqual([1, 3]);
  });

  it("returns the last memory value", () => {
    expect(getLastMemoryValue([1, 2, 3])).toBe(3);
    expect(getLastMemoryValue([])).toBeNull();
  });

  it("clears memory", () => {
    expect(clearMemory()).toEqual([]);
  });
});
