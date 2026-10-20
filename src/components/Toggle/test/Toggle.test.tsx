import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Toggle, type CanopToggleColor } from "../Toggle";

function renderToggle(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

const colors: CanopToggleColor[] = ["primary", "secondary", "accent", "success"];

function thumbOf() {
  return screen.getByRole("switch").firstElementChild;
}

describe("Toggle", () => {
  it("affiche un switch avec l'etat initial", () => {
    renderToggle(<Toggle checked={false} onChange={() => {}} ariaLabel="Activer" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("affiche checked quand active", () => {
    renderToggle(<Toggle checked onChange={() => {}} ariaLabel="Activer" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("appelle onChange au clic", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderToggle(<Toggle checked={false} onChange={onChange} ariaLabel="Activer" />);
    await user.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("ne declenche pas onChange quand disabled", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onChange = vi.fn();
    renderToggle(<Toggle checked={false} onChange={onChange} disabled ariaLabel="Activer" />);
    await user.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("Toggle - tailles et couleurs", () => {
  it("place le curseur à droite du rail medium quand il est activé", () => {
    renderToggle(<Toggle checked onChange={() => {}} ariaLabel="Activer" />);
    expect(thumbOf()).toHaveStyle({ left: "1.6875rem" });
  });

  it("place le curseur à droite du rail small quand il est activé", () => {
    renderToggle(<Toggle checked onChange={() => {}} size="small" ariaLabel="Activer" />);
    expect(thumbOf()).toHaveStyle({ left: "1.3125rem" });
  });

  it("ramène le curseur à gauche quand il est éteint", () => {
    renderToggle(<Toggle checked={false} onChange={() => {}} ariaLabel="Activer" />);
    expect(thumbOf()).toHaveStyle({ left: "0.1875rem" });
  });

  it("applique une déclinaison visuelle distincte pour chacune des quatre couleurs", () => {
    const classNames = colors.map((color) => {
      const { unmount } = renderToggle(
        <Toggle checked onChange={() => {}} color={color} ariaLabel="Activer" />,
      );
      const className = screen.getByRole("switch").className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(colors.length);
  });
});

describe("Toggle - libellé", () => {
  it("affiche le libellé et le donne comme nom accessible au switch", () => {
    renderToggle(<Toggle checked={false} onChange={() => {}} label="Mode sombre" />);
    expect(screen.getByText("Mode sombre")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Mode sombre" })).toBeInTheDocument();
  });

  it("relie le libellé visible au switch par aria-labelledby", () => {
    renderToggle(<Toggle checked={false} onChange={() => {}} label="Mode sombre" />);
    const labelledBy = screen.getByRole("switch").getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy!)).toHaveTextContent("Mode sombre");
  });

  it("bascule au clic sur le libellé", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderToggle(<Toggle checked={false} onChange={onChange} label="Mode sombre" />);
    await user.click(screen.getByText("Mode sombre"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("ne bascule pas au clic sur le libellé quand disabled", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onChange = vi.fn();
    renderToggle(<Toggle checked onChange={onChange} disabled label="Mode sombre" />);
    await user.click(screen.getByText("Mode sombre"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("laisse ariaLabel primer sur le libellé visible", () => {
    renderToggle(
      <Toggle checked={false} onChange={() => {}} label="Mode sombre" ariaLabel="Thème sombre" />,
    );
    expect(screen.getByRole("switch", { name: "Thème sombre" })).toBeInTheDocument();
    expect(screen.getByRole("switch")).not.toHaveAttribute("aria-labelledby");
  });

  it("n'invente aucun nom quand ni label ni ariaLabel ne sont fournis", () => {
    renderToggle(<Toggle checked={false} onChange={() => {}} />);
    expect(screen.getByRole("switch")).not.toHaveAttribute("aria-label");
    expect(screen.getByRole("switch")).not.toHaveAttribute("aria-labelledby");
  });
});
