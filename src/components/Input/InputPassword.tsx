import Box from "@mui/material/Box";
import { useTranslation } from "../../i18n";
import { isValidPassword } from "../../validation";
import { Input, type CanopInputProps } from "./Input";
import { PasswordStrength } from "./PasswordStrength";

export interface CanopInputPasswordProps extends Omit<
  CanopInputProps,
  "type" | "icon" | "validate" | "completion" | "completionNormalize" | "onCompletionAccept"
> {
  showStrength?: boolean;
}

export function InputPassword({
  autoComplete = "current-password",
  required,
  showStrength,
  value,
  ...rest
}: CanopInputPasswordProps) {
  const { t } = useTranslation();
  const enforceStrength = showStrength ?? autoComplete === "new-password";
  const validate = (input: string): string | null => {
    if (required && input === "") return t("canop.validation.required");
    if (enforceStrength && input !== "" && !isValidPassword(input)) {
      return t("canop.validation.password");
    }
    return null;
  };
  return (
    <Box>
      <Input
        type="password"
        icon="lock"
        autoComplete={autoComplete}
        required={required}
        validate={validate}
        value={value}
        {...rest}
      />
      {enforceStrength && <PasswordStrength value={value} />}
    </Box>
  );
}
