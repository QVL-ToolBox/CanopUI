import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../tokens";
import { scrollbarSx } from "../../scrollbar";
import { CanopThemeProvider } from "../CanopThemeProvider";
import { useCanopTheme } from "../CanopThemeContext";
import { canopTheme, createCanopTheme } from "../createCanopTheme";

function ThemeProbe() {
  const theme = useTheme();
  return <span data-testid="probe">{theme.vars?.palette.primary.main}</span>;
}

function ModeProbe() {
  const theme = useTheme();
  return <span data-testid="mode">{theme.palette.mode}</span>;
}

describe("createCanopTheme", () => {
  it("alimente la palette MUI avec les tokens de marque", () => {
    const theme = createCanopTheme();
    expect(theme.palette.primary.main).toBe(tokens.palette.primary.main);
    expect(theme.palette.background.default).toBe(tokens.palette.background.default);
    expect(theme.palette.divider).toBe(tokens.palette.divider);
  });

  it("expose la couleur d'accent CustHome", () => {
    expect(createCanopTheme().palette.accent.main).toBe(tokens.palette.accent.main);
    expect(createCanopTheme("dark").palette.accent.main).toBe(tokens.paletteDark.accent.main);
  });

  it("décline le thème en mode sombre depuis paletteDark", () => {
    const dark = createCanopTheme("dark");
    expect(dark.palette.mode).toBe("dark");
    expect(dark.palette.primary.main).toBe(tokens.paletteDark.primary.main);
    expect(dark.palette.background.default).toBe(tokens.paletteDark.background.default);
    expect(dark.palette.text.primary).toBe(tokens.paletteDark.text.primary);
  });

  it("génère des CSS variables préfixées --canop-", () => {
    expect(canopTheme.vars?.palette.primary.main).toBe(
      `var(--canop-palette-primary-main, ${tokens.palette.primary.main})`,
    );
  });

  it("résout le radius et la typo Chivo depuis les tokens", () => {
    expect(canopTheme.shape.borderRadius).toBe(parseFloat(tokens.radius.md) * 16);
    expect(canopTheme.typography.fontFamily).toBe(tokens.typography.fontFamily);
    expect(canopTheme.typography.fontFamily).toContain("Chivo");
  });

  it("applique l'échelle de titres de la marque aux variantes h1-h5", () => {
    expect(canopTheme.typography.h1.fontSize).toBe(tokens.typography.heading.h1.fontSize);
    expect(canopTheme.typography.h2.fontSize).toBe(tokens.typography.heading.h2.fontSize);
    expect(canopTheme.typography.h5.fontSize).toBe(tokens.typography.heading.h5.fontSize);
    expect(canopTheme.typography.h1.letterSpacing).toBe(tokens.typography.heading.h1.letterSpacing);
    expect(canopTheme.typography.h5.letterSpacing).toBe(tokens.typography.heading.h5.letterSpacing);
    expect(canopTheme.typography.h2.fontWeight).toBe(tokens.typography.fontWeight.regular);
  });

  it("compose les titres dans la police de titre, le corps de texte dans Chivo", () => {
    expect(canopTheme.typography.h1.fontFamily).toContain("Titan One");
    expect(canopTheme.typography.h5.fontFamily).toContain("Titan One");
    expect(tokens.typography.heading.h1.fontFamily).toBe(canopTheme.typography.h1.fontFamily);
    expect(canopTheme.typography.fontFamily).not.toContain("Titan One");
  });

  it("garde Chivo en secours derriere la police de titre", () => {
    expect(tokens.typography.fontFamilyHeading).toContain("Chivo");
  });
});

function isStyleRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readStyleBlock(source: unknown, key: string): Record<string, unknown> {
  if (!isStyleRecord(source)) {
    throw new Error(`Bloc de style parent introuvable pour « ${key} »`);
  }
  const block = source[key];
  if (!isStyleRecord(block)) {
    throw new Error(`Bloc de style « ${key} » introuvable`);
  }
  return block;
}

function readReducedMotionReset(): Record<string, unknown> {
  const styleOverrides: unknown = createCanopTheme().components?.MuiCssBaseline?.styleOverrides;
  const mediaQuery = readStyleBlock(styleOverrides, "@media (prefers-reduced-motion: reduce)");
  return readStyleBlock(mediaQuery, "*, *::before, *::after");
}

