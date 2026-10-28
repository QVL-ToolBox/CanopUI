import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { PageScaffold } from "../PageScaffold";
import { CANOP_CANOPY_SCENES } from "../../CanopyBackground";
import type { CanopNavbarItem } from "../../Navbar";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

const items: CanopNavbarItem[] = [{ label: "Dashboard", href: "/dashboard", icon: "apps" }];

function renderScaffold(ui: ReactNode) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider defaultMode="light">{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

describe("PageScaffold — fond", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it("affiche la canopee par defaut", async () => {
    renderScaffold(
      <PageScaffold items={items}>
        <p>Contenu</p>
      </PageScaffold>,
    );
    const element = await waitFor(() => {
      const video = document.querySelector("video");
      expect(video).not.toBeNull();
      return video;
    });
    expect(element).toHaveAttribute("poster", CANOP_CANOPY_SCENES.light.poster);
  });

  it("revient aux formes quand background vaut shapes", async () => {
    renderScaffold(
      <PageScaffold items={items} background="shapes">
        <p>Contenu</p>
      </PageScaffold>,
    );
    await waitFor(() => expect(document.querySelector("main canvas")).not.toBeNull());
    expect(document.querySelector("video")).toBeNull();
  });

  it("garde le contenu au-dessus du fond dans les deux cas", () => {
    const { getByText, unmount } = renderScaffold(
      <PageScaffold items={items}>
        <p>Contenu canopee</p>
      </PageScaffold>,
    );
    expect(getByText("Contenu canopee")).toBeInTheDocument();
    unmount();

    const shapes = renderScaffold(
      <PageScaffold items={items} background="shapes">
        <p>Contenu formes</p>
      </PageScaffold>,
    );
    expect(shapes.getByText("Contenu formes")).toBeInTheDocument();
  });
});
