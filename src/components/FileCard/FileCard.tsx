import Box from "@mui/material/Box";
import { squircleRing } from "../../squircle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Card } from "../Card";
import { Icon } from "../Icon";
import { Menu } from "../Menu";
import { Stack } from "../Stack";
import { useTranslation } from "../../i18n";
import { FileCardPreview } from "./FileCardPreview";
import { useFileCard, type CanopFileCardKind } from "./useFileCard";
import { useLongPressSelect } from "./useLongPressSelect";

export type { CanopFileCardKind };

export interface CanopFileCardProps {
  name: string;
  kind?: CanopFileCardKind;
  previewUrl?: string;
  metadata?: string;
  selectable?: boolean;
  /**
   * Sélectionne par appui long sur la carte, sans case à cocher. Seul geste de
   * sélection disponible au doigt quand `selectable` est laissé de côté.
   */
  selectOnLongPress?: boolean;
  selected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  onOpen?: () => void;
  menu?: ReactNode;
  menuLabel?: string;
  selectLabel?: string;
}

export function FileCard({
  name,
  kind = "file",
  previewUrl,
  metadata,
  selectable = false,
  selectOnLongPress = false,
  selected = false,
  onSelectionChange,
  onOpen,
  menu,
  menuLabel,
  selectLabel,
}: CanopFileCardProps) {
  const { t } = useTranslation();
  const { iconName, menuOpen, menuAnchor, openMenu, closeMenu, stopPropagation } = useFileCard({
    kind,
  });
  const { handlers, vientDeSelectionner } = useLongPressSelect({
    enabled: selectOnLongPress,
    onSelect: () => onSelectionChange?.(!selected),
  });

  const handleClick = () => {
    if (vientDeSelectionner()) return;
    onOpen?.();
  };

  const resolvedMenuLabel = menuLabel ?? t("canop.fileCard.actions");
  const resolvedSelectLabel = selectLabel ?? t("canop.fileCard.select");

  return (
    <Box
      {...handlers}
      sx={
        selected
          ? squircleRing({
              radius: "var(--canop-radius-lg)",
              width: "0.1875rem",
              color: "color-mix(in srgb, var(--canop-palette-primary-main) 55%, transparent)",
            })
          : undefined
      }
    >
      <Card variant="interactive" density="comfortable" onClick={handleClick} ariaLabel={name}>
        <Stack gap="sm">
          <FileCardPreview
            name={name}
            iconName={iconName}
            previewUrl={previewUrl}
            selectable={selectable}
            selected={selected}
            selectLabel={resolvedSelectLabel}
            onSelectionChange={onSelectionChange}
            onStopPropagation={stopPropagation}
          />

          <Stack direction="row" alignItems="start" justifyContent="space-between" gap="xs">
            <Box
              sx={{
                minWidth: 0,
              }}
            >
              <Typography
                variant="subtitle2"
                noWrap
                title={name}
                sx={{
                  color: "text.primary",
                }}
              >
                {name}
              </Typography>
              {metadata ? (
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  {metadata}
                </Typography>
              ) : null}
            </Box>

            {menu ? (
              <IconButton
                aria-label={resolvedMenuLabel}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={openMenu}
                onKeyDown={(event) => event.stopPropagation()}
                sx={{
                  flexShrink: 0,
                  color: "text.secondary",
                  minWidth: { xs: "3rem", md: "2.5rem" },
                  minHeight: { xs: "3rem", md: "2.5rem" },
                }}
              >
                <Icon name="more" size="sm" />
              </IconButton>
            ) : null}
          </Stack>
        </Stack>
      </Card>

      {menu ? (
        <Menu
          open={menuOpen}
          anchorEl={menuAnchor}
          onClose={closeMenu}
          onItemClick={closeMenu}
          ariaLabel={resolvedMenuLabel}
        >
          {menu}
        </Menu>
      ) : null}
    </Box>
  );
}
