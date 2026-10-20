import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { CanopThemeProvider } from "../../../theme";
import { Link } from "../Link";

function renderLink(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function RouterLink({ to, children, ...rest }: { to: string; children: ReactNode }) {
  return (
    <a href={to} data-router="true" {...rest}>
      {children}
    </a>
  );
}

describe("Link", () => {
  it("rend un lien <a> avec href", () => {
    renderLink(<Link href="/register">Créer un compte</Link>);
    const link = screen.getByRole("link", { name: "Créer un compte" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/register");
  });

  it("rend le composant injecté avec sa prop to (react-router)", () => {
    renderLink(
      <Link component={RouterLink} to="/forgot-password">
        Mot de passe oublié ?
      </Link>,
    );
    const link = screen.getByRole("link", { name: "Mot de passe oublié ?" });
    expect(link).toHaveAttribute("href", "/forgot-password");
    expect(link).toHaveAttribute("data-router", "true");
  });

  it("applique la taille medium par défaut", () => {
    renderLink(<Link href="/a">Lien</Link>);
    expect(screen.getByRole("link")).toHaveStyle({ fontSize: "1rem" });
  });

  it("applique la taille small pour les liens secondaires", () => {
    renderLink(
      <Link href="/a" size="small">
        Lien secondaire
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveStyle({ fontSize: "0.9rem" });
  });

  it("applique la taille xsmall", () => {
    renderLink(
      <Link href="/a" size="xsmall">
        Lien minuscule
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveStyle({ fontSize: "0.75rem" });
  });

  it("applique une couleur muted distincte de la couleur par defaut", () => {
    renderLink(
      <>
        <Link href="/a">Defaut</Link>
        <Link href="/b" color="muted">
          Discret
        </Link>
      </>,
    );
    const links = screen.getAllByRole("link");
    const defaut = getComputedStyle(links[0]).color;
    const muted = getComputedStyle(links[1]).color;
    expect(muted).not.toBe(defaut);
  });

  it("empeche le retour a la ligne avec noWrap", () => {
    renderLink(
      <Link href="/a" noWrap>
        Texte insecable
      </Link>,
    );
    expect(screen.getByRole("link")).toHaveStyle({ whiteSpace: "nowrap" });
  });

  it("autorise le retour a la ligne par defaut", () => {
    renderLink(<Link href="/a">Lien</Link>);
    expect(screen.getByRole("link")).not.toHaveStyle({ whiteSpace: "nowrap" });
  });

  it("souligne au survol uniquement (underline hover)", () => {
    renderLink(<Link href="/a">Lien</Link>);
    expect(screen.getByRole("link").className).toContain("underlineHover");
  });
});
