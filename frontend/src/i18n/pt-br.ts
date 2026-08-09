import type { Translations } from "./index";

const ptBr: Translations = {
  app: {
    title: "Calculadora",
    settingsButton: "Configurações",
  },
  panels: {
    history: {
      title: "Histórico",
      empty: "Vazio!",
      clear: "Limpar",
    },
    memory: {
      title: "Memória",
      empty: "Vazia!",
    },
  },
  display: {
    ariaLabel: "Display da calculadora",
  },
  settings: {
    title: "Configurações",
    decimalsLabel: "Decimais padrão:",
    languageLabel: "Idioma:",
    cancel: "Cancelar",
    save: "Salvar",
    languageOptions: {
      en: "Inglês",
      "pt-br": "Português (Brasil)",
    },
  },
  trig: {
    close: "Fechar",
    tooltip: "Funções trigonométricas (sin, cos, tan, pi)",
  },
  buttons: {
    trig: "Trig",
  },
  tooltips: {
    AC: "Limpa tudo (All Clear)",
    C: "Apaga o último dígito ou operador (Clear)",
    "≅": "Arredonda decimal",
    "+": "Soma",
    "-": "Subtração",
    "*": "Multiplicação",
    "/": "Divisão",
    "^": "Potência",
    "x²": "Elevado a dois",
    "√": "Raiz quadrada",
    "%": "Porcentagem",
    "=": "Executa o cálculo",
    "+/-": "Troca positivo/negativo",
    Trig: "Funções trigonométricas (sin, cos, tan, Pi)",
    MC: "Limpa a memória",
    MR: "Recupera o último valor da memória",
    "M+": "Adiciona o número atual à memória",
    "M-": "Adiciona o oposto do número atual à memória",
    Close: "Fecha o modal",
  },
  aria: {
    openSettings: "Abrir configurações",
    memoryRemove: "Remover item da memória",
    clearHistory: "Limpar histórico",
  },
} as const;

export default ptBr;
