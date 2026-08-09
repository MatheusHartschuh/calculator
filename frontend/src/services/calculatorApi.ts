import type {
  BinaryCalculationRequest,
  BinaryOperation,
  CalculationErrorResponse,
  CalculationResultResponse,
  UnaryCalculationRequest,
  UnaryOperation,
} from "../types/calculator";

const DEFAULT_BASE_URL = "http://localhost:8080";

export class CalculatorApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "CalculatorApiError";
    this.status = status;
  }
}

function getBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, "");
}

async function postCalculation<TBody extends BinaryCalculationRequest | UnaryCalculationRequest>(
  body: TBody,
): Promise<number> {
  const response = await fetch(`${getBaseUrl()}/api/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as
    | CalculationResultResponse
    | CalculationErrorResponse
    | null;

  if (!response.ok) {
    const message = payload && "error" in payload ? payload.error : "Failed to calculate result";
    throw new CalculatorApiError(message, response.status);
  }

  if (!payload || !("result" in payload) || typeof payload.result !== "number") {
    throw new CalculatorApiError("Invalid response from calculator API", response.status);
  }

  return payload.result;
}

export function calculateBinary(operation: BinaryOperation, left: number, right: number) {
  return postCalculation({ operation, left, right });
}

export function calculateUnary(operation: UnaryOperation, value: number) {
  return postCalculation({ operation, value });
}
