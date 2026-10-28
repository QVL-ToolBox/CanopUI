import { describe, expect, it } from "vitest";
import { formatClockTime, parseClockTime } from "..";

describe("parseClockTime", () => {
  it.each([
    ["9:30", { hours: 9, minutes: 30 }],
    ["09:30", { hours: 9, minutes: 30 }],
    ["0930", { hours: 9, minutes: 30 }],
    ["9h30", { hours: 9, minutes: 30 }],
    ["9H30", { hours: 9, minutes: 30 }],
    [" 9:30 ", { hours: 9, minutes: 30 }],
    ["00:00", { hours: 0, minutes: 0 }],
    ["23:59", { hours: 23, minutes: 59 }],
  ])("lit « %s »", (saisie, attendu) => {
    expect(parseClockTime(saisie)).toEqual(attendu);
  });

  it.each(["", "abc", "24:00", "09:60", "25h", "-1:00", "9:3a", "99:99", "12:345"])(
    "refuse « %s »",
    (saisie) => {
      expect(parseClockTime(saisie)).toBeNull();
    },
  );
});

describe("formatClockTime", () => {
  it("complète heures et minutes sur deux chiffres", () => {
    expect(formatClockTime({ hours: 9, minutes: 5 })).toBe("09:05");
  });

  it("relit ce qu'il écrit", () => {
    expect(parseClockTime(formatClockTime({ hours: 23, minutes: 0 }))).toEqual({
      hours: 23,
      minutes: 0,
    });
  });
});
