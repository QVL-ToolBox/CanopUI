import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Icon, type CanopIconSize } from "../../Icon";
import { Rating, type CanopRatingColor } from "../Rating";
import { ratingTextVariant } from "../ratingHelpers";

const colors: CanopRatingColor[] = ["primary", "secondary", "accent", "success", "warning"];
const sizes: CanopIconSize[] = ["xs", "sm", "md", "lg", "xl"];
const decimalCases = [0, 0.05, 1, 2.44, 3.999, 4.15, 4.25, 4.35, 4.949, 5, 7, -2, NaN];

function renderRating(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function ratingRootOf(container: HTMLElement) {
  return container.querySelector(".MuiRating-root") as HTMLElement;
}

function starGroupsOf(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(".MuiRating-decimal"));
}

function fullStarsOf(container: HTMLElement) {
  return starGroupsOf(container).filter(
    (group) => group.lastElementChild?.querySelector(".MuiRating-iconFilled") !== null,
  );
}

function clippedStarsOf(container: HTMLElement) {
  return starGroupsOf(container)
    .flatMap((group) => Array.from(group.children) as HTMLElement[])
    .filter((item) => item.style.width !== "" && parseFloat(item.style.width) > 0);
}

function clipRatioOf(item: HTMLElement) {
  return parseFloat(item.style.width) / 100;
}

function filledRatioOf(container: HTMLElement) {
  return clippedStarsOf(container).reduce(
    (total, item) => total + clipRatioOf(item),
    fullStarsOf(container).length,
  );
}

function displayedValueOf(container: HTMLElement) {
  return Number(container.textContent);
}

function starIconsOf(container: HTMLElement) {
  return Array.from(container.querySelectorAll<SVGElement>(".MuiRating-icon svg"));
}

function iconWidthOf(container: HTMLElement) {
  return starIconsOf(container)[0]?.getAttribute("width");
}

function emptyStarOf(container: HTMLElement) {
  return container.querySelector(".MuiRating-iconEmpty") as HTMLElement;
}

function filledStarOf(container: HTMLElement) {
  return container.querySelector(".MuiRating-iconFilled") as HTMLElement;
}

type StyleRuleLocation = { sheet: CSSStyleSheet; index: number; cssText: string };

function takeRulesContaining(fragment: string): StyleRuleLocation[] {
  const located = Array.from(document.styleSheets).flatMap((sheet) =>
    Array.from(sheet.cssRules)
      .map((rule, index) => ({ sheet, index, cssText: rule.cssText }))
      .filter((entry) => entry.cssText.includes(fragment)),
  );
  [...located].reverse().forEach((entry) => entry.sheet.deleteRule(entry.index));
  return located;
}

function restoreStyleRules(located: StyleRuleLocation[]) {
  located.forEach((entry) => entry.sheet.insertRule(entry.cssText, entry.index));
}

function typographyVariantOf(element: Element) {
  return element.className.toString().match(/MuiTypography-(caption|body1|body2)/)?.[1];
}

describe("Rating - rendu fractionnaire", () => {
  it("rend quatre étoiles pleines et une étoile remplie à 30% pour une note de 4.3", () => {
    const { container } = renderRating(<Rating value={4.3} />);
    expect(starGroupsOf(container)).toHaveLength(5);
    expect(fullStarsOf(container)).toHaveLength(4);
    const clipped = clippedStarsOf(container);
    expect(clipped).toHaveLength(1);
    expect(clipRatioOf(clipped[0]) * 100).toBeCloseTo(30, 6);
  });

  it("place l'étoile pleine dans l'item clippé et l'étoile vide sur toute la largeur", () => {
    const { container } = renderRating(<Rating value={4.3} />);
    const [clipped] = clippedStarsOf(container);
    expect(clipped.querySelector(".MuiRating-iconFilled")).not.toBeNull();
    expect(clipped.querySelector(".MuiRating-iconEmpty")).toBeNull();
    expect(clipped.style.overflow).toBe("hidden");
    const group = clipped.parentElement as HTMLElement;
    expect(group.lastElementChild?.querySelector(".MuiRating-iconEmpty")).not.toBeNull();
  });

  it("fait varier la largeur du clip avec la décimale de la note", () => {
    const troisDixiemes = renderRating(<Rating value={4.3} />);
    const septDixiemes = renderRating(<Rating value={4.7} />);
    expect(clipRatioOf(clippedStarsOf(troisDixiemes.container)[0]) * 100).toBeCloseTo(30, 6);
    expect(clipRatioOf(clippedStarsOf(septDixiemes.container)[0]) * 100).toBeCloseTo(70, 6);
  });

  it("ne se contente pas d'un arrondi à l'étoile entière pour une note de 4.3", () => {
    const { container } = renderRating(<Rating value={4.3} />);
    expect(filledRatioOf(container)).toBeCloseTo(4.3, 6);
    expect(filledRatioOf(container)).not.toBe(4);
    expect(filledRatioOf(container)).not.toBe(5);
  });

  it("ne clippe aucune étoile pour une note entière", () => {
    const { container } = renderRating(<Rating value={4} />);
    expect(fullStarsOf(container)).toHaveLength(4);
    expect(clippedStarsOf(container)).toHaveLength(0);
  });
});

