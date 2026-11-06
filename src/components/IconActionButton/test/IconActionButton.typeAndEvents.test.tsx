import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { IconActionButton } from "../IconActionButton";

function renderInTheme(ui: React.ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => <CanopThemeProvider>{children}</CanopThemeProvider>,
  });
}

function formSpy() {
  return vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
}

describe("IconActionButton - type", () => {
  it("soumet le formulaire parent avec type submit", async () => {
    const onSubmit = formSpy();
    renderInTheme(
      <form onSubmit={onSubmit}>
        <IconActionButton icon="plus" ariaLabel="Valider" type="submit" />
      </form>,
    );
    await userEvent.setup().click(screen.getByRole("button", { name: "Valider" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("vaut button par défaut et ne soumet pas le formulaire parent", async () => {
    const onSubmit = formSpy();
    renderInTheme(
      <form onSubmit={onSubmit}>
        <IconActionButton icon="plus" ariaLabel="Valider" />
      </form>,
    );
    const button = screen.getByRole("button", { name: "Valider" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.setup().click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("porte l'attribut type submit quand il est demandé", () => {
    renderInTheme(<IconActionButton icon="plus" ariaLabel="Valider" type="submit" />);
    expect(screen.getByRole("button", { name: "Valider" })).toHaveAttribute("type", "submit");
  });

  it("force le type button pendant le chargement et ne soumet pas le formulaire", async () => {
    const onSubmit = formSpy();
    renderInTheme(
      <form onSubmit={onSubmit}>
        <IconActionButton icon="plus" ariaLabel="Valider" type="submit" loading />
      </form>,
    );
    const button = screen.getByRole("button", { name: "Valider" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.setup({ pointerEventsCheck: 0 }).click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("retrouve le type submit à la fin du chargement", () => {
    const { rerender } = renderInTheme(
      <IconActionButton icon="plus" ariaLabel="Valider" type="submit" loading />,
    );
    rerender(<IconActionButton icon="plus" ariaLabel="Valider" type="submit" />);
    expect(screen.getByRole("button", { name: "Valider" })).toHaveAttribute("type", "submit");
  });
});

describe("IconActionButton - événements de pression", () => {
  it("transmet onMouseDown", () => {
    const onMouseDown = vi.fn();
    renderInTheme(<IconActionButton icon="plus" ariaLabel="Valider" onMouseDown={onMouseDown} />);
    fireEvent.mouseDown(screen.getByRole("button", { name: "Valider" }));
    expect(onMouseDown).toHaveBeenCalledOnce();
  });

  it("transmet onPointerDown", () => {
    const onPointerDown = vi.fn();
    renderInTheme(
      <IconActionButton icon="plus" ariaLabel="Valider" onPointerDown={onPointerDown} />,
    );
    fireEvent.pointerDown(screen.getByRole("button", { name: "Valider" }));
    expect(onPointerDown).toHaveBeenCalledOnce();
  });

  it("transmet les deux lors d'un clic réel", async () => {
    const onMouseDown = vi.fn();
    const onPointerDown = vi.fn();
    renderInTheme(
      <IconActionButton
        icon="plus"
        ariaLabel="Valider"
        onMouseDown={onMouseDown}
        onPointerDown={onPointerDown}
      />,
    );
    await userEvent.setup().click(screen.getByRole("button", { name: "Valider" }));
    expect(onMouseDown).toHaveBeenCalledOnce();
    expect(onPointerDown).toHaveBeenCalledOnce();
  });
});
