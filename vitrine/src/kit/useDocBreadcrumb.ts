import type { CanopBreadcrumbItem } from "@canop/ui";
import { useDocLocale } from "../i18n/useDocLocale";
import { findGroup, groupPath } from "../registry/nav";
import { useActivePath } from "../router/ActivePathContext";
import { HOME_PATH, navigateTo } from "../router/routes";
import { docKitTexts } from "./docKitTexts";

export function useDocBreadcrumb(title: string): CanopBreadcrumbItem[] {
  const locale = useDocLocale();
  const path = useActivePath();

  if (path === HOME_PATH) return [];

  const home: CanopBreadcrumbItem = {
    id: HOME_PATH,
    label: docKitTexts[locale].home,
    icon: "home",
    onClick: () => navigateTo(HOME_PATH),
  };
  const current: CanopBreadcrumbItem = { id: path, label: title };
  const group = findGroup(path);

  if (!group || groupPath(group) === path) return [home, current];

  const parentPath = groupPath(group);
  const parent: CanopBreadcrumbItem = {
    id: parentPath,
    label: group.title[locale],
    onClick: () => navigateTo(parentPath),
  };
  return [home, parent, current];
}
