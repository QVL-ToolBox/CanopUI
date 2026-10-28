import type { CanopNavbarGroup, CanopNavbarItem } from "@canop/ui";
import type { DocLocale } from "../i18n/useDocLocale";
import { groupPath, navGroups, type NavCategory, type NavGroup } from "../registry/nav";
import { routeHref } from "../router/routes";

type NavbarSubNavigation = Pick<CanopNavbarItem, "children" | "groups">;

function categorySection(category: NavCategory, locale: DocLocale): CanopNavbarGroup {
  return {
    label: category.title[locale],
    items: category.entries.map((entry) => ({
      label: entry.title[locale],
      href: routeHref(entry.path),
    })),
  };
}

function subNavigation(group: NavGroup, locale: DocLocale): NavbarSubNavigation {
  const sections = group.categories.map((category) => categorySection(category, locale));
  return sections.length === 1 ? { children: sections[0].items } : { groups: sections };
}

export function buildNavbarItems(locale: DocLocale): CanopNavbarItem[] {
  return navGroups.map((group) => ({
    label: group.title[locale],
    icon: group.icon,
    href: routeHref(groupPath(group)),
    ...subNavigation(group, locale),
  }));
}
