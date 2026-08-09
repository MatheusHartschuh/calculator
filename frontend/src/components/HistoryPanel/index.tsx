import React from "react";
import { useI18n } from "../../i18n";
import { ClearButton, EmptyState, PanelContainer, Item, Title } from "./style";

interface HistoryPanelProps {
  history: string[];
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClear }) => {
  const { t } = useI18n();

  // Panel header with the title and history-clearing action.
  const historyHeader = (
    <Title>
      {t.panels.history.title}
      <ClearButton type="button" onClick={onClear} aria-label={t.aria.clearHistory}>
        {t.panels.history.clear}
      </ClearButton>
    </Title>
  );

  // Content displayed when there are no history entries yet.
  const historyContent = history.length === 0 ? (
    <EmptyState>{t.panels.history.empty}</EmptyState>
  ) : (
    history.map((item, i) => <Item key={i}>{item}</Item>)
  );

  // Panel containing the title and current history content.
  const historyPanel = (
    <PanelContainer>
      {historyHeader}
      {historyContent}
    </PanelContainer>
  );

  return historyPanel;
};

export default HistoryPanel;
