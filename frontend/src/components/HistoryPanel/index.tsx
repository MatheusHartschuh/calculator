import React from "react";
import { theme } from "../../style/theme";
import { useI18n } from "../../i18n";
import { PanelContainer, Item, Title } from "./styles";

interface HistoryPanelProps {
  history: string[];
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history }) => {
  const { t } = useI18n();

  return (
    <PanelContainer>
      <Title>{t.panels.history.title}</Title>
      {history.length === 0 ? (
        <div style={{ textAlign: "center", color: theme.colors.text }}>{t.panels.history.empty}</div>
      ) : (
        history.map((item, i) => <Item key={i}>{item}</Item>)
      )}
    </PanelContainer>
  );
};

export default HistoryPanel;
