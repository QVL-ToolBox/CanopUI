import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopI18nProvider, useTranslation } from "../../../i18n";
import { LanguageSelector } from "../LanguageSelector";

function CurrentLocale() {
  const { locale } = useTranslation();
  return <span data-testid="locale">{locale}</span>;
}

describe("LanguageSelector", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("ne s'affiche pas avec une seule locale disponible", () => {
    render(
      <CanopI18nProvider locale="fr">
        <LanguageSelector />
      </CanopI18nProvider>,
    );
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("porte le nom accessible du libellé i18n sur l'élément combobox", () => {
    render(
      <CanopI18nProvider locale="fr" messages={{ fr: {}, en: {} }}>
        <LanguageSelector />
      </CanopI18nProvider>,
    );
    expect(screen.getByRole("combobox", { name: "Langue" })).toBeInTheDocument();
  });

  it("traduit le nom accessible selon la locale active", () => {
    render(
      <CanopI18nProvider locale="en" messages={{ fr: {}, en: {} }}>
        <LanguageSelector />
      </CanopI18nProvider>,
    );
    expect(screen.getByRole("combobox", { name: "Language" })).toBeInTheDocument();
  });

  it("bascule la langue via la liste déroulante et persiste le choix", async () => {
    const user = userEvent.setup();
    render(
      <CanopI18nProvider locale="fr" messages={{ fr: {}, en: {} }}>
        <LanguageSelector />
        <CurrentLocale />
      </CanopI18nProvider>,
    );

    expect(screen.getByTestId("locale")).toHaveTextContent("fr");
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "EN" }));
    expect(screen.getByTestId("locale")).toHaveTextContent("en");
    expect(window.localStorage.getItem("canop-locale")).toBe("en");
  });
});
