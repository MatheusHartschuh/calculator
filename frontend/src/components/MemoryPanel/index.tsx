import { useI18n } from "../../i18n";
import { cleanNumberString } from "../../lib/number";
import { formatDisplayValue } from "../../utils/helper";
import { ClearButton, EmptyState, Item, ItemActions, ItemButton, ItemValue, PanelContainer, Title } from "./style";

type MemoryPanelProps = {
  memory: number[];
  decimalPlaces: number;
  onRecall: (value: number) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
};

function MemoryPanel({ memory, decimalPlaces, onRecall, onRemove, onClear }: MemoryPanelProps) {
  const { t } = useI18n();

  // List of stored values with actions to recall or remove each item.
  const memoryItems = memory.map((value, index) => {
    const formatted = formatDisplayValue(
      cleanNumberString(value, decimalPlaces, t.errors.display),
      t.errors.display,
    );

    return (
      <Item key={`${index}-${value}`}>
        <ItemButton type="button" onClick={() => onRecall(value)}>
          <ItemValue>{formatted}</ItemValue>
        </ItemButton>
        <ItemActions>
          <button type="button" onClick={() => onRemove(index)} aria-label={t.aria.memoryRemove}>
            ×
          </button>
        </ItemActions>
      </Item>
    );
  });

  // Empty state or current memory items.
  const memoryContent = memory.length === 0 ? <EmptyState>{t.panels.memory.empty}</EmptyState> : memoryItems;

  // Memory panel with its title, clear action, and current content.
  const memoryPanel = (
    <PanelContainer>
      <Title>
        {t.panels.memory.title}
        <ClearButton type="button" onClick={onClear} aria-label={t.tooltips.MC}>
          MC
        </ClearButton>
      </Title>
      {memoryContent}
    </PanelContainer>
  );

  return memoryPanel;
}

export default MemoryPanel;
