import styled from "styled-components";
import { theme } from "../../style/theme";

export const PanelContainer = styled.div`
  width: 100%;
  max-width: 240px;
  padding: ${theme.spacing(1)};
  background-color: ${theme.colors.numeric};
  border-radius: ${theme.borderRadius};
  font-size: ${theme.font.size.small};
  box-shadow: ${theme.boxShadow};
  max-height: 400px;
  overflow-y: auto;
`;

export const Title = styled.h4`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing(1)};
  margin: 0 0 0.5rem 0;
  text-align: center;
`;

export const ClearButton = styled.button`
  border: none;
  border-radius: 999px;
  cursor: pointer;
  padding: 4px 10px;
  background: ${theme.colors.yellow};
  color: ${theme.colors.text};
  font-size: ${theme.font.size.small};
`;

export const EmptyState = styled.div`
  text-align: center;
  color: ${theme.colors.text};
`;

export const Item = styled.div`
  margin-bottom: ${theme.spacing(0.5)};
  cursor: pointer;
  text-align: right;
`;
