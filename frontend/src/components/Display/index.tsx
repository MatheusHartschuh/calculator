import React from "react";
import { formatDisplayValue } from "../../utils/helper";
import { useI18n } from "../../i18n";
import { DisplayRow, OperatorDisplay, StyledDisplay } from "./style";

interface DisplayProps {
  value: string;
  pendingOperator: string | null;
  onKeyDown: (key: string) => void;
}

const Display: React.FC<DisplayProps> = ({ value, pendingOperator, onKeyDown }) => {
  const { t } = useI18n();
  const formatted = formatDisplayValue(value, t.errors.display);

  // Captures keyboard input.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    onKeyDown(e.key);
  };

  // Read-only field that displays the formatted value and captures keyboard input.
  const displayElement = (
    <DisplayRow>
      <StyledDisplay
        type="text"
        value={formatted}
        onKeyDown={handleKeyDown}
        readOnly
        aria-label={t.display.ariaLabel}
      />
      <OperatorDisplay
        role="status"
        aria-label={t.display.pendingOperationAriaLabel}
        aria-live="polite"
      >
        {pendingOperator ?? ""}
      </OperatorDisplay>
    </DisplayRow>
  );

  return displayElement;
};

export default Display;
