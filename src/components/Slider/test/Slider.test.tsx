import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Slider, type CanopSliderColor, type CanopSliderSize } from "../Slider";
import { SLIDER_COARSE_TARGET, sliderMetrics } from "../sliderHelpers";

const colors: CanopSliderColor[] = ["primary", "secondary", "accent", "success"];

function renderSlider(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function dragSliderTo(value: number) {
  fireEvent.change(screen.getByRole("slider"), { target: { value: String(value) } });
}

function sliderRootOf(container: HTMLElement) {
  return container.querySelector(".MuiSlider-root");
}

describe("Slider - décimales déduites du step", () => {
  it("affiche la valeur sans décimale quand le step vaut 1", () => {
    renderSlider(<Slider value={3} onChange={() => {}} label="Volume" step={1} showValue />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("affiche la valeur avec une décimale quand le step vaut 0.5", () => {
    renderSlider(<Slider value={3} onChange={() => {}} label="Volume" step={0.5} showValue />);
    expect(screen.getByText("3.0")).toBeInTheDocument();
    expect(screen.queryByText("3")).toBeNull();
  });

  it("affiche la valeur avec deux décimales quand le step vaut 0.25", () => {
    renderSlider(<Slider value={2} onChange={() => {}} label="Volume" step={0.25} showValue />);
    expect(screen.getByText("2.00")).toBeInTheDocument();
  });

  it("affiche autant de décimales que le step en notation exponentielle", () => {
    renderSlider(
      <Slider value={0.0000001} onChange={() => {}} label="Précision" step={1e-7} showValue />,
    );
    expect(screen.getByText("0.0000001")).toBeInTheDocument();
  });

  it("affiche la valeur sans décimale quand le step est nul", () => {
    renderSlider(<Slider value={4} onChange={() => {}} label="Volume" step={0} showValue />);
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("affiche la valeur sans décimale quand le step est négatif", () => {
    renderSlider(<Slider value={4} onChange={() => {}} label="Volume" step={-1} showValue />);
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});

describe("Slider - libellé et valeur affichée", () => {
  it("affiche le libellé à gauche et la valeur à droite quand showValue est actif", () => {
    renderSlider(<Slider value={3} onChange={() => {}} label="Volume" step={0.5} showValue />);
    const label = screen.getByText("Volume");
    const value = screen.getByText("3.0");
    expect(label.parentElement).toBe(value.parentElement);
    expect(label.compareDocumentPosition(value) & Node.DOCUMENT_POSITION_FOLLOWING).toBeGreaterThan(
      0,
    );
  });

  it("n'affiche aucune valeur quand showValue est absent", () => {
    renderSlider(<Slider value={3} onChange={() => {}} label="Volume" step={0.5} />);
    expect(screen.getByText("Volume")).toBeInTheDocument();
    expect(screen.queryByText("3.0")).toBeNull();
  });

  it("affiche la valeur même sans libellé", () => {
    renderSlider(<Slider value={42} onChange={() => {}} showValue />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("n'affiche ni libellé ni valeur quand les deux sont absents", () => {
    renderSlider(<Slider value={3} onChange={() => {}} />);
    expect(screen.queryByText("3")).toBeNull();
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("expose le libellé comme nom accessible du slider", () => {
    renderSlider(<Slider value={3} onChange={() => {}} label="Volume" />);
    expect(screen.getByRole("slider", { name: "Volume" })).toBeInTheDocument();
  });

  it("relie le libellé visible au slider par aria-labelledby", () => {
    renderSlider(<Slider value={3} onChange={() => {}} label="Volume" />);
    const labelledBy = screen.getByRole("slider").getAttribute("aria-labelledby");
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy!)).toHaveTextContent("Volume");
  });

  it("laisse ariaLabel primer sur le libellé visible", () => {
    renderSlider(<Slider value={3} onChange={() => {}} label="Volume" ariaLabel="Niveau" />);
    expect(screen.getByRole("slider", { name: "Niveau" })).toBeInTheDocument();
    expect(screen.getByRole("slider")).not.toHaveAttribute("aria-labelledby");
  });

  it("nomme le slider avec ariaLabel quand aucun libellé n'est visible", () => {
    renderSlider(<Slider value={3} onChange={() => {}} ariaLabel="Volume sonore" />);
    expect(screen.getByRole("slider", { name: "Volume sonore" })).toBeInTheDocument();
    expect(screen.queryByText("Volume sonore")).not.toBeInTheDocument();
  });

  it("n'invente aucun nom quand ni label ni ariaLabel ne sont fournis", () => {
    renderSlider(<Slider value={3} onChange={() => {}} />);
    expect(screen.getByRole("slider")).not.toHaveAttribute("aria-label");
    expect(screen.getByRole("slider")).not.toHaveAttribute("aria-labelledby");
  });
});

describe("Slider - interaction contrôlée", () => {
  it("appelle onChange avec la nouvelle valeur numérique", () => {
    const onChange = vi.fn();
    renderSlider(<Slider value={3} onChange={onChange} label="Volume" min={0} max={10} step={1} />);
    dragSliderTo(7);
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it("n'affiche que la valeur pilotée par la prop value", () => {
    const onChange = vi.fn();
    renderSlider(
      <Slider value={3} onChange={onChange} label="Volume" min={0} max={10} step={1} showValue />,
    );
    dragSliderTo(7);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "3");
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("désactive le slider quand disabled est actif", () => {
    renderSlider(<Slider value={3} onChange={() => {}} label="Volume" disabled />);
    expect(screen.getByRole("slider")).toBeDisabled();
  });

  it("n'appelle pas onChange lors d'une interaction utilisateur quand disabled", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onChange = vi.fn();
    renderSlider(<Slider value={3} onChange={onChange} label="Volume" disabled />);
    const slider = screen.getByRole("slider");
    await user.click(slider);
    await user.keyboard("{ArrowRight}");
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("Slider - bornes et pas", () => {
  it("applique les bornes et le pas fournis", () => {
    renderSlider(
      <Slider value={12} onChange={() => {}} label="Volume" min={10} max={20} step={2} />,
    );
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("min", "10");
    expect(slider).toHaveAttribute("max", "20");
    expect(slider).toHaveAttribute("step", "2");
    expect(slider).toHaveAttribute("aria-valuemin", "10");
    expect(slider).toHaveAttribute("aria-valuemax", "20");
  });

  it("applique les bornes et le pas par défaut", () => {
    renderSlider(<Slider value={12} onChange={() => {}} label="Volume" />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "100");
    expect(slider).toHaveAttribute("step", "1");
  });
});

describe("Slider - graduations", () => {
  it("affiche une graduation par pas quand marks est actif", () => {
    const { container } = renderSlider(
      <Slider value={2} onChange={() => {}} label="Volume" min={0} max={4} step={1} marks />,
    );
    expect(container.querySelectorAll(".MuiSlider-mark")).toHaveLength(5);
  });

  it("n'affiche aucune graduation par défaut", () => {
    const { container } = renderSlider(
      <Slider value={2} onChange={() => {}} label="Volume" min={0} max={4} step={1} />,
    );
    expect(container.querySelectorAll(".MuiSlider-mark")).toHaveLength(0);
  });
});

describe("Slider - couleurs", () => {
  it.each(colors)("accepte la couleur %s", (color) => {
    renderSlider(<Slider value={3} onChange={() => {}} label="Volume" color={color} />);
    expect(screen.getByRole("slider", { name: "Volume" })).toBeInTheDocument();
  });

  it("applique une déclinaison visuelle distincte pour chacune des quatre couleurs", () => {
    const rootClassNames = colors.map((color) => {
      const { container, unmount } = renderSlider(
        <Slider value={3} onChange={() => {}} label="Volume" color={color} />,
      );
      const rootClassName = sliderRootOf(container)?.className ?? "";
      unmount();
      return rootClassName;
    });
    expect(new Set(rootClassNames).size).toBe(colors.length);
  });

  it("utilise la couleur primary par défaut", () => {
    const { container } = renderSlider(<Slider value={3} onChange={() => {}} label="Volume" />);
    expect(sliderRootOf(container)).toHaveClass("MuiSlider-colorPrimary");
  });
});

describe("Slider - tailles", () => {
  const sizes: CanopSliderSize[] = ["small", "medium"];

  it.each(sizes)("accepte la taille %s", (size) => {
    renderSlider(<Slider value={3} onChange={() => {}} label="Volume" size={size} />);
    expect(screen.getByRole("slider", { name: "Volume" })).toBeInTheDocument();
  });

  it("donne une pastille et un rail distincts a chaque taille", () => {
    const rendered = sizes.map((size) => {
      const { container, unmount } = renderSlider(
        <Slider value={3} onChange={() => {}} label="Volume" size={size} />,
      );
      const className = sliderRootOf(container)?.className ?? "";
      unmount();
      return className;
    });
    expect(new Set(rendered).size).toBe(sizes.length);
  });

  it("utilise medium par defaut", () => {
    const { container } = renderSlider(<Slider value={3} onChange={() => {}} label="Volume" />);
    const parDefaut = sliderRootOf(container)?.className ?? "";
    const { container: autre } = renderSlider(
      <Slider value={3} onChange={() => {}} label="Volume" size="medium" />,
    );
    expect(parDefaut).toBe(sliderRootOf(autre)?.className);
  });

  it("atteint la cible tactile de reference au doigt, a chaque taille", () => {
    const rem = (v: string) => parseFloat(v);
    for (const size of sizes) {
      const { thumbHeight, rail, padding, coarsePadding } = sliderMetrics[size];
      expect(rem(rail) + 2 * rem(coarsePadding)).toBeCloseTo(rem(SLIDER_COARSE_TARGET), 5);
      expect(rem(rail) + 2 * rem(padding)).toBeLessThan(rem(SLIDER_COARSE_TARGET));
      expect(rem(rail) + 2 * rem(padding)).toBeGreaterThanOrEqual(rem(thumbHeight));
    }
  });
});

describe("Slider - mise en forme de la valeur", () => {
  it("applique format a la valeur affichee", () => {
    renderSlider(
      <Slider value={62} onChange={() => {}} label="Seuil" showValue format={(v) => `${v} %`} />,
    );
    expect(screen.getByText("62 %")).toBeInTheDocument();
  });

  it("applique format au texte lu par les technologies d'assistance", () => {
    renderSlider(
      <Slider
        value={1200}
        onChange={() => {}}
        label="Budget"
        max={5000}
        format={(v) => `${v} EUR`}
      />,
    );
    expect(screen.getByRole("slider", { name: "Budget" })).toHaveAttribute(
      "aria-valuetext",
      "1200 EUR",
    );
  });

  it("retombe sur les decimales du step sans format", () => {
    renderSlider(<Slider value={3} onChange={() => {}} label="Volume" step={0.5} showValue />);
    expect(screen.getByText("3.0")).toBeInTheDocument();
  });
});
