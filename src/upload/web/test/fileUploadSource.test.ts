import { describe, expect, it } from "vitest";
import { fileUploadSource } from "../fileUploadSource";

function makeFile(content: string, name = "note.txt", type = "text/plain"): File {
  return new File([content], name, { type });
}

describe("fileUploadSource - description du fichier", () => {
  it("reprend le nom et la taille du fichier", () => {
    const source = fileUploadSource(makeFile("abcdef"));
    expect(source.name).toBe("note.txt");
    expect(source.size).toBe(6);
  });

  it("reprend le type MIME quand le navigateur le connait", () => {
    expect(fileUploadSource(makeFile("abc")).mime).toBe("text/plain");
  });

  it("laisse le type MIME indefini quand le fichier n'en porte pas", () => {
    expect(fileUploadSource(makeFile("abc", "inconnu.bin", "")).mime).toBeUndefined();
  });
});

describe("fileUploadSource - decoupe en fragments", () => {
  it("renvoie les octets de l'intervalle demande", async () => {
    const source = fileUploadSource(makeFile("abcdef"));
    const bytes = await source.slice(1, 4);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(new TextDecoder().decode(bytes)).toBe("bcd");
  });

  it("renvoie le fichier entier quand l'intervalle le couvre", async () => {
    const source = fileUploadSource(makeFile("abcdef"));
    const bytes = await source.slice(0, source.size);
    expect(bytes).toHaveLength(6);
  });

  it("renvoie un fragment vide quand les bornes se rejoignent", async () => {
    const source = fileUploadSource(makeFile("abcdef"));
    await expect(source.slice(2, 2)).resolves.toHaveLength(0);
  });

  it("tronque un intervalle qui depasse la fin du fichier", async () => {
    const source = fileUploadSource(makeFile("abcdef"));
    await expect(source.slice(4, 99)).resolves.toHaveLength(2);
  });

  it("gere un fichier vide", async () => {
    const source = fileUploadSource(makeFile(""));
    expect(source.size).toBe(0);
    await expect(source.slice(0, 0)).resolves.toHaveLength(0);
  });
});
