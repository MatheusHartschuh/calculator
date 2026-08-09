export type BinaryOperation = "add" | "subtract" | "multiply" | "divide" | "power";
export type UnaryOperation = "sqrt" | "percentage";

export type BinaryCalculationRequest = {
  operation: BinaryOperation;
  left: number;
  right: number;
};

export type UnaryCalculationRequest = {
  operation: UnaryOperation;
  value: number;
};

export type CalculationResultResponse = {
  result: number;
};

export type CalculationErrorResponse = {
  error: string;
};
