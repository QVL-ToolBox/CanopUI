import { describe, expect, it } from "vitest";
import { cloneElement } from "react";
import { render } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Icon } from "../Icon";

function renderIcon(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("Icon - propagation de className", () => {
  it("applique la classe recue au SVG", () => {
    const { container } = renderIcon(<Icon name="shield" className="ma-classe" />);
    expect(container.querySelector("svg")).toHaveClass("ma-classe");
  });

  it("survit au clonage que pratiquent les composants MUI a icone", () => {
    const clone = cloneElement(<Icon name="shield" />, { className: "MuiChip-icon" });
    const { container } = renderIcon(clone);
    expect(container.querySelector("svg")).toHaveClass("MuiChip-icon");
  });
});
