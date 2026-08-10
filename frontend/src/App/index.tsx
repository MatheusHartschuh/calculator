import { useEffect, useState } from "react";
import Display from "../components/Display";
import HistoryPanel from "../components/HistoryPanel";
import Keypad from "../components/Keypad";
import MemoryPanel from "../components/MemoryPanel";
import SettingsModal from "../components/SettingsModal";
import { useCalculator } from "../hooks/useCalculator";
import { I18nProvider, useI18n } from "../i18n";
import { loadSettings, saveSettings, type CalculatorSettings } from "../lib/preferences";
import { CalculatorCard, HeaderBar, HeaderSpacer, HeaderTitle, Page, SettingsButton, Workspace } from "./style";

type AppShellProps = {
  settings: CalculatorSettings;
  onSettingsChange: (settings: CalculatorSettings) => void;
};

function AppShell({ settings, onSettingsChange }: AppShellProps) {
  const { t } = useI18n();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const {
    clearAllMemory,
    clearHistory,
    displayValue,
    handleButtonClick,
    history,
    isBusy,
    memory,
    pendingOperator,
    recallMemoryValue,
    removeMemoryEntry,
  } = useCalculator({
    decimalPlaces: settings.decimalPlaces,
    errorMessages: t.errors,
  });

  const handleSettingsSave = (nextSettings: CalculatorSettings) => {
    onSettingsChange(nextSettings);
  };

  // Title and settings action displayed in the calculator header.
  const calculatorHeader = (
    <HeaderBar>
      <HeaderSpacer aria-hidden="true" />
      <HeaderTitle>{t.app.title}</HeaderTitle>
      <SettingsButton
        type="button"
        onClick={() => setIsSettingsOpen(true)}
        aria-label={t.aria.openSettings}
        title={t.aria.openSettings}
      >
        {t.app.settingsButton}
      </SettingsButton>
    </HeaderBar>
  );

  // Center card containing the calculator display and keypad.
  const calculatorCard = (
    <CalculatorCard>
      {calculatorHeader}
      <Display
        value={displayValue}
        pendingOperator={pendingOperator}
        onKeyDown={(key) => void handleButtonClick(key)}
      />
      <Keypad onButtonClick={(key) => void handleButtonClick(key)} disabled={isBusy} />
    </CalculatorCard>
  );

  // Main area containing history, calculator, and memory.
  const calculatorWorkspace = (
    <Workspace>
      <HistoryPanel history={history} onClear={clearHistory} />
      {calculatorCard}
      <MemoryPanel
        memory={memory}
        decimalPlaces={settings.decimalPlaces}
        onRecall={recallMemoryValue}
        onRemove={removeMemoryEntry}
        onClear={clearAllMemory}
      />
    </Workspace>
  );

  // Page that centers the application's workspace.
  const calculatorPage = <Page>{calculatorWorkspace}</Page>;

  // Settings modal rendered according to its open state.
  const settingsModal = (
    <SettingsModal
      isOpen={isSettingsOpen}
      settings={settings}
      onClose={() => setIsSettingsOpen(false)}
      onSave={handleSettingsSave}
    />
  );

  return (
    <>
      {calculatorPage}
      {settingsModal}
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

  // Application content inside the language and settings provider.
  const appContent = (
    <I18nProvider
      language={settings.language}
      setLanguage={(nextLanguage) => {
        setSettings((current) => ({ ...current, language: nextLanguage }));
      }}
    >
      <AppShell settings={settings} onSettingsChange={setSettings} />
    </I18nProvider>
  );

  return appContent;
}

export default App;