describe("Rating - cas limites de la note", () => {
  it("ne remplit aucune étoile pour une note nulle", () => {
    const { container } = renderRating(<Rating value={0} />);
    expect(fullStarsOf(container)).toHaveLength(0);
    expect(clippedStarsOf(container)).toHaveLength(0);
    expect(container.querySelectorAll(".MuiRating-iconFilled")).toHaveLength(0);
  });

  it("remplit toutes les étoiles pour une note égale au max", () => {
    const { container } = renderRating(<Rating value={5} />);
    expect(fullStarsOf(container)).toHaveLength(5);
    expect(container.querySelectorAll(".MuiRating-iconEmpty")).toHaveLength(0);
  });

  it("borne une note supérieure au max", () => {
    const { container } = renderRating(<Rating value={7} showValue />);
    expect(fullStarsOf(container)).toHaveLength(5);
    expect(displayedValueOf(container)).toBe(5);
    expect(ratingRootOf(container)).toHaveAttribute("aria-label", "5.0/5");
  });

  it("ramène une note négative à zéro", () => {
    const { container } = renderRating(<Rating value={-2} showValue />);
    expect(fullStarsOf(container)).toHaveLength(0);
    expect(displayedValueOf(container)).toBe(0);
    expect(ratingRootOf(container)).toHaveAttribute("aria-label", "0.0/5");
  });

  it("ramène une note non numérique à zéro", () => {
    const { container } = renderRating(<Rating value={NaN} showValue />);
    expect(fullStarsOf(container)).toHaveLength(0);
    expect(displayedValueOf(container)).toBe(0);
    expect(ratingRootOf(container)).toHaveAttribute("aria-label", "0.0/5");
  });

  it.each([Infinity, -Infinity])("ne lève aucune erreur pour une note non finie %s", (value) => {
    expect(() => renderRating(<Rating value={value} showValue />)).not.toThrow();
  });
});

describe("Rating - cas limites du nombre d'étoiles", () => {
  it("rend autant de groupes d'étoiles que le max fourni", () => {
    const { container } = renderRating(<Rating value={7.5} max={10} showValue />);
    expect(starGroupsOf(container)).toHaveLength(10);
    expect(fullStarsOf(container)).toHaveLength(7);
    expect(clipRatioOf(clippedStarsOf(container)[0]) * 100).toBeCloseTo(50, 6);
    expect(ratingRootOf(container)).toHaveAttribute("aria-label", "7.5/10");
  });

  it("rend cinq groupes d'étoiles par défaut", () => {
    const { container } = renderRating(<Rating value={3} />);
    expect(starGroupsOf(container)).toHaveLength(5);
  });

  it.each([0, -3])("ne lève aucune erreur pour un max de %s", (max) => {
    expect(() => renderRating(<Rating value={3} max={max} />)).not.toThrow();
  });

  it.each([0, -3])("ramène un max de %s à une étoile unique", (max) => {
    const { container } = renderRating(<Rating value={3} max={max} showValue />);
    expect(starGroupsOf(container)).toHaveLength(1);
    expect(displayedValueOf(container)).toBe(1);
    expect(ratingRootOf(container)).toHaveAttribute("aria-label", "1.0/1");
  });
});

describe("Rating - concordance de la note affichée et du remplissage", () => {
  it.each(decimalCases)(
    "fait concorder la valeur affichée et le taux de remplissage pour une note de %s",
    (value) => {
      const { container } = renderRating(<Rating value={value} showValue />);
      expect(filledRatioOf(container)).toBeCloseTo(displayedValueOf(container), 6);
    },
  );

  it.each([0, 4.44, 7.5, 9.95, 10, 12])(
    "fait concorder la valeur affichée et le taux de remplissage sur dix étoiles pour %s",
    (value) => {
      const { container } = renderRating(<Rating value={value} max={10} showValue />);
      expect(filledRatioOf(container)).toBeCloseTo(displayedValueOf(container), 6);
    },
  );

  it("fait concorder la valeur affichée et l'annonce accessible", () => {
    const { container } = renderRating(<Rating value={4.25} showValue />);
    const announced = ratingRootOf(container).getAttribute("aria-label") ?? "";
    expect(announced).toBe(`${container.textContent}/5`);
  });

  it("détecte une discordance entre la valeur affichée et le taux de remplissage", () => {
    const affichee = renderRating(<Rating value={4.3} showValue />);
    const remplie = renderRating(<Rating value={3.1} showValue />);
    expect(displayedValueOf(affichee.container)).toBeCloseTo(4.3, 6);
    expect(filledRatioOf(remplie.container)).toBeCloseTo(3.1, 6);
    expect(filledRatioOf(remplie.container)).not.toBeCloseTo(
      displayedValueOf(affichee.container),
      1,
    );
  });

  it("affiche la note arrondie au dixième", () => {
    const { container } = renderRating(<Rating value={2.449999} showValue />);
    expect(container).toHaveTextContent("2.4");
  });
});

