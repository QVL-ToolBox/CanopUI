import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { LegalLinks, LEGAL_NOTICE_ANCHOR } from "../LegalLinks";

function poser(ui: React.ReactNode, locale: "fr" | "en" = "fr") {
  return render(
    <CanopThemeProvider>
      <CanopI18nProvider locale={locale}>{ui}</CanopI18nProvider>
    </CanopThemeProvider>,
  );
}

const PORTAIL = "https://auth.qvl.test";

describe("LegalLinks", () => {
  it("pointe les conditions et les mentions legales du portail donne", () => {
    poser(<LegalLinks authPortalUrl={PORTAIL} />);

    expect(screen.getByRole("link", { name: "CGU" })).toHaveAttribute(
      "href",
      "https://auth.qvl.test/cgu",
    );
    expect(screen.getByRole("link", { name: "Mentions légales" })).toHaveAttribute(
      "href",
      `https://auth.qvl.test/cgu#${LEGAL_NOTICE_ANCHOR}`,
    );
  });

  it("expose l'ancre, pour qu'elle ne soit plus recopiee ailleurs", () => {
    expect(LEGAL_NOTICE_ANCHOR).toBe("mentions-legales");
  });

  it("se nomme comme une zone de navigation", () => {
    poser(<LegalLinks authPortalUrl={PORTAIL} />);
    expect(screen.getByRole("navigation", { name: "Liens légaux" })).toBeInTheDocument();
  });

  it("suit la langue courante", () => {
    poser(<LegalLinks authPortalUrl={PORTAIL} />, "en");

    expect(screen.getByRole("link", { name: "Terms" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Legal notice" })).toBeInTheDocument();
  });

  it("accepte des libelles imposes", () => {
    poser(<LegalLinks authPortalUrl={PORTAIL} cguLabel="Conditions" noticeLabel="Mentions" />);

    expect(screen.getByRole("link", { name: "Conditions" })).toBeInTheDocument();
  });

  it("suit un chemin de conditions personnalise", () => {
    poser(<LegalLinks authPortalUrl={PORTAIL} cguPath="/legal/terms" />);

    expect(screen.getByRole("link", { name: "CGU" })).toHaveAttribute(
      "href",
      "https://auth.qvl.test/legal/terms",
    );
  });

  it("laisse le portail qui heberge ces pages naviguer par son routeur", () => {
    poser(
      <LegalLinks
        authPortalUrl={PORTAIL}
        renderLink={(href, label) => (
          <a data-interne href={new URL(href).pathname}>
            {label}
          </a>
        )}
      />,
    );

    const lien = screen.getByRole("link", { name: "CGU" });
    expect(lien).toHaveAttribute("data-interne");
    expect(lien).toHaveAttribute("href", "/cgu");
  });

  it("empile les liens et retourne le separateur a la verticale", () => {
    poser(<LegalLinks authPortalUrl={PORTAIL} direction="column" />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});
