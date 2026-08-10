import { createContext, createElement, useContext, useMemo, type ReactNode } from "react";
import en from "./en";
import ptBr from "./pt-br";

export type Language = "en" | "pt-br";
export type TooltipKey =
  | "AC"
  | "C"
  | "≅"
  | "+"
  | "-"
  | "*"
  | "/"
  | "^"
  | "x²"
  | "√"
  | "%"
  | "="
  | "+/-"
  | "Trig"
  | "MC"
  | "MR"
  | "M+"
  | "M-"
  | "Close";

export interface Translations {
  app: {
    title: string;
    settingsButton: string;
  };
  panels: {
    history: {
      title: string;
      empty: string;
      clear: string;
    };
    memory: {
      title: string;
      empty: string;
    };
  };
  display: {
    ariaLabel: string;
    pendingOperationAriaLabel: string;
  };
  errors: {
    display: string;
    invalidNumber: string;
    unexpectedCalculation: string;
  };
  settings: {
    title: string;
    decimalsLabel: string;
    languageLabel: string;
    cancel: string;
    save: string;
    languageOptions: {
      en: string;
      "pt-br": string;
    };
  };
  trig: {
    close: string;
    tooltip: string;
  };
  buttons: {
    trig: string;
  };
  tooltips: Record<TooltipKey, string>;
  aria: {
    openSettings: string;
    memoryRemove: string;
    clearHistory: string;
  };
}

const translations = {
  en,
  "pt-br": ptBr,
} as const satisfies Record<Language, Translations>;

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function getTranslations(language: Language): Translations {
  return translations[language] ?? translations.en;
}

type I18nProviderProps = {
  language: Language;
  setLanguage: (language: Language) => void;
  children: ReactNode;
};

export function I18nProvider({ language, setLanguage, children }: I18nProviderProps) {
  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: getTranslations(language),
    }),
    [language, setLanguage],
  );

  return createElement(I18nContext.Provider, { value }, children);
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