describe("createCanopTheme — reset prefers-reduced-motion", () => {
  it("neutralise la durée et la répétition des animations ainsi que le scroll", () => {
    const reset = readReducedMotionReset();
    expect(reset.animationDuration).toBe("0.01ms !important");
    expect(reset.animationIterationCount).toBe("1 !important");
    expect(reset.transitionDuration).toBe("0.01ms !important");
    expect(reset.scrollBehavior).toBe("auto !important");
  });

  it("neutralise le délai de transition pour couper les cascades différées", () => {
    expect(readReducedMotionReset().transitionDelay).toBe("0.01ms !important");
  });

  it("neutralise l'animation-timeline pour couper les animations pilotées par le scroll", () => {
    expect(readReducedMotionReset().animationTimeline).toBe("none !important");
  });
});

describe("CanopThemeProvider", () => {
  it("rend les enfants", () => {
    render(
      <CanopThemeProvider>
        <p>contenu CustHome</p>
      </CanopThemeProvider>,
    );
    expect(screen.getByText("contenu CustHome")).toBeInTheDocument();
  });

  it("fournit le thème CustHome via le contexte, résolu en CSS variables", () => {
    render(
      <CanopThemeProvider>
        <ThemeProbe />
      </CanopThemeProvider>,
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("var(--canop-palette-primary-main)");
  });

  it("est en mode clair par défaut et bascule en sombre via mode", () => {
    const { rerender } = render(
      <CanopThemeProvider>
        <ModeProbe />
      </CanopThemeProvider>,
    );
    expect(screen.getByTestId("mode")).toHaveTextContent("light");
    rerender(
      <CanopThemeProvider mode="dark">
        <ModeProbe />
      </CanopThemeProvider>,
    );
    expect(screen.getByTestId("mode")).toHaveTextContent("dark");
  });
});

function ThemeSwitcher() {
  const { mode, resolvedMode, setMode, toggleMode } = useCanopTheme();
  return (
    <div>
      <span data-testid="pref">{mode}</span>
      <span data-testid="resolved">{resolvedMode}</span>
      <button onClick={toggleMode}>toggle</button>
      <button onClick={() => setMode("system")}>system</button>
    </div>
  );
}

describe("useCanopTheme — bascule runtime", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("lève une erreur hors d'un CanopThemeProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ThemeSwitcher />)).toThrow(/CanopThemeProvider/);
    spy.mockRestore();
  });

  it("bascule clair → sombre → clair au runtime et persiste le choix", async () => {
    const user = userEvent.setup();
    render(
      <CanopThemeProvider>
        <ThemeSwitcher />
      </CanopThemeProvider>,
    );
    expect(screen.getByTestId("resolved")).toHaveTextContent("light");

    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
    expect(window.localStorage.getItem("canop-theme-mode")).toBe("dark");

    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByTestId("resolved")).toHaveTextContent("light");
    expect(window.localStorage.getItem("canop-theme-mode")).toBe("light");
  });

  it("réhydrate la préférence depuis localStorage", () => {
    window.localStorage.setItem("canop-theme-mode", "dark");
    render(
      <CanopThemeProvider>
        <ThemeSwitcher />
      </CanopThemeProvider>,
    );
    expect(screen.getByTestId("pref")).toHaveTextContent("dark");
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
  });

  it("résout « system » via prefers-color-scheme", async () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );
    const user = userEvent.setup();
    render(
      <CanopThemeProvider defaultMode="system">
        <ThemeSwitcher />
      </CanopThemeProvider>,
    );
    expect(screen.getByTestId("pref")).toHaveTextContent("system");
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
    await user.click(screen.getByRole("button", { name: "system" }));
    expect(window.localStorage.getItem("canop-theme-mode")).toBe("system");
  });

  it("ignore setMode en usage contrôlé (prop mode)", async () => {
    const user = userEvent.setup();
    render(
      <CanopThemeProvider mode="light">
        <ThemeSwitcher />
      </CanopThemeProvider>,
    );
    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByTestId("resolved")).toHaveTextContent("light");
    expect(window.localStorage.getItem("canop-theme-mode")).toBeNull();
  });
});

