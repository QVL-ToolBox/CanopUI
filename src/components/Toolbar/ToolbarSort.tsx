import Stack from "@mui/material/Stack";
import { squircleFill, squircleSurface } from "../../squircle";
import IconButton from "@mui/material/IconButton";
import ButtonBase from "@mui/material/ButtonBase";
import type { CSSObject } from "@mui/material/styles";
import { useState, type MouseEvent } from "react";
import { useTranslation } from "../../i18n";
import { hoverOrKeyboardFocus } from "../../interaction";
import { Icon } from "../Icon";
import { Menu, MenuItem } from "../Menu";
import type { CanopToolbarSortConfig } from "./toolbarTypes";

export interface ToolbarSortProps {
  config: CanopToolbarSortConfig;
  compact: boolean;
}

const SORT_SURFACE = squircleSurface({
  radius: "1.375rem",
  shape: "pill",
  background: "transparent",
});

export function ToolbarSort({ config, compact }: ToolbarSortProps) {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const activeOption = config.options.find((option) => option.id === config.value);
  const direction = config.direction ?? "asc";
  const directionLabel =
    direction === "asc" ? t("canop.toolbar.sortAscending") : t("canop.toolbar.sortDescending");

  const openMenu = (event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget);
  const closeMenu = () => setAnchor(null);

  const selectOption = (id: string) => {
    config.onChange(id);
    closeMenu();
  };

  const toggleDirection = () => {
    config.onDirectionChange?.(direction === "asc" ? "desc" : "asc");
  };

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{
        alignItems: "center",
      }}
    >
      <ButtonBase
        aria-haspopup="menu"
        aria-expanded={Boolean(anchor)}
        aria-label={t("canop.toolbar.sort")}
        onClick={openMenu}
        sx={{
          height: "2.75rem",
          gap: "0.5rem",
          paddingX: compact ? "0.75rem" : "1rem",
          ...SORT_SURFACE,
          color: "text.secondary",
          fontWeight: 600,
          fontSize: "0.8125rem",
          whiteSpace: "nowrap",
          "&::before": {
            ...(SORT_SURFACE["&::before"] as CSSObject),
            transition:
              "background-color var(--canop-motion-duration-fast) var(--canop-motion-ease-standard)",
          },
          [hoverOrKeyboardFocus()]: {
            ...squircleFill("var(--canop-palette-surface-sunken)"),
            color: "text.primary",
          },
        }}
      >
        {activeOption?.label ?? t("canop.toolbar.sort")}
        <Icon name="caretDown" variant="outline" size="xs" color="inherit" />
      </ButtonBase>

      {config.onDirectionChange && (
        <IconButton
          aria-label={directionLabel}
          onClick={toggleDirection}
          sx={{
            color: "text.secondary",
            transition:
              "transform var(--canop-motion-duration-base) var(--canop-motion-ease-spring-soft)",
            transform: direction === "asc" ? "rotate(180deg)" : "none",
            "@media (prefers-reduced-motion: reduce)": { transition: "none" },
          }}
        >
          <Icon name="caretDown" variant="outline" size="sm" color="inherit" />
        </IconButton>
      )}

      <Menu
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={closeMenu}
        ariaLabel={t("canop.toolbar.sort")}
      >
        {config.options.map((option) => (
          <MenuItem
            key={option.id}
            label={option.label}
            icon={
              option.id === config.value ? (
                <Icon name="check" variant="outline" size="sm" color="primary" />
              ) : undefined
            }
            onClick={() => selectOption(option.id)}
          />
        ))}
      </Menu>
    </Stack>
  );
}
