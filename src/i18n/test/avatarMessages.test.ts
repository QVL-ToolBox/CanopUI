import { describe, expect, it } from "vitest";
import { canopBaseMessages } from "../messages";

describe("messages de l'avatar", () => {
  it.each([
    ["fr", "Utilisateur anonyme"],
    ["en", "Anonymous user"],
  ] as const)(
    "given la locale %s, when on lit canop.avatar.anonymous, then on obtient %s",
    (locale, expected) => {
      expect(canopBaseMessages[locale]["canop.avatar.anonymous"]).toBe(expected);
    },
  );
});
