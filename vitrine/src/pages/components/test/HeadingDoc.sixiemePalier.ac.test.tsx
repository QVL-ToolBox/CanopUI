import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopI18nProvider, CanopThemeProvider } from "@canop/ui";
import HeadingDoc from "../HeadingDoc";

const RENDU_LENT = 20_000;

function monte(ui: ReactNode) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

describe("page Heading de la vitrine", () => {
  it(
    "montre le sixième palier parmi les échelles",
    () => {
      monte(<HeadingDoc />);
      expect(screen.getAllByRole("heading", { name: "Titre taille 6" }).length).toBeGreaterThan(0);
    },
    RENDU_LENT,
  );

  it(
    "annonce le sixième palier dans le tableau des props",
    () => {
      monte(<HeadingDoc />);
      expect(screen.getAllByText(/1 \| 2 \| 3 \| 4 \| 5 \| 6/).length).toBeGreaterThan(0);
    },
    RENDU_LENT,
  );
});
