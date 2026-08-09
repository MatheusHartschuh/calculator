import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { calculateBinary, calculateUnary } from "./calculatorApi";

describe("calculatorApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts binary calculations to the backend", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ result: 15 }),
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(calculateBinary("add", 10, 5)).resolves.toBe(15);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8080/api/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operation: "add",
        left: 10,
        right: 5,
      }),
    });
  });

  it("posts unary calculations to the backend", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ result: 0.25 }),
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(calculateUnary("percentage", 25)).resolves.toBe(0.25);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8080/api/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operation: "percentage",
        value: 25,
      }),
    });
  });

  it("throws a typed error when the backend returns a failure", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ error: "division by zero" }),
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(calculateBinary("divide", 10, 0)).rejects.toMatchObject({
      name: "CalculatorApiError",
      message: "division by zero",
      status: 422,
    });
  });
});
