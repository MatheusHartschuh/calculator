// Theme definitions.

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
    backgroundGlowBlue: "rgba(72, 175, 168, 0.14)",
    backgroundGlowPurple: "rgba(178, 0, 255, 0.08)",
    overlay: "rgba(15, 23, 42, 0.45)",
    border: "rgba(51, 51, 51, 0.18)",
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
  breakpoints: {
    mobile: "640px",
    tablet: "1024px",
  },
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
  modalBoxShadow: "0 24px 60px rgba(15, 23, 42, 0.24)",
};
