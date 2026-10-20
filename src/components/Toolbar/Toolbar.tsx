import Stack from "@mui/material/Stack";
import { motion } from "framer-motion";
import { useTranslation } from "../../i18n";
import { useEnterAnimation } from "../../motion";
import { ToolbarActions } from "./ToolbarActions";
import { ToolbarSearch } from "./ToolbarSearch";
import { ToolbarSort } from "./ToolbarSort";
import { ToolbarViewToggle } from "./ToolbarViewToggle";
import { useToolbar } from "./useToolbar";
import type {
  CanopToolbarSearchConfig,
  CanopToolbarSortConfig,
  CanopToolbarViewConfig,
  CanopToolbarAction,
} from "./toolbarTypes";

const MotionStack = motion.create(Stack);

export interface CanopToolbarProps {
  ariaLabel?: string;
  search?: CanopToolbarSearchConfig;
  sort?: CanopToolbarSortConfig;
  view?: CanopToolbarViewConfig;
  actions?: CanopToolbarAction[];
}

export function Toolbar({ ariaLabel, search, sort, view, actions = [] }: CanopToolbarProps) {
  const { t } = useTranslation();
  const enter = useEnterAnimation({ direction: "up", distance: "0.5rem" });
  const {
    isCompact,
    visibleActions,
    overflowActions,
    overflowAnchor,
    overflowOpen,
    openOverflow,
    closeOverflow,
  } = useToolbar({ actions });

  return (
    <MotionStack
      role="toolbar"
      aria-label={ariaLabel ?? t("canop.toolbar.label")}
      initial={enter.initial}
      animate={enter.animate}
      transition={enter.transition}
      direction="row"
      spacing={1.5}
      sx={{
        paddingY: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "nowrap",
        minWidth: 0,
      }}
    >
      {search ? <ToolbarSearch config={search} /> : <span />}

      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {sort && <ToolbarSort config={sort} compact={isCompact} />}
        {view && <ToolbarViewToggle config={view} />}
        {actions.length > 0 && (
          <ToolbarActions
            visibleActions={visibleActions}
            overflowActions={overflowActions}
            compact={isCompact}
            overflowOpen={overflowOpen}
            overflowAnchor={overflowAnchor}
            openOverflow={openOverflow}
            closeOverflow={closeOverflow}
          />
        )}
      </Stack>
    </MotionStack>
  );
}
