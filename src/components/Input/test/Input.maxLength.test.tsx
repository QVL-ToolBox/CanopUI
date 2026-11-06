import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Input } from "../Input";

function renderInput(maxLength?: number) {
  render(
    <CanopThemeProvider>
      <Input label="Nom" value="" onChange={() => undefined} maxLength={maxLength} />
    </CanopThemeProvider>,
  );
  return screen.getByRole("textbox", { name: "Nom" });
}

describe("Input - maxLength", () => {
  it("pose l'attribut maxlength natif", () => {
    expect(renderInput(40)).toHaveAttribute("maxlength", "40");
  });

  it("n'en pose aucun sans maxLength", () => {
    expect(renderInput()).not.toHaveAttribute("maxlength");
  });
});
