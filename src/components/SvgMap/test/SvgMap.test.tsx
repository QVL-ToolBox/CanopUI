import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { SvgMap, type CanopSvgMapRegion } from "../SvgMap";

const REGIONS: CanopSvgMapRegion[] = [
  { id: "29", path: "M0 0 h10 v10 h-10 Z", name: "Finistère" },
  { id: "75", path: "M20 0 h10 v10 h-10 Z", name: "Paris" },
  { id: "13", path: "M40 0 h10 v10 h-10 Z" },
];

const RECT = { left: 0, top: 0, width: 400, height: 200 };

const TRAIT = "var(--canop-palette-text-disabled)";

beforeEach(() => {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
    ...RECT,
    right: RECT.width,
    bottom: RECT.height,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
});

afterEach(() => {
  vi.restoreAllMocks();
});

function poser(ui: React.ReactNode, locale: "fr" | "en" = "fr") {
  return render(
    <CanopThemeProvider>
      <CanopI18nProvider locale={locale}>{ui}</CanopI18nProvider>
    </CanopThemeProvider>,
  );
}

function reglesDe(element: Element): string {
  const classes = Array.from(element.classList);
  return Array.from(document.querySelectorAll("style"))
    .flatMap((noeud) => (noeud.textContent ?? "").split("}"))
    .filter((regle) => classes.some((classe) => regle.includes(`.${classe}{`)))
    .join("}");
}

function glisser(svg: Element, distance: number) {
  fireEvent.pointerDown(svg, { pointerId: 1, clientX: 100, clientY: 100 });
  fireEvent.pointerMove(window, { pointerId: 1, clientX: 100 + distance, clientY: 100 });
  fireEvent.pointerUp(window, { pointerId: 1 });
}

