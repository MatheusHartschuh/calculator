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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing(1)};
  margin-bottom: ${theme.spacing(0.5)};
`;

export const ItemButton = styled.button`
  flex: 1;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: right;
  padding: 0;
`;

export const ItemValue = styled.span`
  color: ${theme.colors.text};
`;

export const ItemActions = styled.div`
  display: flex;
  align-items: center;

  button {
    border: none;
    background: transparent;
    cursor: pointer;
    color: ${theme.colors.red};
    font-size: 18px;
    line-height: 1;
    padding: 0 4px;
  }
`;
