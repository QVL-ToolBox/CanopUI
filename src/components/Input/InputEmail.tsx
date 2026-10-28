import { useTranslation } from "../../i18n";
import { isValidEmail } from "../../validation";
import { Input, type CanopInputProps } from "./Input";

export type CanopInputEmailProps = Omit<
  CanopInputProps,
  "type" | "icon" | "validate" | "completion" | "completionNormalize" | "onCompletionAccept"
>;

export function InputEmail({ autoComplete = "email", required, ...rest }: CanopInputEmailProps) {
  const { t } = useTranslation();
  const validate = (value: string): string | null => {
    if (required && value.trim() === "") return t("canop.validation.required");
    if (value !== "" && !isValidEmail(value)) return t("canop.validation.email");
    return null;
  };
  return (
    <Input
      type="email"
      icon="mail"
      autoComplete={autoComplete}
      required={required}
      validate={validate}
      {...rest}
    />
  );
}
