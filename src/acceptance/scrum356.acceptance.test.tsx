import { render } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import {
  CanopThemeProvider,
  useCanopTheme,
  createCanopTheme,
  palette,
  paletteDark,
  typography,
} from "../index";
import { relativeLuminance } from "../test/contrastRatio";

const collectInjectedCss = () =>
  Array.from(document.querySelectorAll("style"))
    .map((node) => node.textContent ?? "")
    .join("\n");

const readCssVar = (css: string, name: string): string | null => {
  const match = css.match(new RegExp(`${name}\\s*:\\s*([^;{}]+)`));
  return match ? match[1].trim() : null;
};

const setSystemColorScheme = (scheme: "dark" | "light") => {
  window.matchMedia = ((query: string) => ({
    matches: query.includes(scheme),
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
};

const ModeProbe = ({ onRead }: { onRead: (mode: string, resolved: string) => void }) => {
  const { mode, resolvedMode } = useCanopTheme();
  useEffect(() => {
    onRead(mode, resolvedMode);
  }, [mode, resolvedMode, onRead]);
  return null;
};

describe("AC-6 CSS variables motion et ombres exposees et non vides", () => {
  const durationVars = [
    "--canop-motion-duration-instant",
    "--canop-motion-duration-fast",
    "--canop-motion-duration-base",
    "--canop-motion-duration-slow",
    "--canop-motion-duration-slower",
  ];
  const easeVars = [
    "--canop-motion-ease-standard",
    "--canop-motion-ease-organic",
    "--canop-motion-ease-decelerate",
    "--canop-motion-ease-accelerate",
    "--canop-motion-ease-spring-soft",
  ];
  const shadowVars = [
    "--canop-shadow-e1",
    "--canop-shadow-e2",
    "--canop-shadow-e3",
    "--canop-shadow-e4",
    "--canop-shadow-e5",
    "--canop-drop-shadow-e1",
    "--canop-drop-shadow-e2",
    "--canop-drop-shadow-e3",
    "--canop-drop-shadow-e4",
    "--canop-drop-shadow-e5",
  ];

  it("expose toutes les variables motion et ombres avec une valeur non vide en mode light", () => {
    render(
      <CanopThemeProvider mode="light">
        <div />
      </CanopThemeProvider>,
    );
    const css = collectInjectedCss();
    for (const name of [...durationVars, ...easeVars, ...shadowVars]) {
      const value = readCssVar(css, name);
      expect(value, `variable ${name}`).toBeTruthy();
      expect(value?.length ?? 0, `valeur non vide ${name}`).toBeGreaterThan(0);
    }
  });

  it("expose les memes variables en mode dark avec valeurs non vides", () => {
    render(
      <CanopThemeProvider mode="dark">
        <div />
      </CanopThemeProvider>,
    );
    const css = collectInjectedCss();
    for (const name of [...durationVars, ...easeVars, ...shadowVars]) {
      const value = readCssVar(css, name);
      expect(value, `variable ${name}`).toBeTruthy();
    }
  });
});

describe("AC-3 couleurs secondary", () => {
  it("secondary.main vaut #8f9a74 dans les tokens et le theme light", () => {
    expect(palette.secondary.main).toBe("#8f9a74");
    expect(createCanopTheme("light").palette.secondary.main).toBe("#8f9a74");
  });

  it("secondary.light vaut #bcc2a8", () => {
    expect(palette.secondary.light).toBe("#bcc2a8");
    expect(createCanopTheme("light").palette.secondary.light).toBe("#bcc2a8");
  });
});

describe("AC-4 typographie display-1", () => {
  it("display-1 a une fontSize de 3.815rem", () => {
    expect(typography.display["display-1"].fontSize).toBe("3.815rem");
  });
});

describe("AC-5 mode par defaut suit le systeme", () => {
  const originalMatchMedia = window.matchMedia;
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it("sans prop mode, resout en dark quand le systeme est dark", () => {
    setSystemColorScheme("dark");
    let mode = "";
    let resolved = "";
    render(
      <CanopThemeProvider>
        <ModeProbe
          onRead={(m, r) => {
            mode = m;
            resolved = r;
          }}
        />
      </CanopThemeProvider>,
    );
    expect(mode).toBe("system");
    expect(resolved).toBe("dark");
  });

  it("sans prop mode, resout en light quand le systeme est light", () => {
    setSystemColorScheme("light");
    let resolved = "";
    render(
      <CanopThemeProvider>
        <ModeProbe
          onRead={(_, r) => {
            resolved = r;
          }}
        />
      </CanopThemeProvider>,
    );
    expect(resolved).toBe("light");
  });

  it("un composant Button se rend sans erreur en light et en dark", () => {
    const light = render(
      <CanopThemeProvider mode="light">
        <Button>Valider</Button>
      </CanopThemeProvider>,
    );
    expect(light.getByRole("button", { name: "Valider" })).toBeInTheDocument();
    light.unmount();
    const dark = render(
      <CanopThemeProvider mode="dark">
        <Button>Valider</Button>
      </CanopThemeProvider>,
    );
    expect(dark.getByRole("button", { name: "Valider" })).toBeInTheDocument();
  });
});

describe("AC-2 ramp d elevation et ombres dark", () => {
  it("la ramp de surfaces dark s eclaircit de canvas vers overlay", () => {
    const canvas = relativeLuminance(paletteDark.background.default);
    const base = relativeLuminance(paletteDark.surface.base);
    const raised = relativeLuminance(paletteDark.surface.raised);
    const overlay = relativeLuminance(paletteDark.surface.overlay);
    expect(base).toBeGreaterThanOrEqual(canvas);
    expect(raised).toBeGreaterThan(base);
    expect(overlay).toBeGreaterThan(raised);
  });

  it("les ombres dark portent un lisere halo et ne sont pas du noir pur plaque", () => {
    const dark = createCanopTheme("dark");
    for (let level = 1; level <= 5; level += 1) {
      const shadow = dark.shadows[level];
      expect(shadow, `ombre e${level} presente`).toBeTruthy();
      expect(shadow, `ombre e${level} halo lisere`).toContain("rgba(157,225,196");
    }
  });
});
