import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider, type CanopLocale, type CanopLocaleMessages } from "../../../i18n";
import { Link } from "../Link";

function renderLink(
  ui: React.ReactElement,
  locale: CanopLocale = "fr",
  messages?: CanopLocaleMessages,
) {
  return render(
    <CanopI18nProvider locale={locale} messages={messages}>
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function RouterLink({ to, children, ...rest }: { to: string; children: ReactNode }) {
  return (
    <a href={to} data-router="true" {...rest}>
      {children}
    </a>
  );
}

describe("Link - external", () => {
  it("given external, when rendered, then it opens a new tab safely", () => {
    renderLink(
      <Link href="https://example.com" external>
        Documentation
      </Link>,
    );
    const link = screen.getByRole("link", { name: /Documentation/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("given external in french, when rendered, then the accessible name mentions nouvel onglet", () => {
    renderLink(
      <Link href="https://example.com" external>
        Documentation
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveAccessibleName(/^Documentation.*nouvel onglet/);
  });

  it("given external in english, when rendered, then the accessible name mentions new tab", () => {
    renderLink(
      <Link href="https://example.com" external>
        Docs
      </Link>,
      "en",
    );
    expect(screen.getByRole("link")).toHaveAccessibleName(/^Docs.*new tab/);
  });

  it("given an overridden canop.link.newTab message, when rendered, then the accessible name uses it", () => {
    renderLink(
      <Link href="https://example.com" external>
        Documentation
      </Link>,
      "fr",
      { fr: { "canop.link.newTab": "fenetre externe" } },
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName(/fenetre externe/);
    expect(link).not.toHaveAccessibleName(/nouvel onglet/);
  });

  it("given no external, when rendered, then there is no target, no rel and no new tab hint", () => {
    renderLink(<Link href="/interne">Accueil</Link>);
    const link = screen.getByRole("link");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
    expect(link).toHaveAccessibleName("Accueil");
  });

  it("given external with an injected component and to, when rendered, then the component carries target, rel and hint", () => {
    renderLink(
      <Link component={RouterLink} to="/ailleurs" external>
        Ailleurs
      </Link>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("data-router", "true");
    expect(link).toHaveAttribute("href", "/ailleurs");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAccessibleName(/nouvel onglet/);
  });

  it("given external, when rendered, then the hint is visually hidden", () => {
    renderLink(
      <Link href="https://example.com" external>
        Documentation
      </Link>,
    );
    const style = getComputedStyle(screen.getByText(/nouvel onglet/));
    expect(style.position).toBe("absolute");
    expect(["1px", "0.0625rem"]).toContain(style.width);
    expect(["1px", "0.0625rem"]).toContain(style.height);
    expect(style.overflow).toBe("hidden");
  });
});
