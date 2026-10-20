import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "..";
import { Input } from "../../components/Input";
import { InlineInput } from "../../components/InlineInput";

function reglesDAutofill(): CSSStyleRule[] {
  const trouvees: CSSStyleRule[] = [];
  for (const feuille of Array.from(document.styleSheets)) {
    for (const regle of Array.from(feuille.cssRules)) {
      if (!(regle instanceof CSSStyleRule)) continue;
      if (regle.selectorText.includes("-webkit-autofill")) trouvees.push(regle);
    }
  }
  return trouvees;
}

describe("champ pre-rempli par le navigateur", () => {
  it("recouvre le fond de l'agent utilisateur par une ombre interne", () => {
    render(
      <CanopThemeProvider>
        <Input label="Telephone" value="" onChange={() => {}} />
      </CanopThemeProvider>,
    );

    const ombres = reglesDAutofill()
      .map((regle) => regle.style.getPropertyValue("box-shadow"))
      .filter((valeur) => valeur !== "");

    expect(ombres.length).toBeGreaterThan(0);
    for (const ombre of ombres) {
      expect(ombre).toContain("inset");
      expect(ombre).toContain("--canop-input-autofill");
    }
  });

  it("impose la couleur du texte, que le navigateur repeint aussi", () => {
    render(
      <CanopThemeProvider>
        <Input label="Telephone" value="" onChange={() => {}} />
      </CanopThemeProvider>,
    );

    const couleurs = reglesDAutofill()
      .map((regle) => regle.style.getPropertyValue("-webkit-text-fill-color"))
      .filter((valeur) => valeur !== "");

    expect(couleurs.length).toBeGreaterThan(0);
    expect(couleurs[0]).toContain("--canop-palette-text-primary");
  });

  it("couvre les quatre etats que Chrome repeint", () => {
    render(
      <CanopThemeProvider>
        <Input label="Telephone" value="" onChange={() => {}} />
      </CanopThemeProvider>,
    );

    const selecteurs = reglesDAutofill()
      .map((regle) => regle.selectorText)
      .join(" ");

    for (const etat of [":hover", ":focus", ":active"]) {
      expect(selecteurs).toContain("-webkit-autofill" + etat);
    }
  });

  it("donne a InlineInput le fond de la page, et non la teinte des champs contoures", () => {
    const { container } = render(
      <CanopThemeProvider>
        <InlineInput
          value="Dupont"
          onChange={() => {}}
          onCommit={() => {}}
          onCancel={() => {}}
          ariaLabel="Nom"
        />
      </CanopThemeProvider>,
    );

    const racine = container.querySelector(".MuiInputBase-root") as HTMLElement;
    expect(getComputedStyle(racine).getPropertyValue("--canop-input-autofill")).toContain(
      "--canop-palette-background-paper",
    );
  });

  it("laisse le champ atteignable, la regle ne changeant que la peinture", () => {
    render(
      <CanopThemeProvider>
        <Input label="Telephone" value="" onChange={() => {}} />
      </CanopThemeProvider>,
    );

    expect(screen.getByLabelText("Telephone")).toBeEnabled();
  });
});
