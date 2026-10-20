import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTranslation } from "../../i18n";
import type { CanopLocale } from "../../i18n";

export interface CanopLanguageSelectorProps {
  width?: number | string;
}

export function LanguageSelector({ width }: CanopLanguageSelectorProps = {}) {
  const { locale, locales, setLocale, t } = useTranslation();

  if (locales.length < 2) return null;

  return (
    <Select
      size="small"
      color="secondary"
      value={locale}
      onChange={(event) => setLocale(event.target.value as CanopLocale)}
      inputProps={{ "aria-label": t("canop.language.label") }}
      sx={{
        minWidth: width ?? "5.25rem",
        width,
        ...(width
          ? {
              fontSize: "0.8rem",
              "& .MuiSelect-select": { paddingLeft: "0.5rem", paddingRight: "1.25rem !important" },
              "& .MuiSelect-icon": { right: 0 },
            }
          : {}),
      }}
    >
      {locales.map((entry) => (
        <MenuItem key={entry} value={entry}>
          {entry.toUpperCase()}
        </MenuItem>
      ))}
    </Select>
  );
}
