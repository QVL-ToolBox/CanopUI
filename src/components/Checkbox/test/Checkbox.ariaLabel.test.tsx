import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Checkbox } from "../Checkbox";

function renderInTheme(ui: React.ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => <CanopThemeProvider>{children}</CanopThemeProvider>,
  });
}

const noop = () => undefined;

describe("Checkbox - ariaLabel", () => {
  it("donne le nom accessible sans libellé visible", () => {
    renderInTheme(<Checkbox checked={false} onChange={noop} ariaLabel="Beurre doux" />);
    expect(screen.getByRole("checkbox")).toHaveAccessibleName("Beurre doux");
  });

  it("donne le nom accessible avec un libellé visible", () => {
    renderInTheme(
      <Checkbox checked={false} onChange={noop} label="Libellé visible" ariaLabel="Beurre doux" />,
    );
    expect(screen.getByRole("checkbox")).toHaveAccessibleName("Beurre doux");
    expect(screen.getByText("Libellé visible")).toBeInTheDocument();
  });

  it("garde le libellé visible comme nom accessible sans ariaLabel", () => {
    renderInTheme(<Checkbox checked={false} onChange={noop} label="Libellé visible" />);
    expect(screen.getByRole("checkbox")).toHaveAccessibleName("Libellé visible");
  });
});
