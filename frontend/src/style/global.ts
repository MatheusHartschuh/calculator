import { createGlobalStyle } from "styled-components";
import { theme } from "./theme";

export const GlobalStyle = createGlobalStyle`
  :root {
    font-family: ${theme.font.family};
    line-height: 1.5;
    font-weight: ${theme.font.weight.normal};
    color: ${theme.colors.text};
    background-color: ${theme.colors.background};
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: ${theme.colors.background};
  }
`;
