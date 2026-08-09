import styled from "styled-components";
import { theme } from "../../style/theme";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing(2)};
  z-index: 20;
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  z-index: -1;
`;

export const Card = styled.div`
  width: min(100%, 420px);
  background: ${theme.colors.white};
  color: ${theme.colors.text};
  border-radius: 18px;
  padding: ${theme.spacing(3)};
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.24);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing(2)};
  margin-bottom: ${theme.spacing(2)};
`;

export const Title = styled.h3`
  margin: 0;
  font-size: ${theme.font.size.large};
`;

export const CloseButton = styled.button`
  border: none;
  background: ${theme.colors.numeric};
  color: ${theme.colors.text};
  width: 36px;
  height: 36px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
`;

export const Field = styled.div`
  display: grid;
  gap: ${theme.spacing(1)};
  margin-bottom: ${theme.spacing(2)};
`;

export const FieldLabel = styled.label`
  font-weight: ${theme.font.weight.bold};
`;

export const FieldValue = styled.input`
  width: 100%;
  border: 1px solid rgba(51, 51, 51, 0.18);
  border-radius: 12px;
  padding: ${theme.spacing(1.5)};
  font-size: ${theme.font.size.medium};
`;

export const Select = styled.select`
  width: 100%;
  border: 1px solid rgba(51, 51, 51, 0.18);
  border-radius: 12px;
  padding: ${theme.spacing(1.5)};
  font-size: ${theme.font.size.medium};
  background: ${theme.colors.white};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing(1)};
  margin-top: ${theme.spacing(3)};
`;
