import styled from "styled-components";

export const KeypadContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 12px;
`;

export const KeypadSpacer = styled.div`
  min-height: 1px;
`;