describe("Rating - clip de l'étoile partielle", () => {
  it("empêche l'écrasement de l'étoile dans le conteneur clippé", () => {
    const { container } = renderRating(<Rating value={4.3} />);
    const [clipped] = clippedStarsOf(container);
    const icon = clipped.querySelector("svg") as SVGElement;
    expect(getComputedStyle(icon).flexShrink).toBe("0");
  });

  it("empêche l'écrasement de toutes les étoiles, pleines comme vides", () => {
    const { container } = renderRating(<Rating value={4.3} />);
    const shrinks = starIconsOf(container).map((icon) => getComputedStyle(icon).flexShrink);
    expect(shrinks.length).toBeGreaterThan(0);
    expect(new Set(shrinks)).toEqual(new Set(["0"]));
  });

  it("distingue l'étoile du Rating de la même icône rendue hors Rating, restée compressible", () => {
    const { container } = renderRating(<Icon name="star" />);
    const icon = container.querySelector("svg") as SVGElement;
    expect(getComputedStyle(icon).flexShrink).toBe("1");
  });
});

describe("Rating - discriminance du verrou de clip", () => {
  it("mesure un écrasement de l'étoile dès que la règle flex-shrink est retirée", () => {
    const { container } = renderRating(<Rating value={4.3} />);
    const icon = starIconsOf(container)[0];
    expect(getComputedStyle(icon).flexShrink).toBe("0");
    const removed = takeRulesContaining("flex-shrink");
    try {
      expect(removed.length).toBeGreaterThan(0);
      expect(getComputedStyle(icon).flexShrink).toBe("1");
    } finally {
      restoreStyleRules(removed);
    }
    expect(getComputedStyle(icon).flexShrink).toBe("0");
  });
});

