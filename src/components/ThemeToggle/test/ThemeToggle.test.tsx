import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { ThemeToggle } from "../ThemeToggle";

const STORAGE_KEY = "canop-theme-mode";

function renderToggle() {
  return render(
    <CanopI18nProvider locale="fr" messages={{ fr: {}, en: {} }}>
      <CanopThemeProvider defaultMode="system">
        <ThemeToggle />
      </CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function switchControl() {
  return screen.getByRole("switch", { name: "Thème" });
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("expose un switch nommé Thème", () => {
    renderToggle();
    expect(switchControl()).toBeInTheDocument();
  });

  it("n'est pas coché à l'état initial clair", () => {
    renderToggle();
    expect(switchControl()).toHaveAttribute("aria-checked", "false");
  });

  it("bascule en thème sombre au clic n'importe où et le persiste", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(switchControl());

    expect(switchControl()).toHaveAttribute("aria-checked", "true");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });

  it("revient en thème clair à un second clic", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(switchControl());
    await user.click(switchControl());

    expect(switchControl()).toHaveAttribute("aria-checked", "false");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("light");
  });

  it("bascule en sombre avec ArrowRight et en clair avec ArrowLeft", async () => {
    const user = userEvent.setup();
    renderToggle();

    switchControl().focus();
    await user.keyboard("{ArrowRight}");
    expect(switchControl()).toHaveAttribute("aria-checked", "true");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("dark");

    await user.keyboard("{ArrowLeft}");
    expect(switchControl()).toHaveAttribute("aria-checked", "false");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("light");
  });

  it("bascule en sombre avec ArrowDown et End, en clair avec ArrowUp et Home", async () => {
    const user = userEvent.setup();
    renderToggle();

    switchControl().focus();
    await user.keyboard("{ArrowDown}");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("dark");

    await user.keyboard("{ArrowUp}");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("light");

    await user.keyboard("{End}");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("dark");

    await user.keyboard("{Home}");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("light");
  });
});
