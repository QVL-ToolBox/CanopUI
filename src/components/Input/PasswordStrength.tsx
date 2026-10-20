import Box from "@mui/material/Box";
import { useTranslation } from "../../i18n";
import { squircleClip } from "../../squircle";
import {
  PASSWORD_MIN_LENGTH,
  passwordCriteriaState,
  type CanopPasswordCriterionId,
} from "../../validation";
import { Icon } from "../Icon";

const labelKey: Record<CanopPasswordCriterionId, string> = {
  length: "canop.password.length",
  uppercase: "canop.password.uppercase",
  lowercase: "canop.password.lowercase",
  digit: "canop.password.digit",
  special: "canop.password.special",
};

export interface CanopPasswordStrengthProps {
  value: string;
}

export function PasswordStrength({ value }: CanopPasswordStrengthProps) {
  const { t } = useTranslation();
  const criteria = passwordCriteriaState(value);
  const passedCount = criteria.filter((criterion) => criterion.passed).length;

  return (
    <Box
      sx={{
        marginTop: "0.5rem",
      }}
    >
      <Box
        role="meter"
        aria-label={t("canop.password.strengthLabel")}
        aria-valuenow={passedCount}
        aria-valuemin={0}
        aria-valuemax={criteria.length}
        sx={{
          display: "flex",
          gap: "0.25rem",
        }}
      >
        {criteria.map((criterion) => (
          <Box
            key={criterion.id}
            sx={{
              flex: 1,
              height: "0.375rem",
              bgcolor: criterion.passed ? "primary.main" : "divider",
              ...squircleClip("0.1875rem", { shape: "pill" }),
              transition: "background-color 0.2s ease",
            }}
          />
        ))}
      </Box>
      <Box
        component="ul"
        sx={{
          padding: 0,
          margin: 0,
          marginTop: "0.5rem",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: "0.25rem",
          listStyle: "none",
        }}
      >
        {criteria.map((criterion) => (
          <Box
            component="li"
            key={criterion.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.8rem",
              color: criterion.passed ? "primary.main" : "text.secondary",
            }}
          >
            <Icon name={criterion.passed ? "check" : "close"} variant="outline" size="xs" />
            {t(labelKey[criterion.id], { min: PASSWORD_MIN_LENGTH })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
