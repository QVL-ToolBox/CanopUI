import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { SegmentedControl } from "../SegmentedControl";
import type { CanopSegmentedControlOption } from "../SegmentedControl";

const options: CanopSegmentedControlOption[] = [
  { value: "grid", label: "Grille" },
  { value: "list", label: "Liste" },
];

function renderControl(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("SegmentedControl", () => {
  it("rend un radiogroup étiqueté avec une option par valeur", () => {
    renderControl(
      <SegmentedControl
        options={options}
        value="grid"
        onChange={() => undefined}
        ariaLabel="Affichage"
      />,
    );
    expect(screen.getByRole("radiogroup", { name: "Affichage" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("coche l'option correspondant à la valeur active", () => {
    renderControl(
      <SegmentedControl
        options={options}
        value="list"
        onChange={() => undefined}
        ariaLabel="Affichage"
      />,
    );
    expect(screen.getByRole("radio", { name: "Liste" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Grille" })).toHaveAttribute("aria-checked", "false");
  });

  it("place uniquement l'option active dans l'ordre de tabulation", () => {
    renderControl(
      <SegmentedControl
        options={options}
        value="grid"
        onChange={() => undefined}
        ariaLabel="Affichage"
      />,
    );
    expect(screen.getByRole("radio", { name: "Grille" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: "Liste" })).toHaveAttribute("tabindex", "-1");
  });

  it("émet onChange au clic sur une option non sélectionnée", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderControl(
      <SegmentedControl options={options} value="grid" onChange={onChange} ariaLabel="Affichage" />,
    );
    await user.click(screen.getByRole("radio", { name: "Liste" }));
    expect(onChange).toHaveBeenCalledWith("list");
  });

  it("n'émet pas onChange au clic sur l'option déjà sélectionnée", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderControl(
      <SegmentedControl options={options} value="grid" onChange={onChange} ariaLabel="Affichage" />,
    );
    await user.click(screen.getByRole("radio", { name: "Grille" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("désactive une option marquée disabled", () => {
    renderControl(
      <SegmentedControl
        options={[...options, { value: "board", label: "Tableau", disabled: true }]}
        value="grid"
        onChange={() => undefined}
        ariaLabel="Affichage"
      />,
    );
    expect(screen.getByRole("radio", { name: "Tableau" })).toBeDisabled();
  });

  it("navigue vers l'option suivante avec la flèche droite", () => {
    const onChange = vi.fn();
    renderControl(
      <SegmentedControl options={options} value="grid" onChange={onChange} ariaLabel="Affichage" />,
    );
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("list");
  });

  it("navigue vers la dernière option avec End et la première avec Home", () => {
    const onChange = vi.fn();
    renderControl(
      <SegmentedControl options={options} value="grid" onChange={onChange} ariaLabel="Affichage" />,
    );
    const group = screen.getByRole("radiogroup");
    fireEvent.keyDown(group, { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith("list");
  });

  it("saute les options désactivées lors de la navigation clavier", () => {
    const onChange = vi.fn();
    renderControl(
      <SegmentedControl
        options={[
          { value: "grid", label: "Grille" },
          { value: "list", label: "Liste", disabled: true },
          { value: "board", label: "Tableau" },
        ]}
        value="grid"
        onChange={onChange}
        ariaLabel="Affichage"
      />,
    );
    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("board");
  });

  describe("pastille glissante", () => {
    function pillIn(radio: HTMLElement) {
      return radio.querySelector("span[aria-hidden]") as HTMLElement | null;
    }

    it("affiche la pastille sous l'option active uniquement", () => {
      renderControl(
        <SegmentedControl
          options={options}
          value="grid"
          onChange={() => undefined}
          ariaLabel="Affichage"
        />,
      );
      expect(pillIn(screen.getByRole("radio", { name: "Grille" }))).not.toBeNull();
      expect(pillIn(screen.getByRole("radio", { name: "Liste" }))).toBeNull();
    });

    it("déplace la pastille sur la nouvelle option active", () => {
      const { rerender } = renderControl(
        <SegmentedControl
          options={options}
          value="grid"
          onChange={() => undefined}
          ariaLabel="Affichage"
        />,
      );
      rerender(
        <CanopThemeProvider>
          <SegmentedControl
            options={options}
            value="list"
            onChange={() => undefined}
            ariaLabel="Affichage"
          />
        </CanopThemeProvider>,
      );
      expect(pillIn(screen.getByRole("radio", { name: "Liste" }))).not.toBeNull();
      expect(pillIn(screen.getByRole("radio", { name: "Grille" }))).toBeNull();
    });

    it("porte une ombre visible sur une enveloppe non interactive et sans découpe", () => {
      renderControl(
        <SegmentedControl
          options={options}
          value="grid"
          onChange={() => undefined}
          ariaLabel="Affichage"
        />,
      );
      const pill = pillIn(screen.getByRole("radio", { name: "Grille" })) as HTMLElement;
      const wrapper = pill.parentElement as HTMLElement;
      expect(wrapper.style.filter).toBe("var(--canop-drop-shadow-e1) var(--canop-drop-shadow-e1)");
      expect(wrapper.style.clipPath).toBe("");
      expect(wrapper.style.pointerEvents).toBe("none");
      expect(pill.style.clipPath.startsWith("polygon(")).toBe(true);
      expect(pill.style.filter).toBe("");
    });

    it("garde le libellé de l'option active au-dessus de la pastille", () => {
      renderControl(
        <SegmentedControl
          options={options}
          value="grid"
          onChange={() => undefined}
          ariaLabel="Affichage"
        />,
      );
      const pill = pillIn(screen.getByRole("radio", { name: "Grille" })) as HTMLElement;
      const wrapperLayer = Number(getComputedStyle(pill.parentElement as HTMLElement).zIndex);
      const content = screen.getByText("Grille").parentElement as HTMLElement;
      expect(getComputedStyle(content).position).not.toBe("static");
      expect(Number(getComputedStyle(content).zIndex)).toBeGreaterThan(wrapperLayer);
    });

    it("sélectionne une option au clic malgré la pastille sur l'option active", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderControl(
        <SegmentedControl
          options={options}
          value="grid"
          onChange={onChange}
          ariaLabel="Affichage"
        />,
      );
      await user.click(screen.getByText("Liste"));
      expect(onChange).toHaveBeenCalledWith("list");
    });

    it("navigue au clavier vers l'option précédente avec la flèche gauche", () => {
      const onChange = vi.fn();
      renderControl(
        <SegmentedControl
          options={options}
          value="list"
          onChange={onChange}
          ariaLabel="Affichage"
        />,
      );
      fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowLeft" });
      expect(onChange).toHaveBeenCalledWith("grid");
    });
  });
});