describe("SvgMap — le rendu", () => {
  it("dessine un tracé par région", () => {
    const { container } = poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} />);
    expect(container.querySelector("svg")!.querySelectorAll("path")).toHaveLength(3);
  });

  it("est une image tant qu'elle n'est pas sélectionnable", () => {
    poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} ariaLabel="Carte de France" />);
    expect(screen.getByRole("img", { name: "Carte de France" })).toBeInTheDocument();
  });

  it("devient un groupe dès qu'elle est sélectionnable", () => {
    poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} selectable ariaLabel="Carte" />);

    expect(screen.getByRole("group", { name: "Carte" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Finistère|Paris|13/ })).toHaveLength(3);
  });

  it("nomme une région sans nom par son identifiant", () => {
    poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} selectable />);
    expect(screen.getByRole("button", { name: "13" })).toBeInTheDocument();
  });

  it("applique la couleur demandée région par région", () => {
    const { container } = poser(
      <SvgMap
        viewBox="0 0 100 50"
        regions={REGIONS}
        fill={(id) => (id === "75" ? "rgb(255, 0, 0)" : "rgb(0, 0, 255)")}
      />,
    );
    const traces = container.querySelector("svg")!.querySelectorAll("path");
    expect(traces[1]).toHaveStyle({ fill: "rgb(255, 0, 0)" });
    expect(traces[0]).toHaveStyle({ fill: "rgb(0, 0, 255)" });
  });

  it("ne se laisse pas sélectionner sous le doigt", () => {
    const { container } = poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} />);
    const carte = container.querySelector("svg")!;

    expect(carte).toHaveStyle({ touchAction: "none", userSelect: "none" });
  });

  it("occupe toute la largeur disponible tant qu'on ne la borne pas", () => {
    const { container } = poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} />);
    const cadre = container.firstElementChild as HTMLElement;

    expect(getComputedStyle(cadre).maxWidth).not.toBe("36rem");
  });

  it("se borne quand on lui donne une largeur maximale", () => {
    const { container } = poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} maxWidth="36rem" />);
    const cadre = container.firstElementChild as HTMLElement;

    expect(cadre).toHaveStyle({ maxWidth: "36rem" });
  });

  it("traduit une hauteur maximale en largeur, au rapport de sa vue d'ensemble", () => {
    const { container } = poser(
      <SvgMap viewBox="0 0 100 50" regions={REGIONS} maxHeight="20rem" />,
    );

    expect(reglesDe(container.firstElementChild!)).toContain("calc(20rem * 2)");
  });

  it("retient la plus serrée des deux bornes quand on donne les deux", () => {
    const { container } = poser(
      <SvgMap viewBox="0 0 100 50" regions={REGIONS} maxWidth="36rem" maxHeight="20rem" />,
    );

    expect(reglesDe(container.firstElementChild!)).toContain("min(36rem, calc(20rem * 2))");
  });

  it("centre encore la carte quand seule sa hauteur est bornée", () => {
    const { container } = poser(
      <SvgMap viewBox="0 0 100 50" regions={REGIONS} maxHeight="20rem" />,
    );

    expect(reglesDe(container.firstElementChild!)).toContain("margin-inline:auto");
  });

  it("ignore une hauteur maximale que sa vue d'ensemble ne permet pas de convertir", () => {
    const { container } = poser(<SvgMap viewBox="illisible" regions={REGIONS} maxHeight="20rem" />);

    expect(reglesDe(container.firstElementChild!)).not.toContain("calc(20rem");
  });

  it("n'entoure jamais une région d'un rectangle", () => {
    const { container } = poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} selectable />);
    const trace = container.querySelector("svg")!.querySelector("path")!;

    expect(trace).toHaveStyle({ outline: "none" });
  });

  it("garde un trait qui épouse le contour de la région", () => {
    const { container } = poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} selectable />);
    const trace = container.querySelector("svg")!.querySelector("path")!;

    expect(trace).toHaveStyle({ vectorEffect: "non-scaling-stroke" });
  });

  it("contoure les régions en divider tant qu'on ne demande rien", () => {
    const { container } = poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} />);
    const trace = container.querySelector("svg")!.querySelector("path")!;

    expect(trace).toHaveStyle({ stroke: "var(--canop-palette-divider)" });
  });

  it("adopte le contour qu'on lui donne", () => {
    const { container } = poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} stroke={TRAIT} />);
    const trace = container.querySelector("svg")!.querySelector("path")!;

    expect(trace).toHaveStyle({ stroke: TRAIT });
  });

  it("ne rend pas les régions cliquables sans le demander", () => {
    const onSelect = vi.fn();
    const { container } = poser(
      <SvgMap viewBox="0 0 100 50" regions={REGIONS} onSelect={onSelect} />,
    );

    fireEvent.click(container.querySelector("svg")!.querySelectorAll("path")[0]);

    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe("SvgMap — la sélection", () => {
  it("rend la région désignée au clic", async () => {
    const onSelect = vi.fn();
    poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} selectable onSelect={onSelect} />);

    await userEvent.click(screen.getByRole("button", { name: "Paris" }));

    expect(onSelect).toHaveBeenCalledWith("75");
  });

  it("répond à Entrée et à la barre d'espace", () => {
    const onSelect = vi.fn();
    poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} selectable onSelect={onSelect} />);
    const paris = screen.getByRole("button", { name: "Paris" });

    fireEvent.keyDown(paris, { key: "Enter" });
    fireEvent.keyDown(paris, { key: " " });

    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it("ignore les autres touches", () => {
    const onSelect = vi.fn();
    poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} selectable onSelect={onSelect} />);

    fireEvent.keyDown(screen.getByRole("button", { name: "Paris" }), { key: "a" });

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("ne répond pas quand on vient de se déplacer", () => {
    const onSelect = vi.fn();
    const { container } = poser(
      <SvgMap viewBox="0 0 100 50" regions={REGIONS} selectable onSelect={onSelect} />,
    );
    const svg = container.querySelector("svg")!;

    glisser(svg, 40);
    fireEvent.click(screen.getByRole("button", { name: "Paris" }));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("répond quand le doigt a à peine bougé", () => {
    const onSelect = vi.fn();
    const { container } = poser(
      <SvgMap viewBox="0 0 100 50" regions={REGIONS} selectable onSelect={onSelect} />,
    );
    const svg = container.querySelector("svg")!;

    glisser(svg, 3);
    fireEvent.click(screen.getByRole("button", { name: "Paris" }));

    expect(onSelect).toHaveBeenCalledWith("75");
  });

  it("suit la tolérance qu'on lui donne", () => {
    const onSelect = vi.fn();
    const { container } = poser(
      <SvgMap
        viewBox="0 0 100 50"
        regions={REGIONS}
        selectable
        tapTolerance={100}
        onSelect={onSelect}
      />,
    );
    const svg = container.querySelector("svg")!;

    glisser(svg, 40);
    fireEvent.click(screen.getByRole("button", { name: "Paris" }));

    expect(onSelect).toHaveBeenCalledWith("75");
  });
});

describe("SvgMap — les gestes", () => {
  it("déplace la vue au glissement", () => {
    const { container } = poser(<SvgMap viewBox="0 0 800 400" regions={REGIONS} />);
    const svg = container.querySelector("svg")!;

    fireEvent.click(screen.getByRole("button", { name: "Zoomer" }));
    const avant = svg.getAttribute("viewBox");

    fireEvent.pointerDown(svg, { pointerId: 1, clientX: 200, clientY: 100 });
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 120, clientY: 100 });
    fireEvent.pointerUp(window, { pointerId: 1 });

    expect(svg.getAttribute("viewBox")).not.toBe(avant);
  });

  it("ne se déplace pas à la vue d'ensemble", () => {
    const { container } = poser(<SvgMap viewBox="0 0 800 400" regions={REGIONS} />);
    const svg = container.querySelector("svg")!;

    glisser(svg, -80);

    expect(svg.getAttribute("viewBox")).toBe("0 0 800 400");
  });

  it("zoome à la molette", () => {
    const { container } = poser(<SvgMap viewBox="0 0 800 400" regions={REGIONS} />);
    const svg = container.querySelector("svg")!;

    fireEvent.wheel(svg, { deltaY: -100, clientX: 200, clientY: 100 });

    expect(svg.getAttribute("viewBox")).not.toBe("0 0 800 400");
  });

  it("laisse la molette tranquille quand on le lui demande", () => {
    const { container } = poser(<SvgMap viewBox="0 0 800 400" regions={REGIONS} wheel={false} />);
    const svg = container.querySelector("svg")!;

    fireEvent.wheel(svg, { deltaY: -100, clientX: 200, clientY: 100 });

    expect(svg.getAttribute("viewBox")).toBe("0 0 800 400");
  });

  it("abandonne le geste sur annulation du pointeur", () => {
    const { container } = poser(<SvgMap viewBox="0 0 800 400" regions={REGIONS} />);
    const svg = container.querySelector("svg")!;

    fireEvent.click(screen.getByRole("button", { name: "Zoomer" }));
    fireEvent.pointerDown(svg, { pointerId: 1, clientX: 200, clientY: 100 });
    fireEvent.pointerCancel(window, { pointerId: 1 });
    const apres = svg.getAttribute("viewBox");
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 50, clientY: 100 });

    expect(svg.getAttribute("viewBox")).toBe(apres);
  });
});

