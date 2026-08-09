import { useI18n } from "../../i18n";
import { cleanNumberString } from "../../lib/number";
import { formatDisplayValue } from "../../utils/helper";
import { ClearButton, EmptyState, Item, ItemActions, ItemButton, ItemValue, PanelContainer, Title } from "./styles";

type MemoryPanelProps = {
  memory: number[];
  decimalPlaces: number;
  onRecall: (value: number) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
};

function MemoryPanel({ memory, decimalPlaces, onRecall, onRemove, onClear }: MemoryPanelProps) {
  const { t } = useI18n();

  return (
    <PanelContainer>
      <Title>
        {t.panels.memory.title}
        <ClearButton type="button" onClick={onClear} aria-label={t.tooltips.MC}>
          MC
        </ClearButton>
      </Title>
      {memory.length === 0 ? (
        <EmptyState>{t.panels.memory.empty}</EmptyState>
      ) : (
        memory.map((value, index) => {
          const formatted = formatDisplayValue(cleanNumberString(value, decimalPlaces));

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
        })
      )}
    </PanelContainer>
  );
}

export default MemoryPanel;
