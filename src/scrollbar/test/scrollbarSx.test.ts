import { describe, expect, it } from "vitest";
import { scrollbarSx } from "../scrollbarSx";
import { scrollbar } from "../../tokens/scrollbar";

describe("scrollbarSx", () => {
  it("dessine la meme barre par defaut", () => {
    const style = scrollbarSx();

    expect(style["&::-webkit-scrollbar"]).toEqual({
      width: scrollbar.width,
      height: scrollbar.width,
    });
    expect(style["@supports not selector(::-webkit-scrollbar)"]).toEqual({
      scrollbarWidth: "thin",
      scrollbarColor: expect.stringContaining("--canop-scrollbar-thumb"),
    });
  });

  it("amincit la barre sans changer sa forme", () => {
    const fine = scrollbarSx("thin");
    const defaut = scrollbarSx();

    expect(fine["&::-webkit-scrollbar"]).toEqual({
      width: scrollbar.widthThin,
      height: scrollbar.widthThin,
    });
    expect(fine["&::-webkit-scrollbar-thumb"]).toEqual(defaut["&::-webkit-scrollbar-thumb"]);
  });

  it("efface la barre des deux moteurs a la fois", () => {
    const style = scrollbarSx("hidden");

    expect(style.scrollbarWidth).toBe("none");
    expect(style["&::-webkit-scrollbar"]).toEqual({ display: "none" });
  });

  it("passe par des variables surchargeables plutot que par la palette", () => {
    const pouce = scrollbarSx()["&::-webkit-scrollbar-thumb"] as Record<string, string>;

    expect(pouce.backgroundImage).toContain("--canop-scrollbar-thumb");
    expect(pouce.backgroundImage).toContain("--canop-palette-primary-main");
  });
});

describe("scrollbarSx - habillage", () => {
  it("degrade le pouce du fonce au clair sur sa hauteur", () => {
    const pouce = scrollbarSx()["&::-webkit-scrollbar-thumb"] as Record<string, string>;
    const repos = pouce.backgroundImage.slice(
      pouce.backgroundImage.lastIndexOf("linear-gradient(180deg"),
    );

    expect(repos).toContain("linear-gradient(180deg");
    expect(repos.indexOf("--canop-palette-primary-dark")).toBeLessThan(
      repos.indexOf("--canop-palette-primary-light"),
    );
  });

  it("eclaircit au survol et assombrit a l'appui", () => {
    const style = scrollbarSx();
    const survol = style["&::-webkit-scrollbar-thumb:hover"] as Record<string, string>;
    const enfonce = style["&::-webkit-scrollbar-thumb:active"] as Record<string, string>;

    expect(survol.backgroundImage).toContain("--canop-palette-primary-light");
    expect(survol.backgroundImage).not.toContain("--canop-palette-primary-dark");
    expect(enfonce.backgroundImage).toContain("--canop-palette-primary-dark");
    expect(enfonce.backgroundImage).not.toContain("--canop-palette-primary-light");
  });

  it("biseaute le pouce par des ombres internes, seules a suivre la zone peinte", () => {
    const pouce = scrollbarSx()["&::-webkit-scrollbar-thumb"] as Record<string, string>;
    const couches = pouce.boxShadow.replace(/rgba\([^)]*\)/g, "couleur").split(",");

    expect(couches.length).toBeGreaterThan(1);
    expect(couches.every((couche) => couche.trim().startsWith("inset"))).toBe(true);
  });

  it("inverse le biseau a l'enfoncement", () => {
    const style = scrollbarSx();
    const repos = style["&::-webkit-scrollbar-thumb"] as Record<string, string>;
    const enfonce = style["&::-webkit-scrollbar-thumb:active"] as Record<string, string>;

    expect(enfonce.boxShadow).not.toBe(repos.boxShadow);
    expect(enfonce.boxShadow).toContain("inset");
  });
});

describe("scrollbarSx - stries", () => {
  it("empile la strie au-dessus du degrade", () => {
    const pouce = scrollbarSx()["&::-webkit-scrollbar-thumb"] as Record<string, string>;
    const couches = pouce.backgroundImage.split("), ");

    expect(couches[0]).toContain("repeating-linear-gradient");
    expect(pouce.backgroundImage.indexOf("repeating-linear-gradient")).toBeLessThan(
      pouce.backgroundImage.lastIndexOf("linear-gradient(180deg"),
    );
  });

  it("borne la strie a trois traits en la dimensionnant", () => {
    const pouce = scrollbarSx()["&::-webkit-scrollbar-thumb"] as Record<string, string>;
    const [largeur, hauteur] = scrollbar.gripHeight
      ? [scrollbar.gripWidth, scrollbar.gripHeight]
      : ["", ""];

    expect(pouce.backgroundSize).toBe(`${largeur} ${hauteur}, auto`);
    expect(pouce.backgroundRepeat).toBe("no-repeat, no-repeat");
    expect(parseFloat(scrollbar.gripHeight) / parseFloat(scrollbar.gripPeriod)).toBeCloseTo(2.25);
  });

  it("garde la strie dans les etats survole et enfonce", () => {
    const style = scrollbarSx();
    const survol = style["&::-webkit-scrollbar-thumb:hover"] as Record<string, string>;
    const enfonce = style["&::-webkit-scrollbar-thumb:active"] as Record<string, string>;

    expect(survol.backgroundImage).toContain("repeating-linear-gradient");
    expect(enfonce.backgroundImage).toContain("repeating-linear-gradient");
  });

  it("redonne au pouce une decoupe en superellipse", () => {
    const pouce = scrollbarSx()["&::-webkit-scrollbar-thumb"] as Record<string, string>;

    expect(pouce.clipPath).toContain("polygon(");
    expect(pouce.clipPath).not.toContain("content-box");
  });
});
