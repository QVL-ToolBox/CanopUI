import { describe, expect, it, vi } from "vitest";
import type { MouseEvent } from "react";
import { isItemActive, navigateFromEvent } from "../navigation";
import { isItemActive as reExportedFromBarrel } from "../index";
import { NavbarItem } from "../NavbarItem";
import { Navbar } from "../Navbar";

describe("navigation (module partage anti-import-circulaire)", () => {
  it("expose isItemActive sans dependre du composant Navbar", () => {
    expect(typeof isItemActive).toBe("function");
    expect(isItemActive("/studio", "/studio/canopui")).toBe(true);
    expect(isItemActive("/studio", "/dashboard")).toBe(false);
    expect(isItemActive("/", "/")).toBe(true);
    expect(isItemActive("/", "/dashboard")).toBe(false);
    expect(isItemActive("/dashboard", undefined)).toBe(false);
  });

  it("le barrel Navbar re-exporte la meme reference isItemActive que le module partage", () => {
    expect(reExportedFromBarrel).toBe(isItemActive);
  });

  it("charge Navbar et NavbarItem sans erreur d'initialisation circulaire", () => {
    expect(Navbar).toBeTypeOf("function");
    expect(NavbarItem).toBeTypeOf("function");
  });
});

describe("navigateFromEvent", () => {
  function clickEvent() {
    return { preventDefault: vi.fn() } as unknown as MouseEvent;
  }

  it("neutralise la navigation par defaut et delegue a onNavigate", () => {
    const event = clickEvent();
    const onNavigate = vi.fn();

    navigateFromEvent(event, "/users", onNavigate);

    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(onNavigate).toHaveBeenCalledWith("/users");
  });

  it("laisse le lien naviguer nativement sans onNavigate", () => {
    const event = clickEvent();

    navigateFromEvent(event, "/users");

    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
