import React from "react";
import { formatDisplayValue } from "../../utils/helper";
import { useI18n } from "../../i18n";
import { StyledDisplay } from "./styles";

interface DisplayProps {
  value: string;
  onKeyPress: (key: string) => void;
}

const Display: React.FC<DisplayProps> = ({ value, onKeyPress }) => {
  const { t } = useI18n();
  const formatted = formatDisplayValue(value);

  //Captura entrada de teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    onKeyPress(e.key);
  };

  return (
    <StyledDisplay
      type="text"
      value={formatted}
      onKeyDown={handleKeyDown}
      readOnly
      aria-label={t.display.ariaLabel}
    />
  );
};

export default Display;
