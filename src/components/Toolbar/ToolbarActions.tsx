import { useTranslation } from "../../i18n";
import { OverflowActionBar, type OverflowStateProps } from "../_shared/OverflowActionBar";
import type { CanopToolbarAction } from "./toolbarTypes";

export interface ToolbarActionsProps extends OverflowStateProps {
  visibleActions: CanopToolbarAction[];
  overflowActions: CanopToolbarAction[];
}

export function ToolbarActions(props: ToolbarActionsProps) {
  const { t } = useTranslation();

  return (
    <OverflowActionBar
      {...props}
      actionVariant="secondary"
      actionSize="medium"
      moreActionsLabel={t("canop.toolbar.moreActions")}
    />
  );
}
