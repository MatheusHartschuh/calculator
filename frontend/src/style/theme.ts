// src/style/theme.ts

export const theme = {
  colors: {
    green: "#4CAF50",
    red: "#E53935",
    blue: "#48afa8",
    orange: "#FFA500",
    yellow: "#FFFF99",
    purple: "#B200FF",
    numeric: "#e0e0e0",
    text: "#333333",
    white: "#FFFFFF",
    background: "#F5F5F5",
  },
  font: {
    family: "'Segoe UI', Roboto, Arial, sans-serif",
    size: {
      small: "14px",
      medium: "16px",
      large: "20px",
    },
    weight: {
      normal: 400,
      bold: 700,
    },
  },
  spacing: (factor: number) => `${factor * 8}px`,
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
};
