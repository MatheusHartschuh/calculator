import React from "react";
import { getTooltipForKey } from "../../utils/tooltipText";
import { useI18n } from "../../i18n";
import { theme } from "../../style/theme";
import { StyledButton } from "./style";

type ButtonType = "number" | "operator" | "action" | "memory" | "func";

interface ButtonProps {
  label: string;
  onClick: (label: string) => void;
  type?: ButtonType;
  className?: string;
  disabled?: boolean;
}

// Defines colors by label.
const LABEL_STYLES: Record<string, { background: string; color: string }> = {
  "+": { background: theme.colors.green, color: theme.colors.white },
  "*": { background: theme.colors.green, color: theme.colors.white },
  "x²": { background: theme.colors.green, color: theme.colors.white },
  "^": { background: theme.colors.green, color: theme.colors.white },
  "^2": { background: theme.colors.green, color: theme.colors.white },
  "-": { background: theme.colors.red, color: theme.colors.white },
  "/": { background: theme.colors.red, color: theme.colors.white },
  "√": { background: theme.colors.red, color: theme.colors.white },
  "sqrt": { background: theme.colors.red, color: theme.colors.white },
  "=": { background: theme.colors.blue, color: theme.colors.white },
  "+/-": { background: theme.colors.blue, color: theme.colors.white },
  "π": { background: theme.colors.blue, color: theme.colors.white },
  "pi": { background: theme.colors.blue, color: theme.colors.white },
  "C": { background: theme.colors.orange, color: theme.colors.white },
  "AC": { background: theme.colors.orange, color: theme.colors.white },
  "(": { background: theme.colors.orange, color: theme.colors.white },
  ")": { background: theme.colors.orange, color: theme.colors.white },
  ",": { background: theme.colors.numeric, color: theme.colors.text },
  "≅": { background: theme.colors.numeric, color: theme.colors.text },
  "Trig": { background: theme.colors.purple, color: theme.colors.white },
  "Close": { background: theme.colors.red, color: theme.colors.white },
};

// Defines styles by button type.
const TYPE_STYLES: Record<ButtonType, { background: string; color: string }> = {
  number: { background: theme.colors.numeric, color: theme.colors.text },
  operator: { background: theme.colors.green, color: theme.colors.white },
  action: { background: theme.colors.orange, color: theme.colors.white },
  memory: { background: theme.colors.yellow, color: theme.colors.text },
  func: { background: theme.colors.blue, color: theme.colors.white },
};

const Button: React.FC<ButtonProps> = ({ label, onClick, type, className, disabled }) => {
  const { language } = useI18n();
  const styleByLabel = LABEL_STYLES[label];
  const styleByType = type ? TYPE_STYLES[type] : undefined;
  const { background, color } = styleByLabel ?? styleByType ?? TYPE_STYLES.number;

  const handleClick = () => {
    if (!disabled) onClick(label);
  };

  // Contextual tooltip.
  const tooltip = getTooltipForKey(label, language);

  // Button configured with the current label's appearance, accessibility, and action.
  const buttonElement = (
    <StyledButton
      className={className}
      $backgroundColor={background}
      $color={color}
      onClick={handleClick}
      title={tooltip}
      aria-label={tooltip ?? label}
      disabled={disabled}
    >
      {label}
    </StyledButton>
  );

  return buttonElement;
};

export default React.memo(Button);
