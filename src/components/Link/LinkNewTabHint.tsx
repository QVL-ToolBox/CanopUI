import { useTranslation } from "../../i18n";
import { VisuallyHidden } from "../VisuallyHidden";

export function LinkNewTabHint() {
  const { t } = useTranslation();
  return <VisuallyHidden>{` ${t("canop.link.newTab")}`}</VisuallyHidden>;
}
