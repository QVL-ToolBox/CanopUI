import { useMemo } from "react";
import type { CanopNavbarItem } from "@canop/ui";
import { useDocLocale } from "../i18n/useDocLocale";
import { findGroup, groupPath } from "../registry/nav";
import { routeHref } from "../router/routes";
import { buildNavbarItems } from "./navbarItems";
import { shellTexts, type ShellTexts } from "./shellTexts";

export interface UseDocShellResult {
  texts: ShellTexts;
  navbarItems: CanopNavbarItem[];
  activeHref: string | undefined;
}

function navbarActiveHref(path: string): string | undefined {
  const group = findGroup(path);
  return group && groupPath(group) === path ? undefined : routeHref(path);
}

export function useDocShell(activePath: string): UseDocShellResult {
  const locale = useDocLocale();
  const navbarItems = useMemo(() => buildNavbarItems(locale), [locale]);

  return {
    texts: shellTexts[locale],
    navbarItems,
    activeHref: navbarActiveHref(activePath),
  };
}
