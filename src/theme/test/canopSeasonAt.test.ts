import { describe, expect, it } from "vitest";
import { canopSeasonAt } from "../../index";

const OCTOBER = 9;
const NOVEMBER = 10;
const DECEMBER = 11;

const years = [2025, 2026, 2028];

const halloweenDays = [
  ["15/10", OCTOBER, 15],
  ["31/10", OCTOBER, 31],
  ["01/11", NOVEMBER, 1],
] as const;

const ordinaryDays = [
  ["14/10", OCTOBER, 14],
  ["02/11", NOVEMBER, 2],
  ["25/12", DECEMBER, 25],
] as const;

const cases = <T extends readonly unknown[]>(days: readonly T[]) =>
  years.flatMap((year) => days.map((day) => [...day, year] as const));

describe("canopSeasonAt", () => {
  it.each(cases(halloweenDays))(
    "renvoie halloween le %s/%i en heure locale",
    (_label, month, day, year) => {
      expect(canopSeasonAt(new Date(year, month, day))).toBe("halloween");
    },
  );

  it.each(cases(ordinaryDays))(
    "renvoie null le %s/%i en heure locale",
    (_label, month, day, year) => {
      expect(canopSeasonAt(new Date(year, month, day))).toBeNull();
    },
  );

  it("renvoie halloween aux bornes extremes de la journee locale", () => {
    expect(canopSeasonAt(new Date(2026, OCTOBER, 15, 0, 0, 0))).toBe("halloween");
    expect(canopSeasonAt(new Date(2026, NOVEMBER, 1, 23, 59, 59))).toBe("halloween");
  });

  it("renvoie null aux bornes extremes des jours hors saison voisins", () => {
    expect(canopSeasonAt(new Date(2026, OCTOBER, 14, 23, 59, 59))).toBeNull();
    expect(canopSeasonAt(new Date(2026, NOVEMBER, 2, 0, 0, 0))).toBeNull();
  });
});
