import { useEffect, useState } from "react";
import { useI18n, type Language } from "../../i18n";
import {
  Actions,
  Backdrop,
  Card,
  CloseButton,
  Field,
  FieldLabel,
  FieldValue,
  Header,
  Overlay,
  Select,
  Title,
} from "./styles";
import Button from "../Button";
import type { CalculatorSettings } from "../../lib/preferences";

type SettingsModalProps = {
  isOpen: boolean;
  settings: CalculatorSettings;
  onClose: () => void;
  onSave: (settings: CalculatorSettings) => void;
};

const LANGUAGE_OPTIONS: Language[] = ["en", "pt-br"];

function SettingsModal({ isOpen, settings, onClose, onSave }: SettingsModalProps) {
  const { t } = useI18n();
  const [draft, setDraft] = useState(settings);

  useEffect(() => {
    if (isOpen) {
      setDraft(settings);
    }
  }, [isOpen, settings]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  return (
    <Overlay role="presentation" onMouseDown={onClose}>
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Header>
          <Title id="settings-title">{t.settings.title}</Title>
          <CloseButton type="button" onClick={onClose} aria-label={t.trig.close}>
            ×
          </CloseButton>
        </Header>

        <Field>
          <FieldLabel htmlFor="decimal-places">{t.settings.decimalsLabel}</FieldLabel>
          <FieldValue
            id="decimal-places"
            type="number"
            min={0}
            max={12}
            step={1}
            value={draft.decimalPlaces}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                decimalPlaces: Number.parseInt(event.target.value, 10) || 0,
              }))
            }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="language">{t.settings.languageLabel}</FieldLabel>
          <Select
            id="language"
            value={draft.language}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                language: event.target.value as Language,
              }))
            }
          >
            {LANGUAGE_OPTIONS.map((language) => (
              <option key={language} value={language}>
                {t.settings.languageOptions[language]}
              </option>
            ))}
          </Select>
        </Field>

        <Actions>
          <Button label={t.settings.cancel} onClick={onClose} type="action" />
          <Button label={t.settings.save} onClick={handleSave} type="action" />
        </Actions>
      </Card>
      <Backdrop aria-hidden="true" />
    </Overlay>
  );
}

export default SettingsModal;
