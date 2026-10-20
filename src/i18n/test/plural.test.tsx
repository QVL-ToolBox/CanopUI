import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../theme";
import { CanopI18nProvider } from "../CanopI18nProvider";
import { createTranslate } from "../CanopI18nContext";
import { canopBaseMessages, type CanopLocale } from "../messages";
import { Lives } from "../../components/Lives";

function traduire(locale: CanopLocale) {
  return createTranslate(canopBaseMessages[locale], locale);
}

const vies = (locale: CanopLocale, count: number) =>
  traduire(locale)("canop.lives.label", { count, max: 3 });

describe("i18n — pluriel", () => {
  it("range zéro au singulier en français", () => {
    expect(vies("fr", 0)).toBe("0 vie restante sur 3");
  });

  it("range zéro au pluriel en anglais", () => {
    expect(vies("en", 0)).toBe("0 lives left out of 3");
  });

  it("range un au singulier dans les deux langues", () => {
    expect(vies("fr", 1)).toBe("1 vie restante sur 3");
    expect(vies("en", 1)).toBe("1 life left out of 3");
  });

  it("range deux au pluriel dans les deux langues", () => {
    expect(vies("fr", 2)).toBe("2 vies restantes sur 3");
    expect(vies("en", 2)).toBe("2 lives left out of 3");
  });

  it("sert la clé nue quand elle n'a pas de variante", () => {
    const t = createTranslate({ "app.panier": "{count} article(s)" }, "fr");
    expect(t("app.panier", { count: 2 })).toBe("2 article(s)");
  });

  it("sert la clé nue quand aucun count n'est donné", () => {
    const t = createTranslate(
      {
        "app.vie": "vies",
        "app.vie.one": "{count} vie",
        "app.vie.other": "{count} vies",
      },
      "fr",
    );
    expect(t("app.vie")).toBe("vies");
  });

  it("laisse canop.selectionBar.selected rendre la même chaîne qu'avant", () => {
    expect(traduire("fr")("canop.selectionBar.selected", { count: 3 })).toBe("3 sélectionné(s)");
    expect(traduire("en")("canop.selectionBar.selected", { count: 3 })).toBe("3 selected");
  });

  it("fait accorder Lives sur le nombre de vies restantes", () => {
    render(
      <CanopThemeProvider>
        <CanopI18nProvider locale="fr">
          <Lives value={1} max={2} />
        </CanopI18nProvider>
      </CanopThemeProvider>,
    );
    expect(screen.getByLabelText("1 vie restante sur 2")).toBeInTheDocument();
  });
});
