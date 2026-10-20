import IconButton from "@mui/material/IconButton";
import { squircleSurface } from "../../squircle";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useTranslation } from "../../i18n";
import { Icon } from "../Icon";
import type { CanopToolbarSearchConfig } from "./toolbarTypes";

export interface ToolbarSearchProps {
  config: CanopToolbarSearchConfig;
}

export function ToolbarSearch({ config }: ToolbarSearchProps) {
  const { t } = useTranslation();
  const label = config.placeholder ?? t("canop.toolbar.search");
  const hasValue = config.value.length > 0;

  return (
    <TextField
      value={config.value}
      onChange={(event) => config.onChange(event.target.value)}
      placeholder={label}
      size="small"
      fullWidth
      slotProps={{
        htmlInput: { "aria-label": label },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Icon name="search" variant="outline" size="sm" color="inherit" />
            </InputAdornment>
          ),
          endAdornment: hasValue ? (
            <InputAdornment position="end">
              <IconButton
                aria-label={t("canop.toolbar.clearSearch")}
                onClick={() => config.onChange("")}
                edge="end"
                size="small"
              >
                <Icon name="close" variant="outline" size="xs" color="inherit" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
      sx={{
        flex: 1,
        minWidth: 0,
        maxWidth: { sm: "24rem" },
        "& .MuiOutlinedInput-root": {
          height: "2.75rem",
          ...squircleSurface({
            radius: "1.375rem",
            shape: "pill",
            background: "var(--canop-palette-surface-sunken)",
          }),
          color: "text.secondary",
        },
        "& .MuiOutlinedInput-input": { color: "text.primary" },
      }}
    />
  );
}
