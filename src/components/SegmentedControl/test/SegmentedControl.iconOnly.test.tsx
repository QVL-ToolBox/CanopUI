import { describe, expect, expectTypeOf, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Icon } from "../../Icon";
import type { CanopIconName } from "../../Icon";
import { SegmentedControl } from "../SegmentedControl";
import type {
  CanopSegmentedControlIconOption,
  CanopSegmentedControlProps,
  CanopSegmentedControlSize,
} from "../SegmentedControl";
import type { CanopSegmentedControlIconOption as PublicIconOption } from "../../../index";

type ViewValue = "grid" | "list";

const iconOptions: CanopSegmentedControlIconOption<ViewValue>[] = [
  { value: "grid", label: "Grille", icon: "apps" },
  { value: "list", label: "Liste", icon: "menu" },
];

const sizeInRem: Record<CanopSegmentedControlSize, number> = { small: 2, medium: 2.5 };

function renderInTheme(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function renderIconOnly(value: ViewValue = "grid", size?: CanopSegmentedControlSize) {
  return renderInTheme(
    <SegmentedControl
      iconOnly
      options={iconOptions}
      value={value}
      size={size}
      onChange={() => undefined}
      ariaLabel="Affichage"
    />,
  );
}

function renderLabeled(size?: CanopSegmentedControlSize) {
  return renderInTheme(
    <SegmentedControl
      options={iconOptions}
      value="grid"
      size={size}
      onChange={() => undefined}
      ariaLabel="Affichage"
    />,
  );
}

function iconPaths(root: Element) {
  return Array.from(root.querySelectorAll("svg path")).map((path) => path.getAttribute("d"));
}

function referenceIconPaths(name: CanopIconName, variant: "solid" | "outline") {
  const { container, unmount } = render(<Icon name={name} variant={variant} />);
  const paths = iconPaths(container);
  unmount();
  return paths;
}

function cssRulesOf(element: Element) {
  const generatedClasses = Array.from(element.classList).filter((name) => name.startsWith("css-"));
  return Array.from(document.styleSheets)
    .flatMap((sheet) => Array.from(sheet.cssRules))
    .map((rule) => rule.cssText)
    .filter((text) => generatedClasses.some((name) => text.includes(`.${name}`)));
}

function declaration(element: Element, property: string) {
  const pattern = new RegExp(`(?:^|[;{\\s])${property}:\\s*([^;]+);`);
  const match = cssRulesOf(element)
    .map((text) => pattern.exec(text))
    .find((found) => found !== null);
  return match ? match[1].trim() : undefined;
}

function backgroundShapeRadius(group: Element) {
  const before = cssRulesOf(group).find((text) => text.includes("::before"));
  return before ? /polygon\(0% min\(([^,]+),/.exec(before)?.[1] : undefined;
}

function remValue(length: string | undefined) {
  return Number(length?.replace("rem", ""));
}

function pillIn(radio: HTMLElement) {
  return radio.querySelector("span[aria-hidden]") as HTMLElement | null;
}

describe("SegmentedControl iconOnly", () => {
  describe("accessibilité des segments", () => {
    it("rend chaque option comme un radio nommé par son label", () => {
      renderIconOnly();
      expect(screen.getAllByRole("radio")).toHaveLength(2);
      expect(screen.getByRole("radio", { name: "Grille" })).toHaveAttribute("aria-label", "Grille");
      expect(screen.getByRole("radio", { name: "Liste" })).toHaveAttribute("aria-label", "Liste");
    });

    it("n'affiche aucun texte visible dans les segments", () => {
      renderIconOnly();
      for (const radio of screen.getAllByRole("radio")) {
        expect(radio.textContent).toBe("");
      }
      expect(screen.queryByText("Grille")).not.toBeInTheDocument();
      expect(screen.queryByText("Liste")).not.toBeInTheDocument();
    });

    it("conserve le nom accessible quand la sélection change", () => {
      const { rerender } = renderIconOnly("grid");
      rerender(
        <CanopThemeProvider>
          <SegmentedControl
            iconOnly
            options={iconOptions}
            value="list"
            onChange={() => undefined}
            ariaLabel="Affichage"
          />
        </CanopThemeProvider>,
      );
      expect(screen.getByRole("radio", { name: "Liste" })).toHaveAttribute("aria-checked", "true");
      expect(screen.getByRole("radio", { name: "Grille" })).toHaveAttribute(
        "aria-checked",
        "false",
      );
    });
  });

  describe("variante d'icône", () => {
    it("affiche l'icône pleine sur le segment sélectionné", () => {
      renderIconOnly("grid");
      expect(iconPaths(screen.getByRole("radio", { name: "Grille" }))).toEqual(
        referenceIconPaths("apps", "solid"),
      );
    });

    it("affiche l'icône contour sur le segment non sélectionné", () => {
      renderIconOnly("grid");
      expect(iconPaths(screen.getByRole("radio", { name: "Liste" }))).toEqual(
        referenceIconPaths("menu", "outline"),
      );
    });

    it("inverse les variantes quand l'autre segment devient sélectionné", () => {
      renderIconOnly("list");
      expect(iconPaths(screen.getByRole("radio", { name: "Liste" }))).toEqual(
        referenceIconPaths("menu", "solid"),
      );
      expect(iconPaths(screen.getByRole("radio", { name: "Grille" }))).toEqual(
        referenceIconPaths("apps", "outline"),
      );
    });

    it("distingue réellement les variantes pleine et contour", () => {
      expect(referenceIconPaths("apps", "solid")).not.toEqual(
        referenceIconPaths("apps", "outline"),
      );
    });
  });

  describe("géométrie", () => {
    it.each([
      ["small", "2rem"],
      ["medium", "2.5rem"],
    ] as const)("rend des segments carrés de %s à %s de côté", (size, side) => {
      renderIconOnly("grid", size);
      for (const radio of screen.getAllByRole("radio")) {
        expect(getComputedStyle(radio).minHeight).toBe(side);
        expect(getComputedStyle(radio).minWidth).toBe(side);
        expect(declaration(radio, "padding")).toBe("0px");
      }
    });

    it("utilise la taille medium par défaut", () => {
      renderIconOnly("grid");
      expect(getComputedStyle(screen.getAllByRole("radio")[0]).minHeight).toBe("2.5rem");
      expect(getComputedStyle(screen.getAllByRole("radio")[0]).minWidth).toBe("2.5rem");
    });

    it.each(["small", "medium"] as const)(
      "dessine un conteneur en forme de pilule en taille %s",
      (size) => {
        renderIconOnly("grid", size);
        const group = screen.getByRole("radiogroup");
        const padding = remValue(declaration(group, "padding"));
        const containerHeight = sizeInRem[size] + 2 * padding;
        expect(remValue(backgroundShapeRadius(group))).toBeGreaterThanOrEqual(containerHeight / 2);
      },
    );

    it("dessine une pastille en forme de pilule", () => {
      renderIconOnly("grid");
      const pill = pillIn(screen.getByRole("radio", { name: "Grille" })) as HTMLElement;
      expect(pill.style.clipPath).toContain("var(--canop-radius-pill)");
    });
  });

  describe("typage", () => {
    it("refuse une option sans icône en mode iconOnly", () => {
      expectTypeOf<{
        iconOnly: true;
        options: { value: ViewValue; label: string }[];
        value: ViewValue;
        onChange: (value: ViewValue) => void;
        ariaLabel: string;
      }>().not.toExtend<CanopSegmentedControlProps<ViewValue>>();
    });

    it("accepte des options portant toutes une icône en mode iconOnly", () => {
      expectTypeOf<{
        iconOnly: true;
        options: CanopSegmentedControlIconOption<ViewValue>[];
        value: ViewValue;
        onChange: (value: ViewValue) => void;
        ariaLabel: string;
      }>().toExtend<CanopSegmentedControlProps<ViewValue>>();
    });

    it("accepte une option sans icône hors mode iconOnly", () => {
      expectTypeOf<{
        options: { value: ViewValue; label: string }[];
        value: ViewValue;
        onChange: (value: ViewValue) => void;
        ariaLabel: string;
      }>().toExtend<CanopSegmentedControlProps<ViewValue>>();
    });

    it("exige l'icône dans le type d'option iconOnly", () => {
      expectTypeOf<{ value: ViewValue; label: string }>().not.toExtend<
        CanopSegmentedControlIconOption<ViewValue>
      >();
      expectTypeOf<
        CanopSegmentedControlIconOption<ViewValue>["icon"]
      >().toEqualTypeOf<CanopIconName>();
    });
  });

  describe("export public", () => {
    it("expose CanopSegmentedControlIconOption depuis le point d'entrée de la librairie", () => {
      expectTypeOf<PublicIconOption<ViewValue>>().toEqualTypeOf<
        CanopSegmentedControlIconOption<ViewValue>
      >();
    });
  });
});

describe("SegmentedControl sans iconOnly", () => {
  it("affiche les libellés visibles des options", () => {
    renderLabeled();
    expect(within(screen.getByRole("radio", { name: "Grille" })).getByText("Grille")).toBeVisible();
    expect(within(screen.getByRole("radio", { name: "Liste" })).getByText("Liste")).toBeVisible();
  });

  it("affiche les icônes en variante contour, y compris sur l'option sélectionnée", () => {
    renderLabeled();
    expect(iconPaths(screen.getByRole("radio", { name: "Grille" }))).toEqual(
      referenceIconPaths("apps", "outline"),
    );
    expect(iconPaths(screen.getByRole("radio", { name: "Liste" }))).toEqual(
      referenceIconPaths("menu", "outline"),
    );
  });

  it("dessine le conteneur au rayon lg", () => {
    renderLabeled();
    expect(backgroundShapeRadius(screen.getByRole("radiogroup"))).toBe("var(--canop-radius-lg)");
  });

  it("ne force pas de segments carrés", () => {
    renderLabeled("small");
    for (const radio of screen.getAllByRole("radio")) {
      expect(getComputedStyle(radio).minWidth).not.toBe("2rem");
    }
  });
});

describe("plusieurs SegmentedControl sur la même page", () => {
  function renderPair(firstValue: ViewValue, secondValue: ViewValue) {
    return (
      <CanopThemeProvider>
        <SegmentedControl
          iconOnly
          options={iconOptions}
          value={firstValue}
          onChange={() => undefined}
          ariaLabel="Premier"
        />
        <SegmentedControl
          options={iconOptions}
          value={secondValue}
          onChange={() => undefined}
          ariaLabel="Second"
        />
      </CanopThemeProvider>
    );
  }

  function radioOf(groupName: string, optionName: string) {
    return within(screen.getByRole("radiogroup", { name: groupName })).getByRole("radio", {
      name: optionName,
    });
  }

  it("place chaque pastille sous l'option active de son propre groupe", () => {
    render(renderPair("grid", "list"));
    expect(pillIn(radioOf("Premier", "Grille"))).not.toBeNull();
    expect(pillIn(radioOf("Premier", "Liste"))).toBeNull();
    expect(pillIn(radioOf("Second", "Liste"))).not.toBeNull();
    expect(pillIn(radioOf("Second", "Grille"))).toBeNull();
  });

  it("garde la pastille du second groupe quand le premier change de sélection", () => {
    const { rerender } = render(renderPair("grid", "grid"));
    rerender(renderPair("list", "grid"));
    expect(pillIn(radioOf("Premier", "Liste"))).not.toBeNull();
    expect(pillIn(radioOf("Premier", "Grille"))).toBeNull();
    expect(pillIn(radioOf("Second", "Grille"))).not.toBeNull();
    expect(pillIn(radioOf("Second", "Liste"))).toBeNull();
  });

  it("affiche exactement une pastille par groupe", () => {
    render(renderPair("list", "list"));
    for (const groupName of ["Premier", "Second"]) {
      const group = screen.getByRole("radiogroup", { name: groupName });
      expect(group.querySelectorAll("span[aria-hidden]")).toHaveLength(1);
    }
  });
});
