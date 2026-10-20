import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import type { ComponentProps } from "react";

const handedThemes = vi.hoisted(() => [] as unknown[]);

vi.mock("@mui/material/styles", async (importOriginal) => {
  const original = await importOriginal<typeof import("@mui/material/styles")>();
  const SpyThemeProvider = (props: ComponentProps<typeof original.ThemeProvider>) => {
    handedThemes.push(props.theme);
    return <original.ThemeProvider {...props} />;
  };
  return { ...original, ThemeProvider: SpyThemeProvider };
});

const { CanopThemeProvider, canopTheme } = await import("../../index");

describe("instance de theme fournie par CanopThemeProvider", () => {
  beforeEach(() => {
    handedThemes.length = 0;
    window.localStorage.clear();
    vi.setSystemTime(new Date(2026, 5, 10, 12));
  });

  it("transmet l'instance canopTheme en mode clair sans season hors saison", () => {
    render(
      <CanopThemeProvider mode="light">
        <p>contenu</p>
      </CanopThemeProvider>,
    );

    expect(handedThemes.length).toBeGreaterThan(0);
    expect(handedThemes.at(-1)).toBe(canopTheme);
  });

  it("transmet un autre theme que canopTheme en mode clair halloween", () => {
    render(
      <CanopThemeProvider mode="light" season="halloween">
        <p>contenu</p>
      </CanopThemeProvider>,
    );

    expect(handedThemes.length).toBeGreaterThan(0);
    expect(handedThemes.at(-1)).not.toBe(canopTheme);
  });

  it("transmet un autre theme que canopTheme en mode clair sans season en pleine saison", () => {
    vi.setSystemTime(new Date(2026, 9, 20, 12));

    render(
      <CanopThemeProvider mode="light">
        <p>contenu</p>
      </CanopThemeProvider>,
    );

    expect(handedThemes.at(-1)).not.toBe(canopTheme);
  });

  it("transmet l'instance canopTheme en mode clair avec season nulle en pleine saison", () => {
    vi.setSystemTime(new Date(2026, 9, 20, 12));

    render(
      <CanopThemeProvider mode="light" season={null}>
        <p>contenu</p>
      </CanopThemeProvider>,
    );

    expect(handedThemes.at(-1)).toBe(canopTheme);
  });
});