describe("Rating - accessibilité", () => {
  it("expose la note comme une image", () => {
    renderRating(<Rating value={4.3} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("annonce la note et le max sans libellé", () => {
    renderRating(<Rating value={4.3} />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "4.3/5");
  });

  it("préfixe l'annonce par le libellé fourni", () => {
    renderRating(<Rating value={4.3} label="Ambiance" />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "Ambiance 4.3/5");
  });

  it("ne rend aucun bouton radio", () => {
    const { container } = renderRating(<Rating value={4.3} />);
    expect(container.querySelectorAll("input[type=radio]")).toHaveLength(0);
    expect(container.querySelectorAll("input")).toHaveLength(0);
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
  });

  it("ne rend aucun libellé cliquable", () => {
    const { container } = renderRating(<Rating value={4.3} label="Ambiance" />);
    expect(container.querySelectorAll("label")).toHaveLength(0);
  });

  it("masque chaque étoile aux technologies d'assistance", () => {
    const { container } = renderRating(<Rating value={4.3} />);
    const hidden = starIconsOf(container).map((icon) => icon.getAttribute("aria-hidden"));
    expect(new Set(hidden)).toEqual(new Set(["true"]));
  });
});

describe("Rating - libellé et valeur affichée", () => {
  it("affiche le libellé fourni", () => {
    renderRating(<Rating value={4.3} label="Ambiance" />);
    expect(screen.getByText("Ambiance")).toBeInTheDocument();
  });

  it("n'affiche aucune valeur par défaut", () => {
    const { container } = renderRating(<Rating value={4.3} />);
    expect(container.textContent).toBe("");
  });

  it("affiche la valeur quand showValue est actif", () => {
    renderRating(<Rating value={4.3} showValue />);
    expect(screen.getByText("4.3")).toBeInTheDocument();
  });

  it("affiche le libellé avant la valeur", () => {
    renderRating(<Rating value={4.3} label="Ambiance" showValue />);
    const label = screen.getByText("Ambiance");
    const value = screen.getByText("4.3");
    expect(label.compareDocumentPosition(value) & Node.DOCUMENT_POSITION_FOLLOWING).toBeGreaterThan(
      0,
    );
  });

  it("affiche la valeur même sans libellé", () => {
    const { container } = renderRating(<Rating value={4.3} showValue />);
    expect(container.textContent).toBe("4.3");
  });
});

describe("Rating - couleurs", () => {
  it.each(colors)("pose la variable de palette %s sur les étoiles pleines", (color) => {
    const { container } = renderRating(<Rating value={4.3} color={color} />);
    expect(container.querySelector(".MuiRating-iconFilled")).toHaveStyle({
      color: `var(--canop-palette-${color}-main)`,
    });
  });

  it("utilise la couleur accent par défaut", () => {
    const { container } = renderRating(<Rating value={4.3} />);
    expect(container.querySelector(".MuiRating-iconFilled")).toHaveStyle({
      color: "var(--canop-palette-accent-main)",
    });
  });

  it("attribue une couleur distincte à chacune des cinq déclinaisons", () => {
    const resolved = colors.map((color) => {
      const { container, unmount } = renderRating(<Rating value={4.3} color={color} />);
      const filled = container.querySelector(".MuiRating-iconFilled") as HTMLElement;
      const resolvedColor = getComputedStyle(filled).color;
      unmount();
      return resolvedColor;
    });
    expect(new Set(resolved).size).toBe(colors.length);
  });
});

describe("Rating - teinte atténuée des étoiles vides", () => {
  it.each(colors)("atténue la variable de palette %s sur les étoiles vides", (color) => {
    const { container } = renderRating(<Rating value={4.3} color={color} />);
    expect(emptyStarOf(container)).toHaveStyle({
      color: `color-mix(in srgb, var(--canop-palette-${color}-main) 26%, transparent)`,
    });
  });

  it("atténue la couleur accent par défaut", () => {
    const { container } = renderRating(<Rating value={4.3} />);
    expect(emptyStarOf(container)).toHaveStyle({
      color: "color-mix(in srgb, var(--canop-palette-accent-main) 26%, transparent)",
    });
  });

  it("dérive la teinte de l'étoile vide de la couleur choisie sans la confondre avec l'étoile pleine", () => {
    const { container } = renderRating(<Rating value={4.3} color="primary" />);
    const empty = getComputedStyle(emptyStarOf(container)).color;
    const filled = getComputedStyle(filledStarOf(container)).color;
    expect(empty).toContain("var(--canop-palette-primary-main)");
    expect(filled).toBe("var(--canop-palette-primary-main)");
    expect(empty).not.toBe(filled);
  });

  it("attribue une teinte atténuée distincte à chacune des cinq déclinaisons", () => {
    const resolved = colors.map((color) => {
      const { container, unmount } = renderRating(<Rating value={4.3} color={color} />);
      const resolvedColor = getComputedStyle(emptyStarOf(container)).color;
      unmount();
      return resolvedColor;
    });
    expect(new Set(resolved).size).toBe(colors.length);
  });
});

describe("Rating - discriminance de la teinte atténuée", () => {
  it("perd la teinte dérivée de la couleur choisie dès que la règle iconEmpty est retirée", () => {
    const { container } = renderRating(<Rating value={4.3} color="primary" />);
    const empty = emptyStarOf(container);
    const attenuated = "color-mix(in srgb, var(--canop-palette-primary-main) 26%, transparent)";
    expect(getComputedStyle(empty).color).toBe(attenuated);
    const removed = takeRulesContaining(".MuiRating-iconEmpty");
    try {
      expect(removed.length).toBeGreaterThan(0);
      expect(getComputedStyle(empty).color).not.toBe(attenuated);
      expect(getComputedStyle(empty).color).not.toContain("--canop-palette-primary-main");
    } finally {
      restoreStyleRules(removed);
    }
    expect(getComputedStyle(empty).color).toBe(attenuated);
  });
});

describe("Rating - tailles", () => {
  it("utilise la taille sm par défaut", () => {
    const parDefaut = renderRating(<Rating value={4.3} />);
    const explicite = renderRating(<Rating value={4.3} size="sm" />);
    expect(iconWidthOf(parDefaut.container)).toBe(iconWidthOf(explicite.container));
  });

  it("agrandit l'étoile à chaque palier de taille", () => {
    const widths = sizes.map((size) => {
      const { container, unmount } = renderRating(<Rating value={4.3} size={size} />);
      const width = iconWidthOf(container);
      unmount();
      return width;
    });
    expect(new Set(widths).size).toBe(sizes.length);
  });

  it.each(sizes)("aligne la typographie de la valeur sur la taille %s", (size) => {
    renderRating(<Rating value={4.3} size={size} label="Ambiance" showValue />);
    expect(typographyVariantOf(screen.getByText("4.3"))).toBe(ratingTextVariant(size));
    expect(typographyVariantOf(screen.getByText("Ambiance"))).toBe(ratingTextVariant(size));
  });
});
