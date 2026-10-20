import { describe, expect, it } from "vitest";
import { classifyUrl, isSafeUrl } from "../url";

describe("classifyUrl", () => {
  it("accepte http et https", () => {
    expect(classifyUrl("https://qvl-project.com/doc")).toBe("http");
    expect(classifyUrl("http://localhost:5173/x")).toBe("http");
  });

  it("bloque les schemas executables", () => {
    for (const url of [
      "javascript:alert(1)",
      "JavaScript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "blob:https://qvl-project.com/abc",
      "vbscript:msgbox(1)",
      "file:///etc/passwd",
    ]) {
      expect(classifyUrl(url)).toBe("blocked");
      expect(isSafeUrl(url)).toBe(false);
    }
  });

  it("traite un chemin comme relatif, ce qui n'est pas un echec", () => {
    for (const url of ["./guide.md", "../autre/page", "/absolu", "guide.md", "#ancre"]) {
      expect(classifyUrl(url)).toBe("relative");
      expect(isSafeUrl(url)).toBe(true);
    }
  });

  it("traite une URL malformee comme relative, jamais comme sure par defaut", () => {
    expect(classifyUrl("https://")).toBe("relative");
    expect(classifyUrl("")).toBe("relative");
  });

  it("ne se laisse pas tromper par les espaces de tete", () => {
    expect(classifyUrl(" javascript:alert(1)")).toBe("blocked");
    expect(classifyUrl("\njavascript:alert(1)")).toBe("blocked");
  });
});
