import styled from "styled-components";
import { theme } from "../../style/theme";

//Campo de exibição principal
export const StyledDisplay = styled.input`
  background-color: ${theme.colors.numeric};
  color: ${theme.colors.text};
  font-size: ${theme.font.size.large};
  padding: ${theme.spacing(2)};
  border-radius: ${theme.borderRadius};
  text-align: right;
  box-shadow: ${theme.boxShadow};
  min-height: 2rem;
  margin-bottom: ${theme.spacing(1)};
  width: 90%;
  border: none;
`;
