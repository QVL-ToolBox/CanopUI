import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { InlineInput } from "../InlineInput";

interface Rappels {
  onChange?: (v: string) => void;
  onCommit?: () => void;
  onCancel?: () => void;
}

function poser(rappels: Rappels = {}, valeur = "rapport.pdf") {
  const props = {
    value: valeur,
    onChange: rappels.onChange ?? vi.fn(),
    onCommit: rappels.onCommit ?? vi.fn(),
    onCancel: rappels.onCancel ?? vi.fn(),
    ariaLabel: "Nom du fichier",
  };
  return render(
    <CanopThemeProvider>
      <InlineInput {...props} />
    </CanopThemeProvider>,
  );
}

describe("InlineInput", () => {
  it("affiche la valeur et la remonte a la frappe", async () => {
    const onChange = vi.fn();
    poser({ onChange });
    const champ = screen.getByRole("textbox", { name: "Nom du fichier" });

    expect(champ).toHaveValue("rapport.pdf");
    await userEvent.type(champ, "x");

    expect(onChange).toHaveBeenCalledWith("rapport.pdfx");
  });

  it("valide a la touche Entree", async () => {
    const onCommit = vi.fn();
    poser({ onCommit });

    await userEvent.type(screen.getByRole("textbox"), "{Enter}");

    expect(onCommit).toHaveBeenCalledTimes(1);
  });

  it("abandonne a la touche Echap", async () => {
    const onCommit = vi.fn();
    const onCancel = vi.fn();
    poser({ onCommit, onCancel });

    await userEvent.type(screen.getByRole("textbox"), "{Escape}");

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onCommit).not.toHaveBeenCalled();
  });

  it("valide a la perte du focus", async () => {
    const onCommit = vi.fn();
    poser({ onCommit });

    screen.getByRole("textbox").focus();
    await userEvent.tab();

    expect(onCommit).toHaveBeenCalledTimes(1);
  });

  it("prend le focus au montage, pour qu'on puisse taper aussitot", () => {
    poser();
    expect(screen.getByRole("textbox")).toHaveFocus();
  });
});

describe("InlineInput — l'element cliquable qui l'heberge", () => {
  it("ne recoit ni le clic ni les touches du champ", async () => {
    const onClickHote = vi.fn();
    const onKeyDownHote = vi.fn();
    const onCommit = vi.fn();

    render(
      <CanopThemeProvider>
        <div onClick={onClickHote} onKeyDown={onKeyDownHote} role="presentation">
          <InlineInput
            value="rapport.pdf"
            onChange={vi.fn()}
            onCommit={onCommit}
            onCancel={vi.fn()}
            ariaLabel="Nom du fichier"
          />
        </div>
      </CanopThemeProvider>,
    );

    const champ = screen.getByRole("textbox", { name: "Nom du fichier" });
    await userEvent.click(champ);
    await userEvent.keyboard("{Enter}");

    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onClickHote).not.toHaveBeenCalled();
    expect(onKeyDownHote).not.toHaveBeenCalled();
  });
});
