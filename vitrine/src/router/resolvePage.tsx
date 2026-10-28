import type { ComponentType, LazyExoticComponent, ReactNode } from "react";
import type { CanopPageContentMaxWidth } from "@canop/ui";
import { CategoryPage } from "../pages/catalog/CategoryPage";
import { ComponentsIndexPage } from "../pages/components/ComponentsIndexPage";
import { HomePage } from "../pages/home/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { componentPage } from "../registry/componentPages";
import { findGroupById } from "../registry/nav";
import { lazyNamed } from "./lazyNamed";

export interface ResolvedPage {
  element: ReactNode;
  contentWidth: CanopPageContentMaxWidth;
}

const docsPages: Partial<Record<string, LazyExoticComponent<ComponentType>>> = {
  installation: lazyNamed(
    () => import("../pages/getting-started/InstallationPage"),
    "InstallationPage",
  ),
  utilisation: lazyNamed(
    () => import("../pages/getting-started/UtilisationPage"),
    "UtilisationPage",
  ),
  theming: lazyNamed(() => import("../pages/getting-started/ThemingPage"), "ThemingPage"),
  typographie: lazyNamed(() => import("../pages/getting-started/TypographyPage"), "TypographyPage"),
  icones: lazyNamed(() => import("../pages/getting-started/IconsPage"), "IconsPage"),
  focus: lazyNamed(() => import("../pages/getting-started/focus/FocusPage"), "FocusPage"),
  versions: lazyNamed(() => import("../pages/getting-started/VersionsPage"), "VersionsPage"),
};

function docPage(element: ReactNode): ResolvedPage {
  return { element, contentWidth: "lg" };
}

function componentRoute(slug: string | undefined): ResolvedPage {
  if (!slug) return docPage(<ComponentsIndexPage />);
  const Page = componentPage(slug);
  return docPage(Page ? <Page /> : <NotFoundPage />);
}

function categoryRoute(slug: string | undefined): ResolvedPage {
  const group = slug ? findGroupById(slug) : undefined;
  return docPage(group ? <CategoryPage group={group} /> : <NotFoundPage />);
}

function docsRoute(slug: string | undefined): ResolvedPage {
  const Page = slug ? docsPages[slug] : undefined;
  return docPage(Page ? <Page /> : <NotFoundPage />);
}

export function resolvePage(segments: string[]): ResolvedPage {
  const [head, slug] = segments;
  if (!head) return { element: <HomePage />, contentWidth: "full" };
  if (head === "docs") return docsRoute(slug);
  if (head === "components") return componentRoute(slug);
  if (head === "categories") return categoryRoute(slug);
  return docPage(<NotFoundPage />);
}
