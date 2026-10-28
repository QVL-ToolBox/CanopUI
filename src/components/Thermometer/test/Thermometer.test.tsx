import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Thermometer } from "../Thermometer";
import type { CanopThermometerProps } from "../Thermometer";

function renderThermometer(props: CanopThermometerProps) {
  render(
    <CanopThemeProvider>
      <Thermometer label="Tctl" animated={false} {...props} />
    </CanopThemeProvider>,
  );
  return screen.getByRole("meter", { name: "Tctl" });
}

describe("Thermometer", () => {
  it("expose un meter avec aria-valuenow, min et max", () => {
    const meter = renderThermometer({ value: 54, high: 80, critical: 95 });
    expect(meter).toHaveAttribute("aria-valuenow", "54");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
  });

  it.each([
    [50, "normale"],
    [79.9, "normale"],
    [80, "élevée"],
    [94.9, "élevée"],
    [95, "critique"],
    [110, "critique"],
  ])("à %s °C avec high 80 et critical 95, le niveau est %s", (value, niveau) => {
    const meter = renderThermometer({ value, high: 80, critical: 95 });
    expect(meter.getAttribute("aria-valuetext")?.endsWith(`, ${niveau}`)).toBe(true);
  });

  it("annonce la valeur avec son unité", () => {
    const meter = renderThermometer({ value: 54, high: 80, critical: 95 });
    expect(meter).toHaveAttribute("aria-valuetext", "54 °C, normale");
    expect(screen.getByText("54 °C")).toBeInTheDocument();
  });

  it("utilise ses seuils par défaut sans high ni critical", () => {
    const meter = renderThermometer({ value: 50 });
    expect(meter.getAttribute("aria-valuetext")?.endsWith("normale")).toBe(true);
  });

  it("respecte des seuils personnalisés", () => {
    const meter = renderThermometer({ value: 50, high: 40, critical: 60 });
    expect(meter.getAttribute("aria-valuetext")?.endsWith("élevée")).toBe(true);
  });

  it("valeur null : pas d'aria-valuenow et une valeur inconnue annoncée", () => {
    const meter = renderThermometer({ value: null, high: 80, critical: 95 });
    expect(meter).not.toHaveAttribute("aria-valuenow");
    expect(meter).toHaveAttribute("aria-valuetext", "Valeur inconnue");
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
