import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Avatar } from "../Avatar";

function renderAvatar(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("Avatar", () => {
  it("given un nom, when on rend l'avatar, then il expose une image nommee par le nom complet", () => {
    renderAvatar(<Avatar name="Martin Queval" />);

    expect(screen.getByRole("img", { name: "Martin Queval" })).toBeInTheDocument();
  });

  it("given un nom, when on rend l'avatar, then les initiales sont affichees et masquees aux lecteurs d'ecran", () => {
    renderAvatar(<Avatar name="Martin Queval" />);

    const initials = screen.getByText("MQ");
    expect(initials).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("img", { name: "Martin Queval" })).toContainElement(initials);
  });

  it("given aucune taille, when on rend l'avatar, then la taille md est appliquee", () => {
    renderAvatar(<Avatar name="Martin Queval" />);

    expect(screen.getByRole("img")).toHaveAttribute("data-size", "md");
  });

  it.each(["sm", "md", "lg"] as const)(
    "given la taille %s, when on rend l'avatar, then elle est appliquee",
    (size) => {
      renderAvatar(<Avatar name="Martin Queval" size={size} />);

      expect(screen.getByRole("img")).toHaveAttribute("data-size", size);
    },
  );

  it("given les trois tailles, when on rend les avatars, then leurs diametres sont croissants", () => {
    renderAvatar(
      <>
        <Avatar name="Petit" size="sm" />
        <Avatar name="Moyen" size="md" />
        <Avatar name="Grand" size="lg" />
      </>,
    );

    const widths = ["Petit", "Moyen", "Grand"].map((name) =>
      parseFloat(getComputedStyle(screen.getByRole("img", { name })).width),
    );
    expect(widths[0]).toBeLessThan(widths[1]);
    expect(widths[1]).toBeLessThan(widths[2]);
  });

  it("given deux avatars du meme nom, when on les rend, then ils ont la meme teinte", () => {
    renderAvatar(
      <>
        <Avatar name="Martin Queval" size="sm" />
        <Avatar name="Martin Queval" size="lg" />
      </>,
    );

    const [first, second] = screen.getAllByRole("img", { name: "Martin Queval" });
    expect(first.getAttribute("data-tone")).toBe(second.getAttribute("data-tone"));
  });

  it("given un nom accentue, when on rend l'avatar, then le nom accessible est conserve tel quel", () => {
    renderAvatar(<Avatar name="Ana María de la Peña" />);

    expect(screen.getByRole("img", { name: "Ana María de la Peña" })).toBeInTheDocument();
    expect(screen.getByText("AP")).toBeInTheDocument();
  });

  it("given un nom vide, when on rend l'avatar, then une silhouette est affichee sans initiales et nommee Utilisateur anonyme", () => {
    renderAvatar(<Avatar name="" />);

    const avatar = screen.getByRole("img", { name: "Utilisateur anonyme" });
    expect(avatar.querySelector("svg")).toBeInTheDocument();
    expect(avatar).toHaveTextContent("");
  });

  it("given un nom vide en anglais, when on rend l'avatar, then il est nomme Anonymous user", () => {
    render(
      <CanopI18nProvider locale="en">
        <CanopThemeProvider>
          <Avatar name="" />
        </CanopThemeProvider>
      </CanopI18nProvider>,
    );

    expect(screen.getByRole("img", { name: "Anonymous user" })).toBeInTheDocument();
  });

  it("given un nom sans lettre, when on rend l'avatar, then une silhouette est affichee et le nom reste le libelle", () => {
    renderAvatar(<Avatar name="42" />);

    const avatar = screen.getByRole("img", { name: "42" });
    expect(avatar.querySelector("svg")).toBeInTheDocument();
    expect(avatar).toHaveTextContent("");
  });

  it("given un nom fait uniquement d'espaces, when on rend l'avatar, then le libelle generique est utilise", () => {
    renderAvatar(<Avatar name="   " />);

    const avatar = screen.getByRole("img", { name: "Utilisateur anonyme" });
    expect(avatar.querySelector("svg")).toBeInTheDocument();
  });

  it.each(["", "42"])(
    "given le nom sans initiales %j, when on le rend deux fois, then data-tone est identique",
    (name) => {
      renderAvatar(
        <>
          <Avatar name={name} />
          <Avatar name={name} size="lg" />
        </>,
      );

      const [first, second] = screen.getAllByRole("img");
      expect(first.getAttribute("data-tone")).toBeTruthy();
      expect(first.getAttribute("data-tone")).toBe(second.getAttribute("data-tone"));
    },
  );

  it.each(["Martin Queval", "", "42"])(
    "given le nom %j, when on rend l'avatar, then le fond est la couleur main de sa teinte",
    (name) => {
      renderAvatar(<Avatar name={name} />);

      const avatar = screen.getByRole("img");
      const tone = avatar.getAttribute("data-tone");
      expect(avatar).toHaveStyle({ backgroundColor: `var(--canop-palette-${tone}-main)` });
    },
  );

  it.each([
    ["sm", "1.25rem"],
    ["md", "1.5rem"],
    ["lg", "2rem"],
  ] as const)(
    "given la taille %s et un nom anonyme, when on rend l'avatar, then l'icone mesure %s",
    (size, dimension) => {
      renderAvatar(<Avatar name="" size={size} />);

      const icon = screen.getByRole("img").querySelector("svg");
      expect(icon).toHaveAttribute("width", dimension);
      expect(icon).toHaveAttribute("height", dimension);
    },
  );
});
