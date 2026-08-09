import { useEffect, useState } from "react";
import Display from "./components/Display";
import HistoryPanel from "./components/HistoryPanel";
import Keypad from "./components/Keypad";
import MemoryPanel from "./components/MemoryPanel";
import SettingsModal from "./components/SettingsModal";
import { I18nProvider, useI18n } from "./i18n";
import { calculateBinary, calculateUnary, CalculatorApiError } from "./services/calculatorApi";
import { cleanNumberString, parseNumber } from "./lib/number";
import { addMemoryValue, clearMemory, getLastMemoryValue, removeMemoryValue } from "./lib/memory";
import { loadSettings, saveSettings, type CalculatorSettings } from "./lib/preferences";
import { appendNumber, getKeyType, normalizeKey, toggleSign } from "./utils/keyUtils";
import { formatDisplayValue } from "./utils/helper";
import { CalculatorCard, HeaderBar, HeaderSpacer, Page, SettingsButton, Workspace } from "./App.styles";
import type { BinaryOperation } from "./types/calculator";

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

type AppShellProps = {
  settings: CalculatorSettings;
  onSettingsChange: (settings: CalculatorSettings) => void;
};

function AppShell({ settings, onSettingsChange }: AppShellProps) {
  const { t } = useI18n();
  const [displayValue, setDisplayValue] = useState("0");
  const [accumulator, setAccumulator] = useState<number | null>(null);
  const [pendingOperation, setPendingOperation] = useState<BinaryOperation | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState<number[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const resetCalculator = () => {
    setDisplayValue("0");
    setAccumulator(null);
    setPendingOperation(null);
    setWaitingForOperand(false);
  };

  const startFreshInput = (value: string) => {
    setDisplayValue(value);
    setAccumulator(null);
    setPendingOperation(null);
    setWaitingForOperand(false);
  };

  const pushHistory = (entry: string) => {
    setHistory((previous) => (previous.length >= 10 ? [...previous.slice(1), entry] : [...previous, entry]));
  };

  const setApiError = (message: string) => {
    console.error(message);
    setDisplayValue("Erro");
    setAccumulator(null);
    setPendingOperation(null);
    setWaitingForOperand(false);
  };

  const formatStoredNumber = (value: number) => cleanNumberString(value, settings.decimalPlaces);

  const applyResult = (result: number) => {
    const cleaned = formatStoredNumber(result);
    setDisplayValue(cleaned);
    return cleaned;
  };

  const rememberCurrentValue = (value: number) => {
    setMemory((previous) => addMemoryValue(previous, value));
  };

  const recallMemoryValue = (value: number) => {
    setDisplayValue(formatStoredNumber(value));
    setWaitingForOperand(false);
  };

  const handleDigit = (key: string) => {
    if (isBusy) return;

    const normalized = normalizeKey(key);

    if (displayValue === "Erro") {
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
    if (displayValue === "Erro") {
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

    const result = await calculateBinary(pendingOperation, accumulator, rightValue);
    const leftText = formatDisplayValue(formatStoredNumber(accumulator));
    const rightText = formatDisplayValue(formatStoredNumber(rightValue));
    const resultText = applyResult(result);

    pushHistory(`${leftText} ${OPERATOR_SYMBOLS[pendingOperation]} ${rightText} = ${resultText}`);
    setAccumulator(result);
    setPendingOperation(nextOperation);
    setWaitingForOperand(true);
  };

  const handleOperator = async (operatorKey: string) => {
    if (isBusy) return;

    const nextOperation = OPERATOR_MAP[operatorKey];
    if (!nextOperation) return;

    if (displayValue === "Erro") {
      return;
    }

    const currentValue = parseNumber(displayValue);
    if (currentValue === null) {
      setApiError("Invalid number");
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

    setIsBusy(true);
    try {
      await calculatePendingOperation(currentValue, nextOperation);
    } catch (error) {
      if (error instanceof CalculatorApiError) {
        setApiError(error.message);
      } else {
        setApiError("Unexpected error while calculating");
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleEquals = async () => {
    if (isBusy || accumulator === null || pendingOperation === null || waitingForOperand) {
      return;
    }

    const rightValue = parseNumber(displayValue);
    if (rightValue === null) {
      setApiError("Invalid number");
      return;
    }

    setIsBusy(true);
    try {
      const result = await calculateBinary(pendingOperation, accumulator, rightValue);
      const leftText = formatDisplayValue(formatStoredNumber(accumulator));
      const rightText = formatDisplayValue(formatStoredNumber(rightValue));
      const resultText = applyResult(result);

      pushHistory(`${leftText} ${OPERATOR_SYMBOLS[pendingOperation]} ${rightText} = ${resultText}`);
      setAccumulator(null);
      setPendingOperation(null);
      setWaitingForOperand(false);
    } catch (error) {
      if (error instanceof CalculatorApiError) {
        setApiError(error.message);
      } else {
        setApiError("Unexpected error while calculating");
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleUnaryOperation = async (operation: "sqrt" | "percentage" | "square") => {
    if (isBusy || displayValue === "Erro") return;

    const currentValue = parseNumber(displayValue);
    if (currentValue === null) {
      setApiError("Invalid number");
      return;
    }

    setIsBusy(true);
    try {
      let result: number;
      let label: string;

      if (operation === "square") {
        result = await calculateBinary("power", currentValue, 2);
        label = "x²";
      } else if (operation === "sqrt") {
        result = await calculateUnary("sqrt", currentValue);
        label = "√";
      } else {
        result = await calculateUnary("percentage", currentValue);
        label = "%";
      }

      const currentText = formatDisplayValue(formatStoredNumber(currentValue));
      const resultText = applyResult(result);
      pushHistory(`${label}(${currentText}) = ${resultText}`);
      setAccumulator(null);
      setPendingOperation(null);
      setWaitingForOperand(false);
    } catch (error) {
      if (error instanceof CalculatorApiError) {
        setApiError(error.message);
      } else {
        setApiError("Unexpected error while calculating");
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleMemoryAction = (key: string) => {
    if (key === "MC") {
      setMemory(clearMemory());
      return;
    }

    if (key === "MR") {
      const lastValue = getLastMemoryValue(memory);
      if (lastValue !== null) {
        recallMemoryValue(lastValue);
      }
      return;
    }

    const currentValue = parseNumber(displayValue);
    if (currentValue === null) {
      setApiError("Invalid number");
      return;
    }

    const valueToStore = key === "M-" ? -currentValue : currentValue;
    rememberCurrentValue(valueToStore);
  };

  const handleMemoryRecall = (value: number) => {
    recallMemoryValue(value);
  };

  const handleMemoryRemove = (index: number) => {
    setMemory((previous) => removeMemoryValue(previous, index));
  };

  const handleAction = async (key: string) => {
    if (isBusy && key !== "AC" && key !== "MC") return;

    const normalized = normalizeKey(key);

    if (displayValue === "Erro" && normalized !== "AC" && normalized !== "MC" && normalized !== "MR") {
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

  const handleSettingsSave = (nextSettings: CalculatorSettings) => {
    onSettingsChange(nextSettings);
  };

  return (
    <>
      <Page>
        <Workspace>
          <HistoryPanel history={history} />

          <CalculatorCard>
            <HeaderBar>
              <HeaderSpacer aria-hidden="true" />
              <h2 style={{ textAlign: "center", margin: 0 }}>{t.app.title}</h2>
              <SettingsButton
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                aria-label={t.aria.openSettings}
                title={t.aria.openSettings}
              >
                {t.app.settingsButton}
              </SettingsButton>
            </HeaderBar>

            <Display value={displayValue} onKeyPress={(key) => void handleButtonClick(key)} />
            <Keypad onButtonClick={(key) => void handleButtonClick(key)} disabled={isBusy} />
          </CalculatorCard>

          <MemoryPanel
            memory={memory}
            decimalPlaces={settings.decimalPlaces}
            onRecall={handleMemoryRecall}
            onRemove={handleMemoryRemove}
            onClear={() => setMemory(clearMemory())}
          />
        </Workspace>
      </Page>

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSettingsSave}
      />
    </>
  );
}

function App() {
  const [settings, setSettings] = useState<CalculatorSettings>(() => loadSettings());

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  return (
    <I18nProvider
      language={settings.language}
      setLanguage={(nextLanguage) => {
        setSettings((current) => ({ ...current, language: nextLanguage }));
      }}
    >
      <AppShell
        settings={settings}
        onSettingsChange={(nextSettings) => {
          setSettings(nextSettings);
        }}
      />
    </I18nProvider>
  );
}

export default App;
