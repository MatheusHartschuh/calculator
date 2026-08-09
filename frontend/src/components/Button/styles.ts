import styled from "styled-components";
import { theme } from "../../style/theme";

//Estilo base para todos os botões
export const StyledButton = styled.button`
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

  &:hover:not(:disabled) {
    opacity: 0.85;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
