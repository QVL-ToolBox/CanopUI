import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopI18nProvider } from "../../../i18n";
import { Lives } from "../Lives";

function poser(ui: React.ReactNode, locale: "fr" | "en" = "fr") {
  return render(<CanopI18nProvider locale={locale}>{ui}</CanopI18nProvider>);
}

describe("Lives", () => {
  it("annonce le compte en toutes lettres", () => {
    poser(<Lives value={3} max={10} />);
    expect(screen.getByRole("img", { name: "3 vies restantes sur 10" })).toBeInTheDocument();
  });

  it("dessine une case par vie de départ", () => {
    const { container } = poser(<Lives value={2} max={5} />);
    expect(container.querySelectorAll("svg")).toHaveLength(5);
  });

  it("masque les icônes de l'arbre d'accessibilité", () => {
    const { container } = poser(<Lives value={2} max={5} />);
    for (const svg of container.querySelectorAll("svg")) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("borne une valeur aberrante au lieu de dessiner n'importe quoi", () => {
    poser(<Lives value={99} max={3} />);
    expect(screen.getByRole("img", { name: "3 vies restantes sur 3" })).toBeInTheDocument();

    poser(<Lives value={-4} max={3} />);
    expect(screen.getByRole("img", { name: "0 vie restante sur 3" })).toBeInTheDocument();
  });

  it("ne dessine rien pour un maximum nul", () => {
    const { container } = poser(<Lives value={0} max={0} />);
    expect(container.querySelectorAll("svg")).toHaveLength(0);
  });

  it("suit la langue courante", () => {
    poser(<Lives value={1} max={2} />, "en");
    expect(screen.getByRole("img", { name: "1 life left out of 2" })).toBeInTheDocument();
  });

  it("accepte un nom accessible imposé", () => {
    poser(<Lives value={1} max={2} ariaLabel="Une vie, plus qu'une" />);
    expect(screen.getByRole("img", { name: "Une vie, plus qu'une" })).toBeInTheDocument();
  });
});

function battements(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("[data-beat]")).map(
    (element) => element.getAttribute("data-beat") ?? "",
  );
}

describe("Lives — la perte d'une vie", () => {
  it("fond la couleur d'un cœur à l'autre", () => {
    const { container } = poser(<Lives value={3} max={3} />);
    const premier = container.querySelector("[data-beat]") as HTMLElement;

    expect(getComputedStyle(premier).transition).toContain("color");
  });

  it("fait battre le cœur qui vient de s'éteindre, et lui seul", () => {
    const { rerender, container } = poser(<Lives value={3} max={3} />);

    rerender(
      <CanopI18nProvider locale="fr">
        <Lives value={2} max={3} />
      </CanopI18nProvider>,
    );

    expect(battements(container)).toEqual(["off", "off", "on"]);
  });

  it("ne fait battre personne au premier affichage", () => {
    const { container } = poser(<Lives value={3} max={10} />);
    expect(battements(container)).not.toContain("on");
  });

  it("ne fait rien battre quand on refait le plein", () => {
    const { rerender, container } = poser(<Lives value={1} max={3} />);

    rerender(
      <CanopI18nProvider locale="fr">
        <Lives value={3} max={3} />
      </CanopI18nProvider>,
    );

    expect(battements(container)).not.toContain("on");
  });

  it("ne bat ni ne fond quand on ne le lui demande pas", () => {
    const { rerender, container } = poser(<Lives value={3} max={3} animated={false} />);

    rerender(
      <CanopI18nProvider locale="fr">
        <Lives value={2} max={3} animated={false} />
      </CanopI18nProvider>,
    );
    const premier = container.querySelector("[data-beat]") as HTMLElement;

    expect(battements(container)).not.toContain("on");
    expect(getComputedStyle(premier).transition).not.toContain("color");
  });
});
