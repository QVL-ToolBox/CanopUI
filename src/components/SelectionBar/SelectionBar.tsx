import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "../../i18n";
import { motionDurationSeconds, motionEasing, useReducedMotion } from "../../motion";
import { squircleSurface, useSquircleRadius } from "../../squircle";
import { Icon } from "../Icon";
import { SelectionBarActions } from "./SelectionBarActions";
import { useSelectionBar } from "./useSelectionBar";
import type { CanopSelectionAction } from "./selectionTypes";

const MotionStack = motion.create(Stack);

export interface CanopSelectionBarProps {
  count: number;
  actions: CanopSelectionAction[];
  onClear: () => void;
  countLabel?: (count: number) => string;
}

export function SelectionBar({ count, actions, onClear, countLabel }: CanopSelectionBarProps) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const { ref: squircleRef, radius: pillRadius } = useSquircleRadius<HTMLDivElement>();
  const {
    isCompact,
    visibleActions,
    overflowActions,
    overflowAnchor,
    overflowOpen,
    openOverflow,
    closeOverflow,
  } = useSelectionBar({ actions });

  const isVisible = count > 0;
  const label = countLabel ? countLabel(count) : t("canop.selectionBar.selected", { count });

  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: motionDurationSeconds.base, ease: motionEasing.organic };
  const hidden = reducedMotion ? { opacity: 0 } : { opacity: 0, y: "0.75rem" };
  const shown = { opacity: 1, y: 0 };

  return (
    <AnimatePresence>
      {isVisible && (
        <MotionStack
          key="canop-selection-bar"
          role="region"
          aria-label={label}
          initial={hidden}
          animate={shown}
          exit={hidden}
          transition={transition}
          direction="row"
          spacing={1.5}
          ref={squircleRef}
          sx={{
            paddingY: 1,
            paddingX: 1.5,
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            minWidth: 0,
            color: "text.primary",
            ...(pillRadius
              ? squircleSurface({
                  radius: pillRadius,
                  shape: "pill",
                  background: "var(--canop-palette-surface-overlay)",
                  borderColor: "var(--canop-palette-divider)",
                  shadow: "var(--canop-drop-shadow-e3)",
                })
              : {
                  borderRadius: "var(--canop-radius-pill)",
                  backgroundColor: "surface.overlay",
                  border: "0.0625rem solid",
                  borderColor: "divider",
                  boxShadow: "var(--canop-shadow-e3)",
                }),
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              minWidth: 0,
            }}
          >
            <IconButton
              aria-label={t("canop.selectionBar.clear")}
              onClick={onClear}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <Icon name="close" variant="outline" size="sm" color="inherit" />
            </IconButton>
            <Typography
              aria-live="polite"
              noWrap
              sx={{
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              {label}
            </Typography>
          </Stack>

          <SelectionBarActions
            visibleActions={visibleActions}
            overflowActions={overflowActions}
            compact={isCompact}
            overflowOpen={overflowOpen}
            overflowAnchor={overflowAnchor}
            openOverflow={openOverflow}
            closeOverflow={closeOverflow}
          />
        </MotionStack>
      )}
    </AnimatePresence>
  );
}
