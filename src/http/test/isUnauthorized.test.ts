import { describe, expect, it } from "vitest";
import { CanopApiError } from "../ApiError";
import { isForbidden, isUnauthorized } from "../isUnauthorized";

describe("isUnauthorized", () => {
  it("reconnait un 401", () => {
    expect(isUnauthorized(new CanopApiError(401, "Non authentifie"))).toBe(true);
  });

  it("refuse un 403 : deja connecte, mais pas autorise", () => {
    const erreur = new CanopApiError(403, "Acces refuse");

    expect(isUnauthorized(erreur)).toBe(false);
    expect(isForbidden(erreur)).toBe(true);
  });

  it("refuse les autres codes", () => {
    for (const code of [400, 404, 500, 503]) {
      expect(isUnauthorized(new CanopApiError(code, "erreur"))).toBe(false);
    }
  });

  it("refuse ce qui n'est pas une erreur d'API : une panne n'est pas un refus", () => {
    expect(isUnauthorized(new TypeError("Failed to fetch"))).toBe(false);
    expect(isUnauthorized(new Error("boom"))).toBe(false);
    expect(isUnauthorized("401")).toBe(false);
    expect(isUnauthorized({ status: 401 })).toBe(false);
    expect(isUnauthorized(null)).toBe(false);
    expect(isUnauthorized(undefined)).toBe(false);
  });
});
