import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Clock } from "../Clock";
import { parseClockTime } from "..";

function renderClock(value: string, minuteStep?: number) {
  const onChange = vi.fn();
  render(
    <CanopThemeProvider>
      <Clock value={value} onChange={onChange} minuteStep={minuteStep} animated={false} />
    </CanopThemeProvider>,
  );
  return onChange;
}

function lastMinutes(onChange: ReturnType<typeof vi.fn>): number {
  const parsed = parseClockTime(String(onChange.mock.calls.at(-1)?.[0]));
  if (!parsed) throw new Error("no valid time emitted");
  return parsed.minutes;
}

describe("Clock", () => {
  it("affiche heures et minutes de la valeur, heures actives en premier", () => {
    renderClock("09:30");
    expect(screen.getByRole("button", { name: "Heures 09" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Minutes 30" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "9");
  });

  it("change l'heure au clavier sur le cadran", async () => {
    const user = userEvent.setup();
    const onChange = renderClock("09:30");
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenLastCalledWith("10:30");
  });

  it("avance les minutes du pas minuteStep", async () => {
    const user = userEvent.setup();
    const onChange = renderClock("09:30", 15);
    await user.click(screen.getByRole("button", { name: "Minutes 30" }));
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowUp}");
    expect(lastMinutes(onChange)).toBe(45);
  });

  it("utilise un pas de 5 minutes par défaut", async () => {
    const user = userEvent.setup();
    const onChange = renderClock("09:30");
    await user.click(screen.getByRole("button", { name: "Minutes 30" }));
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowUp}");
    expect(lastMinutes(onChange)).toBe(35);
  });

  it("reste un multiple du pas en revenant en arrière", async () => {
    const user = userEvent.setup();
    const onChange = renderClock("09:00", 15);
    await user.click(screen.getByRole("button", { name: "Minutes 00" }));
    screen.getByRole("slider").focus();
    await user.keyboard("{ArrowDown}");
    expect(lastMinutes(onChange)).toBe(45);
  });
});
