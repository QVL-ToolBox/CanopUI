import { useTranslation } from "../../i18n";
import { OverflowActionBar, type OverflowStateProps } from "../_shared/OverflowActionBar";
import type { CanopSelectionAction } from "./selectionTypes";

export interface SelectionBarActionsProps extends OverflowStateProps {
  visibleActions: CanopSelectionAction[];
  overflowActions: CanopSelectionAction[];
}

export function SelectionBarActions(props: SelectionBarActionsProps) {
  const { t } = useTranslation();

  return (
    <OverflowActionBar
      {...props}
      actionVariant="tonal"
      actionSize="small"
      moreActionsLabel={t("canop.selectionBar.moreActions")}
    />
  );
}
