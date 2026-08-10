import styled from "styled-components";
import { theme } from "../../style/theme";

export const DisplayRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: ${theme.spacing(1)};
  margin-bottom: ${theme.spacing(1)};
`;

// Main calculator display field.
export const StyledDisplay = styled.input`
  background-color: ${theme.colors.numeric};
  color: ${theme.colors.text};
  font-size: ${theme.font.size.large};
  padding: ${theme.spacing(2)};
  border-radius: ${theme.borderRadius};
  text-align: right;
  box-shadow: ${theme.boxShadow};
  min-height: 2rem;
  margin: 0;
  width: 100%;
  min-width: 0;
  border: none;
`;

// Shows the operation that will be used when the next operand is entered.
export const OperatorDisplay = styled.span`
  width: 48px;
  min-width: 48px;
  min-height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing(1)};
  border-radius: ${theme.borderRadius};
  background-color: ${theme.colors.numeric};
  color: ${theme.colors.blue};
  font-size: ${theme.font.size.large};
  font-weight: ${theme.font.weight.bold};
  box-shadow: ${theme.boxShadow};
`;
