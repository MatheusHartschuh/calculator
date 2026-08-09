import type { Translations } from "./index";

const en: Translations = {
  app: {
    title: "Calculator",
    settingsButton: "Settings",
  },
  panels: {
    history: {
      title: "History",
      empty: "Empty!",
    },
    memory: {
      title: "Memory",
      empty: "Empty!",
    },
  },
  display: {
    ariaLabel: "Calculator display",
  },
  settings: {
    title: "Settings",
    decimalsLabel: "Default decimals:",
    languageLabel: "Language:",
    cancel: "Cancel",
    save: "Save",
    languageOptions: {
      en: "English",
      "pt-br": "Portuguese (Brazil)",
    },
  },
  trig: {
    close: "Close",
    tooltip: "Trigonometric functions (sin, cos, tan, pi)",
  },
  buttons: {
    trig: "Trig",
  },
  tooltips: {
    AC: "Clears everything",
    C: "Deletes the last digit or operator",
    "≅": "Rounds the decimal value",
    "+": "Addition",
    "-": "Subtraction",
    "*": "Multiplication",
    "/": "Division",
    "^": "Power",
    "x²": "Squared",
    "√": "Square root",
    "%": "Percentage",
    "=": "Equals",
    "+/-": "Toggle sign",
    Trig: "Trigonometric functions (sin, cos, tan, pi)",
    MC: "Clears memory",
    MR: "Recalls the last memory value",
    "M+": "Adds the current number to memory",
    "M-": "Adds the opposite of the current number to memory",
    Close: "Closes the modal",
  },
  aria: {
    openSettings: "Open settings",
    memoryRemove: "Remove memory item",
  },
} as const;

export default en;
