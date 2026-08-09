import styled from "styled-components";
import { theme } from "../../style/theme";

// Base style and dynamic colors for each calculator button.
export const StyledButton = styled.button<{ $backgroundColor: string; $color: string }>`
  padding: ${theme.spacing(2)};
  font-size: ${theme.font.size.medium};
  border-radius: ${theme.borderRadius};
  border: none;
  cursor: pointer;
  box-shadow: ${theme.boxShadow};
  transition: opacity 0.15s ease, transform 0.08s ease;
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.$backgroundColor};
  color: ${(props) => props.$color};

  &:hover:not(:disabled) {
    opacity: 0.85;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    min-width: 44px;
    min-height: 44px;
  }
`;
