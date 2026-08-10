import React from "react";
import Button from "../Button";
import { KeypadContainer, KeypadSpacer } from "./style";

type ButtonType = "operator" | "action" | "number" | "func" | "memory";

type KeypadProps = {
  onButtonClick: (key: string) => void;
  disabled?: boolean;
};

const Keypad: React.FC<KeypadProps> = ({ onButtonClick, disabled }) => {
  const keypadLayout: { label: string; type?: ButtonType; className?: string }[][] = [
    [
      { label: "MC", type: "memory" },
      { label: "MR", type: "memory" },
      { label: "M+", type: "memory" },
      { label: "M-", type: "memory" },
    ],
    [
      { label: "AC", type: "action" },
      { label: "C", type: "action" },
      { label: "+/-", type: "action" },
      { label: "%", type: "func" },
    ],
    [
      { label: "7", type: "number" },
      { label: "8", type: "number" },
      { label: "9", type: "number" },
      { label: "*", type: "operator" },
    ],
    [
      { label: "4", type: "number" },
      { label: "5", type: "number" },
      { label: "6", type: "number" },
      { label: "-", type: "operator" },
    ],
    [
      { label: "1", type: "number" },
      { label: "2", type: "number" },
      { label: "3", type: "number" },
      { label: "+", type: "operator" },
    ],
    [
      { label: "0", type: "number" },
      { label: ",", type: "number" },
      { label: "x²", type: "func" },
      { label: "√", type: "func" },
    ],
    [
      { label: "=", type: "action", className: "keypad-wide" },
      { label: "^", type: "operator" },
      { label: "/", type: "operator" },
    ],
  ];

  // Buttons rendered from the layout, including spaces for empty keys.
  const keypadButtons = keypadLayout.flatMap((row, rowIndex) =>
    row.map((btn, colIndex) =>
      btn ? (
        <Button
          key={`${rowIndex}-${colIndex}-${btn.label}`}
          label={btn.label}
          onClick={onButtonClick}
          type={btn.type}
          className={btn.className}
          disabled={disabled}
        />
      ) : (
        <KeypadSpacer key={`${rowIndex}-${colIndex}`} aria-hidden="true" />
      ),
    ),
  );

  // Complete calculator keypad grid.
  const keypad = (
    <KeypadContainer>
      {keypadButtons}
    </KeypadContainer>
  );

  return keypad;
};

export default Keypad;
