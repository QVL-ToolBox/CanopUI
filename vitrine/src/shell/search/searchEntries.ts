import type { DocLocale } from "../../i18n/useDocLocale";
import { groupEntries, groupPath, navGroups, type NavGroup } from "../../registry/nav";
import { shellTexts } from "../shellTexts";
import type { SearchEntry } from "./searchTypes";

const HOME_PATH = "/";
const CATALOG_PATH = "/components";

function groupSearchEntries(group: NavGroup, locale: DocLocale): SearchEntry[] {
  const groupLabel = group.title[locale];
  return [
    {
      path: groupPath(group),
      title: groupLabel,
      description: group.description[locale],
      group: groupLabel,
      icon: group.icon,
    },
    ...groupEntries(group).map((entry) => ({
      path: entry.path,
      title: entry.title[locale],
      description: entry.description[locale],
      group: groupLabel,
    })),
  ];
}

export function buildSearchEntries(locale: DocLocale): SearchEntry[] {
  const t = shellTexts[locale];
  return [
    { path: HOME_PATH, title: t.home, description: "", group: t.brand, icon: "home" },
    { path: CATALOG_PATH, title: t.catalog, description: "", group: t.brand, icon: "apps" },
    ...navGroups.flatMap((group) => groupSearchEntries(group, locale)),
  ];
}
