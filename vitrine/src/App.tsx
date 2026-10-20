import type { ReactNode } from "react";
import { SiteLayout } from "./layout/SiteLayout";
import { componentPage } from "./registry/componentPages";
import { useHashRoute } from "./router/useHashRoute";
import { ComponentsIndexPage } from "./pages/components/ComponentsIndexPage";
import { IconsPage } from "./pages/getting-started/IconsPage";
import { InstallationPage } from "./pages/getting-started/InstallationPage";
import { ThemingPage } from "./pages/getting-started/ThemingPage";
import { TypographyPage } from "./pages/getting-started/TypographyPage";
import { UtilisationPage } from "./pages/getting-started/UtilisationPage";
import { VersionsPage } from "./pages/getting-started/VersionsPage";
import { HomePage } from "./pages/home/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { UnderConstructionPage } from "./pages/UnderConstructionPage";

const docsPages: Record<string, () => ReactNode> = {
  installation: () => <InstallationPage />,
  utilisation: () => <UtilisationPage />,
  theming: () => <ThemingPage />,
  typographie: () => <TypographyPage />,
  icones: () => <IconsPage />,
  versions: () => <VersionsPage />,
};

interface ResolvedPage {
  element: ReactNode;
  withSidebar: boolean;
}

function resolvePage(segments: string[]): ResolvedPage {
  const [head, slug] = segments;
  if (!head) return { element: <HomePage />, withSidebar: false };
  if (head === "docs" && slug && docsPages[slug]) {
    return { element: docsPages[slug](), withSidebar: true };
  }
  if (head === "components") {
    if (!slug) return { element: <ComponentsIndexPage />, withSidebar: true };
    const Page = componentPage(slug);
    return {
      element: Page ? <Page /> : <UnderConstructionPage />,
      withSidebar: true,
    };
  }
  return { element: <NotFoundPage />, withSidebar: false };
}

export function App() {
  const route = useHashRoute();
  const { element, withSidebar } = resolvePage(route.segments);

  return (
    <SiteLayout activePath={route.path} withSidebar={withSidebar}>
      {element}
    </SiteLayout>
  );
}