describe("CanopThemeProvider — lecture du stockage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retient la préférence stockée sous la clé courante", () => {
    window.localStorage.setItem("canop-theme-mode", "light");
    render(
      <CanopThemeProvider defaultMode="dark">
        <ThemeSwitcher />
      </CanopThemeProvider>,
    );
    expect(screen.getByTestId("pref")).toHaveTextContent("light");
  });

  it("retombe sur defaultMode quand le stockage est vide", () => {
    render(
      <CanopThemeProvider defaultMode="dark">
        <ThemeSwitcher />
      </CanopThemeProvider>,
    );
    expect(screen.getByTestId("pref")).toHaveTextContent("dark");
    expect(window.localStorage.getItem("canop-theme-mode")).toBeNull();
  });

  it("retombe sur defaultMode quand la lecture du stockage lève", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("stockage indisponible");
    });
    render(
      <CanopThemeProvider defaultMode="dark">
        <ThemeSwitcher />
      </CanopThemeProvider>,
    );
    expect(screen.getByTestId("pref")).toHaveTextContent("dark");
  });
});

describe("createCanopTheme — barre de defilement", () => {
  it("applique la meme barre a toute la page sans intervention des composants", () => {
    const styleOverrides: unknown = createCanopTheme().components?.MuiCssBaseline?.styleOverrides;
    const universal = readStyleBlock(styleOverrides, "*");

    expect(universal["&::-webkit-scrollbar"]).toBeDefined();
    expect(universal.scrollbarWidth).toBeUndefined();
    expect(universal["@supports not selector(::-webkit-scrollbar)"]).toBeDefined();
  });

  it("expose les couleurs de la barre en variables surchargeables", () => {
    const styleOverrides: unknown = createCanopTheme().components?.MuiCssBaseline?.styleOverrides;
    const root = readStyleBlock(styleOverrides, ":root");

    expect(root["--canop-scrollbar-thumb"]).toBe("var(--canop-palette-primary-main)");
    expect(root["--canop-scrollbar-thumb-hover"]).toBe("var(--canop-palette-primary-light)");
    expect(root["--canop-scrollbar-track"]).toContain("--canop-palette-primary-main");
    expect(root["--canop-scrollbar-thumb-top"]).toBe("var(--canop-palette-primary-dark)");
    expect(root["--canop-scrollbar-thumb-bottom"]).toBe(
      "color-mix(in srgb, var(--canop-palette-primary-light) 40%, var(--canop-palette-primary-main))",
    );
  });

  it("descend du fonce au clair, arrets et variables d'accord", () => {
    const styleOverrides: unknown = createCanopTheme().components?.MuiCssBaseline?.styleOverrides;
    const root = readStyleBlock(styleOverrides, ":root");
    const pouce = scrollbarSx()["&::-webkit-scrollbar-thumb"] as Record<string, string>;
    const repos = pouce.backgroundImage.slice(
      pouce.backgroundImage.lastIndexOf("linear-gradient(180deg"),
    );

    const premier = repos.indexOf("--canop-scrollbar-thumb-top");
    const dernier = repos.indexOf("--canop-scrollbar-thumb-bottom");
    expect(premier).toBeGreaterThanOrEqual(0);
    expect(premier).toBeLessThan(dernier);

    expect(root["--canop-scrollbar-thumb-top"]).toContain("primary-dark");
    expect(root["--canop-scrollbar-thumb-bottom"]).toContain("primary-light");
  });
});

describe("createCanopTheme — champs mot de passe", () => {
  it("retire les boutons natifs d'Edge, qui doublonnent celui de la librairie", () => {
    const styleOverrides: unknown = createCanopTheme().components?.MuiCssBaseline?.styleOverrides;
    const edge = readStyleBlock(styleOverrides, "input::-ms-reveal, input::-ms-clear");

    expect(edge.display).toBe("none");
  });
});

function luminance(hex: string): number {
  const canal = (i: number) => {
    const v = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(1) + 0.7152 * canal(3) + 0.0722 * canal(5);
}

function contrast(a: string, b: string): number {
  const [haut, bas] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (haut + 0.05) / (bas + 0.05);
}

describe("palette — lisibilite du bouton secondary", () => {
  it("porte un texte blanc sur le fond du theme clair", () => {
    expect(contrast("#ffffff", tokens.palette.secondary.dark)).toBeGreaterThanOrEqual(4.5);
  });

  it("porte son contrastText sur le fond du theme sombre", () => {
    expect(
      contrast(tokens.paletteDark.secondary.contrastText, tokens.paletteDark.secondary.main),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("n'expose plus de variable maison pour ce bouton", () => {
    for (const mode of ["light", "dark"] as const) {
      const styleOverrides: unknown =
        createCanopTheme(mode).components?.MuiCssBaseline?.styleOverrides;
      const root = readStyleBlock(styleOverrides, ":root");
      const maison = Object.keys(root).filter((cle) => cle.startsWith("--canop-button-"));
      expect(maison).toEqual([]);
    }
  });
});
