import { useState } from "react";
import { addMemoryValue, clearMemory, getLastMemoryValue, removeMemoryValue } from "../lib/memory";
import { cleanNumberString, parseNumber } from "../lib/number";
import { CalculatorApiError, calculateBinary, calculateUnary } from "../services/calculatorApi";
import type { BinaryOperation } from "../types/calculator";
import { formatDisplayValue } from "../utils/helper";
import { appendNumber, getKeyType, normalizeKey, toggleSign } from "../utils/keyUtils";

const MAX_HISTORY_ENTRIES = 10;

const OPERATOR_MAP: Record<string, BinaryOperation> = {
  "+": "add",
  "-": "subtract",
  "*": "multiply",
  "/": "divide",
  "^": "power",
};

const OPERATOR_SYMBOLS: Record<BinaryOperation, string> = {
  add: "+",
  subtract: "-",
  multiply: "*",
  divide: "/",
  power: "^",
};

type CalculatorErrorMessages = {
  display: string;
  invalidNumber: string;
  unexpectedCalculation: string;
};

type UseCalculatorOptions = {
  decimalPlaces: number;
  errorMessages: CalculatorErrorMessages;
};

export function useCalculator({ decimalPlaces, errorMessages }: UseCalculatorOptions) {
  const [displayValue, setDisplayValue] = useState("0");
  const [accumulator, setAccumulator] = useState<number | null>(null);
  const [pendingOperation, setPendingOperation] = useState<BinaryOperation | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState<number[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [hasError, setHasError] = useState(false);

  const resetCalculator = () => {
    setDisplayValue("0");
    setAccumulator(null);
    setPendingOperation(null);
    setWaitingForOperand(false);
    setHasError(false);
  };

  const startFreshInput = (value: string) => {
    setDisplayValue(value);
    setAccumulator(null);
    setPendingOperation(null);
    setWaitingForOperand(false);
    setHasError(false);
  };

  const addHistoryEntry = (entry: string) => {
    setHistory((previous) => (
      previous.length >= MAX_HISTORY_ENTRIES ? [...previous.slice(1), entry] : [...previous, entry]
    ));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const setCalculatorError = (message: string) => {
    console.error(message);
    setDisplayValue(errorMessages.display);
    setAccumulator(null);
    setPendingOperation(null);
    setWaitingForOperand(false);
    setHasError(true);
  };

  const formatStoredNumber = (value: number) => cleanNumberString(value, decimalPlaces, errorMessages.display);

  const applyResult = (result: number) => {
    const cleaned = formatStoredNumber(result);
    setDisplayValue(cleaned);
    setHasError(false);
    return cleaned;
  };

  const runCalculation = async (request: () => Promise<number>): Promise<number | null> => {
    setIsBusy(true);

    try {
      return await request();
    } catch (error) {
      setCalculatorError(error instanceof CalculatorApiError ? error.message : errorMessages.unexpectedCalculation);
      return null;
    } finally {
      setIsBusy(false);
    }
  };

  const handleDigit = (key: string) => {
    if (isBusy) return;

    const normalized = normalizeKey(key);

    if (hasError) {
      startFreshInput(normalized === "," ? "0." : normalized);
      return;
    }

    if (normalized === ",") {
      if (waitingForOperand) {
        setDisplayValue("0.");
        setWaitingForOperand(false);
        return;
      }

      setDisplayValue((current) => appendNumber(current, normalized));
      return;
    }

    if (waitingForOperand) {
      setDisplayValue(normalized);
      setWaitingForOperand(false);
      return;
    }

    setDisplayValue((current) => appendNumber(current, normalized));
  };

  const handleClearEntry = () => {
    if (hasError) {
      resetCalculator();
      return;
    }

    if (waitingForOperand) {
      setDisplayValue("0");
      return;
    }

    setDisplayValue((current) => {
      if (current.length <= 1) return "0";
      const next = current.slice(0, -1);
      return next === "-" ? "0" : next;
    });
  };

  const calculatePendingOperation = async (rightValue: number, nextOperation: BinaryOperation | null) => {
    if (accumulator === null || pendingOperation === null) {
      return;
    }

    const result = await runCalculation(() => calculateBinary(pendingOperation, accumulator, rightValue));
    if (result === null) {
      return;
    }

    const leftText = formatDisplayValue(formatStoredNumber(accumulator), errorMessages.display);
    const rightText = formatDisplayValue(formatStoredNumber(rightValue), errorMessages.display);
    const resultText = applyResult(result);

    addHistoryEntry(`${leftText} ${OPERATOR_SYMBOLS[pendingOperation]} ${rightText} = ${resultText}`);
    setAccumulator(result);
    setPendingOperation(nextOperation);
    setWaitingForOperand(true);
  };

  const handleOperator = async (operatorKey: string) => {
    if (isBusy) return;

    const nextOperation = OPERATOR_MAP[operatorKey];
    if (!nextOperation || hasError) return;

    const currentValue = parseNumber(displayValue);
    if (currentValue === null) {
      setCalculatorError(errorMessages.invalidNumber);
      return;
    }

    if (accumulator === null || pendingOperation === null) {
      setAccumulator(currentValue);
      setPendingOperation(nextOperation);
      setWaitingForOperand(true);
      return;
    }

    if (waitingForOperand) {
      setPendingOperation(nextOperation);
      return;
    }

    await calculatePendingOperation(currentValue, nextOperation);
  };

  const handleEquals = async () => {
    if (isBusy || accumulator === null || pendingOperation === null || waitingForOperand) {
      return;
    }

    const rightValue = parseNumber(displayValue);
    if (rightValue === null) {
      setCalculatorError(errorMessages.invalidNumber);
      return;
    }

    const result = await runCalculation(() => calculateBinary(pendingOperation, accumulator, rightValue));
    if (result === null) {
      return;
    }

    const leftText = formatDisplayValue(formatStoredNumber(accumulator), errorMessages.display);
    const rightText = formatDisplayValue(formatStoredNumber(rightValue), errorMessages.display);
    const resultText = applyResult(result);

    addHistoryEntry(`${leftText} ${OPERATOR_SYMBOLS[pendingOperation]} ${rightText} = ${resultText}`);
    setAccumulator(null);
    setPendingOperation(null);
    setWaitingForOperand(false);
  };

  const handleUnaryOperation = async (operation: "sqrt" | "percentage" | "square") => {
    if (isBusy || hasError) return;

    const currentValue = parseNumber(displayValue);
    if (currentValue === null) {
      setCalculatorError(errorMessages.invalidNumber);
      return;
    }

    const calculation = operation === "square"
      ? () => calculateBinary("power", currentValue, 2)
      : () => calculateUnary(operation, currentValue);
    const result = await runCalculation(calculation);
    if (result === null) {
      return;
    }

    const currentText = formatDisplayValue(formatStoredNumber(currentValue), errorMessages.display);
    const resultText = applyResult(result);
    const label = operation === "sqrt" ? "√" : "%";
    const historyEntry = operation === "square"
      ? `${currentText}² = ${resultText}`
      : `${label}(${currentText}) = ${resultText}`;

    addHistoryEntry(historyEntry);
    setAccumulator(null);
    setPendingOperation(null);
    setWaitingForOperand(false);
  };

  const storeCurrentValueInMemory = (key: "M+" | "M-") => {
    const currentValue = parseNumber(displayValue);
    if (currentValue === null) {
      setCalculatorError(errorMessages.invalidNumber);
      return;
    }

    const valueToStore = key === "M-" ? -currentValue : currentValue;
    setMemory((previous) => addMemoryValue(previous, valueToStore));
  };

  const handleMemoryAction = (key: string) => {
    if (key === "MC") {
      setMemory(clearMemory());
      return;
    }

    if (key === "MR") {
      const lastValue = getLastMemoryValue(memory);
      if (lastValue !== null) {
        setDisplayValue(formatStoredNumber(lastValue));
        setWaitingForOperand(false);
        setHasError(false);
      }
      return;
    }

    if (key === "M+" || key === "M-") {
      storeCurrentValueInMemory(key);
    }
  };

  const recallMemoryValue = (value: number) => {
    setDisplayValue(formatStoredNumber(value));
    setWaitingForOperand(false);
    setHasError(false);
  };

  const removeMemoryEntry = (index: number) => {
    setMemory((previous) => removeMemoryValue(previous, index));
  };

  const clearAllMemory = () => {
    setMemory(clearMemory());
  };

  const handleAction = async (key: string) => {
    if (isBusy && key !== "AC" && key !== "MC") return;

    const normalized = normalizeKey(key);

    if (hasError && normalized !== "AC" && normalized !== "MC" && normalized !== "MR") {
      return;
    }

    switch (normalized) {
      case "AC":
        resetCalculator();
        break;
      case "C":
        handleClearEntry();
        break;
      case "+/-":
        setDisplayValue((current) => toggleSign(current));
        break;
      case "=":
        await handleEquals();
        break;
      case "MC":
      case "MR":
      case "M+":
      case "M-":
        handleMemoryAction(normalized);
        break;
      default:
        break;
    }
  };

  const handleButtonClick = async (key: string) => {
    const normalized = normalizeKey(key);
    const keyType = getKeyType(normalized);

    if (keyType === "number") {
      handleDigit(normalized);
      return;
    }

    if (keyType === "operator") {
      await handleOperator(normalized);
      return;
    }

    if (keyType === "func") {
      if (normalized === "√") {
        await handleUnaryOperation("sqrt");
      } else if (normalized === "x²") {
        await handleUnaryOperation("square");
      } else if (normalized === "%") {
        await handleUnaryOperation("percentage");
      }
      return;
    }

    if (keyType === "memory") {
      handleMemoryAction(normalized);
      return;
    }

    if (keyType === "action") {
      await handleAction(normalized);
    }
  };

  return {
    displayValue,
    pendingOperator: pendingOperation ? OPERATOR_SYMBOLS[pendingOperation] : null,
    history,
    memory,
    isBusy,
    clearHistory,
    clearAllMemory,
    handleButtonClick,
    recallMemoryValue,
    removeMemoryEntry,
  };
}