describe("SvgMap — les commandes", () => {
  it("expose le zoom et le dézoom", () => {
    poser(<SvgMap viewBox="0 0 800 400" regions={REGIONS} />);
    expect(screen.getByRole("button", { name: "Zoomer" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dézoomer" })).toBeInTheDocument();
  });

  it("cache la vue d'ensemble tant qu'il n'y a rien à réinitialiser", () => {
    poser(<SvgMap viewBox="0 0 800 400" regions={REGIONS} />);
    expect(screen.queryByRole("button", { name: "Vue d'ensemble" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Zoomer" }));

    expect(screen.getByRole("button", { name: "Vue d'ensemble" })).toBeInTheDocument();
  });

  it("ramène à la vue d'ensemble", () => {
    const { container } = poser(<SvgMap viewBox="0 0 800 400" regions={REGIONS} />);
    const svg = container.querySelector("svg")!;

    fireEvent.click(screen.getByRole("button", { name: "Zoomer" }));
    fireEvent.click(screen.getByRole("button", { name: "Vue d'ensemble" }));

    expect(svg.getAttribute("viewBox")).toBe("0 0 800 400");
  });

  it("se passe de commandes quand on n'en veut pas", () => {
    poser(<SvgMap viewBox="0 0 800 400" regions={REGIONS} controls={false} />);
    expect(screen.queryByRole("button", { name: "Zoomer" })).not.toBeInTheDocument();
  });

  it("accueille un calque libre par-dessus", () => {
    poser(
      <SvgMap
        viewBox="0 0 800 400"
        regions={REGIONS}
        overlay={<button type="button">Île-de-France</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Île-de-France" })).toBeInTheDocument();
  });

  it("suit la langue courante", () => {
    poser(<SvgMap viewBox="0 0 800 400" regions={REGIONS} />, "en");
    expect(screen.getByRole("button", { name: "Zoom in" })).toBeInTheDocument();
  });
});
