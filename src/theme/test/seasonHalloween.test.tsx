import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTheme } from "@mui/material/styles";
import {
  CanopThemeProvider,
  canopTheme,
  createCanopTheme,
  palette,
  paletteDark,
  paletteHalloween,
  paletteHalloweenDark,
  tokens,
  useCanopTheme,
} from "../../index";

const LIGHT_PUMPKIN = "#a8430a";
const DARK_PUMPKIN = "#ff8a1f";
const OFF_SEASON_DAY = new Date(2026, 5, 10, 12);

function shapeOf(value: unknown): unknown {
  if (typeof value !== "object" || value === null) return typeof value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, nested]) => [key, shapeOf(nested)]),
  );
}

function SeasonProbe() {
  const theme = useTheme();
  const { season, resolvedMode, toggleMode } = useCanopTheme();
  return (
    <div>
      <span data-testid="season">{String(season)}</span>
      <span data-testid="resolved">{resolvedMode}</span>
      <span data-testid="primary">{theme.palette.primary.main}</span>
      <button onClick={toggleMode}>basculer</button>
    </div>
  );
}

describe("palettes Halloween dans les tokens", () => {
  it("expose paletteHalloween avec la structure de palette", () => {
    expect(shapeOf(paletteHalloween)).toEqual(shapeOf(palette));
  });

  it("expose paletteHalloweenDark avec la structure de paletteDark", () => {
    expect(shapeOf(paletteHalloweenDark)).toEqual(shapeOf(paletteDark));
  });

  it("regroupe les deux palettes Halloween dans tokens", () => {
    expect(tokens.paletteHalloween).toBe(paletteHalloween);
    expect(tokens.paletteHalloweenDark).toBe(paletteHalloweenDark);
  });
});

describe("createCanopTheme avec saison", () => {
  it("applique la citrouille claire en primary.main en mode clair halloween", () => {
    const theme = createCanopTheme("light", "halloween");

    expect(theme.palette.mode).toBe("light");
    expect(theme.palette.primary.main).toBe(paletteHalloween.primary.main);
    expect(theme.palette.primary.main).toBe(LIGHT_PUMPKIN);
  });

  it("applique la citrouille sombre en primary.main en mode sombre halloween", () => {
    const theme = createCanopTheme("dark", "halloween");

    expect(theme.palette.mode).toBe("dark");
    expect(theme.palette.primary.main).toBe(paletteHalloweenDark.primary.main);
    expect(theme.palette.primary.main).toBe(DARK_PUMPKIN);
  });

  it("garde la palette CanopUI sans saison", () => {
    expect(createCanopTheme().palette.primary.main).toBe(palette.primary.main);
    expect(createCanopTheme("dark").palette.primary.main).toBe(paletteDark.primary.main);
  });

  it("produit sans saison le meme theme que canopTheme", () => {
    expect(JSON.stringify(createCanopTheme())).toBe(JSON.stringify(canopTheme));
  });

  it("produit avec une saison nulle le meme theme que sans saison", () => {
    expect(JSON.stringify(createCanopTheme("light", null))).toBe(
      JSON.stringify(createCanopTheme()),
    );
    expect(JSON.stringify(createCanopTheme("dark", null))).toBe(
      JSON.stringify(createCanopTheme("dark")),
    );
  });
});

describe("CanopThemeProvider avec saison", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.setSystemTime(OFF_SEASON_DAY);
  });

  it("applique la palette Halloween claire avec season halloween", () => {
    render(
      <CanopThemeProvider season="halloween" defaultMode="light">
        <SeasonProbe />
      </CanopThemeProvider>,
    );

    expect(screen.getByTestId("primary")).toHaveTextContent(paletteHalloween.primary.main);
  });

  it("bascule entre palette Halloween claire et sombre", async () => {
    const user = userEvent.setup();
    render(
      <CanopThemeProvider season="halloween" defaultMode="light">
        <SeasonProbe />
      </CanopThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "basculer" }));
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
    expect(screen.getByTestId("primary")).toHaveTextContent(paletteHalloweenDark.primary.main);

    await user.click(screen.getByRole("button", { name: "basculer" }));
    expect(screen.getByTestId("resolved")).toHaveTextContent("light");
    expect(screen.getByTestId("primary")).toHaveTextContent(paletteHalloween.primary.main);
  });

  it("garde la palette CanopUI et bascule sans season hors saison", async () => {
    const user = userEvent.setup();
    render(
      <CanopThemeProvider defaultMode="light">
        <SeasonProbe />
      </CanopThemeProvider>,
    );

    expect(screen.getByTestId("primary")).toHaveTextContent(palette.primary.main);
    await user.click(screen.getByRole("button", { name: "basculer" }));
    expect(screen.getByTestId("primary")).toHaveTextContent(paletteDark.primary.main);
  });

  it("expose season halloween via useCanopTheme quand la prop est fournie", () => {
    render(
      <CanopThemeProvider season="halloween">
        <SeasonProbe />
      </CanopThemeProvider>,
    );

    expect(screen.getByTestId("season")).toHaveTextContent("halloween");
  });

  it("expose season null via useCanopTheme sans prop hors saison", () => {
    render(
      <CanopThemeProvider>
        <SeasonProbe />
      </CanopThemeProvider>,
    );

    expect(screen.getByTestId("season")).toHaveTextContent("null");
  });

  it("expose season null via useCanopTheme avec une prop nulle", () => {
    render(
      <CanopThemeProvider season={null}>
        <SeasonProbe />
      </CanopThemeProvider>,
    );

    expect(screen.getByTestId("season")).toHaveTextContent("null");
  });

  it("reflete un changement de prop season au rerendu", () => {
    const { rerender } = render(
      <CanopThemeProvider season="halloween" mode="light">
        <SeasonProbe />
      </CanopThemeProvider>,
    );
    rerender(
      <CanopThemeProvider season={null} mode="light">
        <SeasonProbe />
      </CanopThemeProvider>,
    );

    expect(screen.getByTestId("season")).toHaveTextContent("null");
    expect(screen.getByTestId("primary")).toHaveTextContent(palette.primary.main);
  });
});
