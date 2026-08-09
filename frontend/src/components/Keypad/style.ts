import styled from "styled-components";
import { theme } from "../../style/theme";

export const KeypadContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 12px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: 6px;
  }
`;

export const KeypadSpacer = styled.div`
  min-height: 1px;
`;
