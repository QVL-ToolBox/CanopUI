import { useTranslation } from "../../i18n";
import { SegmentedControl, type CanopSegmentedControlIconOption } from "../SegmentedControl";
import type { CanopToolbarView, CanopToolbarViewConfig } from "./toolbarTypes";

export interface ToolbarViewToggleProps {
  config: CanopToolbarViewConfig;
}

export function ToolbarViewToggle({ config }: ToolbarViewToggleProps) {
  const { t } = useTranslation();
  const options: CanopSegmentedControlIconOption<CanopToolbarView>[] = [
    { value: "grid", label: t("canop.toolbar.viewGrid"), icon: "apps" },
    { value: "list", label: t("canop.toolbar.viewList"), icon: "menu" },
  ];

  return (
    <SegmentedControl
      iconOnly
      options={options}
      value={config.value}
      onChange={config.onChange}
      ariaLabel={t("canop.toolbar.view")}
    />
  );
}
