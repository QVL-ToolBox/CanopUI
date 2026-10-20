import Stack from "@mui/material/Stack";
import { squircleSurface } from "../../squircle";
import ButtonBase from "@mui/material/ButtonBase";
import { LayoutGroup } from "framer-motion";
import { useId } from "react";
import { useTranslation } from "../../i18n";
import { useReducedMotion } from "../../motion";
import { Icon, type CanopIconName } from "../Icon";
import { SlidingIndicator } from "../SlidingIndicator";
import type { CanopToolbarView, CanopToolbarViewConfig } from "./toolbarTypes";

const VIEW_ICON: Record<CanopToolbarView, CanopIconName> = {
  grid: "apps",
  list: "menu",
};

export interface ToolbarViewToggleProps {
  config: CanopToolbarViewConfig;
}

export function ToolbarViewToggle({ config }: ToolbarViewToggleProps) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const groupId = useId();
  const views: CanopToolbarView[] = ["grid", "list"];
  const label: Record<CanopToolbarView, string> = {
    grid: t("canop.toolbar.viewGrid"),
    list: t("canop.toolbar.viewList"),
  };

  return (
    <Stack
      role="radiogroup"
      aria-label={t("canop.toolbar.view")}
      direction="row"
      sx={{
        alignItems: "center",
        padding: "0.1875rem",

        ...squircleSurface({
          radius: "1.4375rem",
          shape: "pill",
          background: "var(--canop-palette-surface-sunken)",
        }),
      }}
    >
      <LayoutGroup id={groupId}>
        {views.map((view) => {
          const isActive = config.value === view;
          return (
            <ButtonBase
              key={view}
              role="radio"
              aria-checked={isActive}
              aria-label={label[view]}
              onClick={() => config.onChange(view)}
              sx={{
                position: "relative",
                width: "2.5rem",
                height: "2.5rem",
                color: isActive ? "primary.main" : "text.secondary",
                transition: reducedMotion
                  ? "none"
                  : "color var(--canop-motion-duration-base) var(--canop-motion-ease-standard)",
              }}
            >
              {isActive && (
                <SlidingIndicator
                  layoutId={`${groupId}-view-indicator`}
                  radius="var(--canop-radius-pill)"
                  transition={{ type: "spring", stiffness: 520, damping: 34 }}
                />
              )}
              <Stack
                sx={{
                  position: "relative",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Icon name={VIEW_ICON[view]} variant={isActive ? "solid" : "outline"} size="sm" />
              </Stack>
            </ButtonBase>
          );
        })}
      </LayoutGroup>
    </Stack>
  );
}
