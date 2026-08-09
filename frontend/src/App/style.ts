import styled from "styled-components";
import { theme } from "../style/theme";

export const Page = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing(3)};
  background:
    radial-gradient(circle at top left, rgba(72, 175, 168, 0.14), transparent 30%),
    radial-gradient(circle at bottom right, rgba(178, 0, 255, 0.08), transparent 28%),
    ${theme.colors.background};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing(2)};
  }
`;

export const Workspace = styled.div`
  width: min(100%, 1240px);
  display: grid;
  grid-template-columns: minmax(220px, 240px) minmax(0, 1fr) minmax(220px, 240px);
  gap: ${theme.spacing(3)};
  align-items: center;
  justify-items: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "calculator"
      "history"
      "memory";
    width: min(100%, 640px);
    align-items: start;

    & > :nth-child(1) {
      grid-area: history;
    }

    & > :nth-child(2) {
      grid-area: calculator;
    }

    & > :nth-child(3) {
      grid-area: memory;
    }
  }
`;

export const CalculatorCard = styled.section`
  width: 100%;
  padding: ${theme.spacing(3)};
  border-radius: 24px;
  background: ${theme.colors.white};
  box-shadow: ${theme.boxShadow};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing(2)};
    border-radius: 16px;
  }
`;

export const HeaderBar = styled.header`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: ${theme.spacing(2)};
  margin-bottom: ${theme.spacing(2)};
`;

export const HeaderSpacer = styled.div`
  width: 1px;
  height: 1px;
`;

export const HeaderTitle = styled.h2`
  text-align: center;
  margin: 0;
`;

export const SettingsButton = styled.button`
  justify-self: end;
  border: none;
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
  background-color: ${theme.colors.blue};
  color: ${theme.colors.white};
  font-weight: ${theme.font.weight.bold};
`;
