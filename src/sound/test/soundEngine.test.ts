import { afterEach, describe, expect, it, vi } from "vitest";
import { createSoundEngine } from "../soundEngine";
import { canopSoundRecipes } from "../soundRecipes";
import { installFakeAudio, removeAudioContext, type FakeAudio } from "./fakeAudio";

let audio: FakeAudio | null = null;
let restoreMissing: (() => void) | null = null;

afterEach(() => {
  audio?.restore();
  audio = null;
  restoreMissing?.();
  restoreMissing = null;
  vi.unstubAllGlobals();
});

describe("createSoundEngine — la synthèse", () => {
  it("joue une note par note de la recette, avec sa hauteur et sa forme", () => {
    audio = installFakeAudio();
    const engine = createSoundEngine();

    expect(engine.play("correct")).toBe("synth");
    expect(audio.notes).toHaveLength(canopSoundRecipes.correct.length);
    expect(audio.notes.map((note) => note.frequency)).toEqual(
      canopSoundRecipes.correct.map((note) => note.frequency),
    );
    expect(audio.notes.every((note) => note.wave === "triangle")).toBe(true);
  });

  it("échelonne les notes dans le temps au lieu de les empiler", () => {
    audio = installFakeAudio();
    createSoundEngine().play("finish");

    const departs = audio.notes.map((note) => note.start);
    expect(departs).toEqual([...departs].sort((a, b) => a - b));
    expect(new Set(departs).size).toBe(departs.length);
  });

  it("applique le volume général au volume de chaque note", () => {
    audio = installFakeAudio();
    const engine = createSoundEngine();

    engine.play("click", { volume: 0.5 });
    const attendu = (canopSoundRecipes.click[0].gain ?? 0.12) * 0.5;
    expect(audio.notes[0].peak).toBeCloseTo(attendu, 5);
  });

  it("borne un volume aberrant plutôt que de saturer", () => {
    audio = installFakeAudio();
    const engine = createSoundEngine();

    engine.play("click", { volume: 40 });
    expect(audio.notes[0].peak).toBeCloseTo(canopSoundRecipes.click[0].gain ?? 0.12, 5);
  });

  it("accepte une recette maison à la place du catalogue", () => {
    audio = installFakeAudio();
    const engine = createSoundEngine({
      recipes: { click: [{ frequency: 111, duration: 0.2, wave: "square" }] },
    });

    engine.play("click");
    expect(audio.notes).toEqual([expect.objectContaining({ frequency: 111, wave: "square" })]);
  });
});

describe("createSoundEngine — ce qui empêche de jouer", () => {
  it("ne crée aucun contexte quand le son est coupé", () => {
    audio = installFakeAudio();
    const engine = createSoundEngine();

    expect(engine.play("click", { muted: true })).toBe("muted");
    expect(audio.created).toBe(0);
    expect(audio.notes).toHaveLength(0);
  });

  it("se déclare indisponible sans Web Audio, sans lever d'erreur", () => {
    restoreMissing = removeAudioContext();
    const engine = createSoundEngine();

    expect(engine.play("click")).toBe("unavailable");
  });

  it("réveille un contexte suspendu, sinon il jouerait dans le vide", () => {
    audio = installFakeAudio({ state: "suspended" });
    const engine = createSoundEngine();

    engine.play("click");
    expect(audio.resumed).toBeGreaterThan(0);
  });

  it("ne crée qu'un seul contexte pour toute la vie du moteur", () => {
    audio = installFakeAudio();
    const engine = createSoundEngine();

    engine.play("click");
    engine.play("start");
    engine.unlock();
    expect(audio.created).toBe(1);
  });

  it("ferme le contexte quand on le jette", () => {
    audio = installFakeAudio();
    const engine = createSoundEngine();

    engine.play("click");
    engine.dispose();
    expect(audio.closed).toBe(1);
  });
});

function stubFetch(response: Partial<Response> & { ok: boolean }) {
  const fetchMock = vi.fn(() => Promise.resolve(response as Response));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const okResponse = {
  ok: true,
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
};

describe("createSoundEngine — les fichiers", () => {
  it("joue le fichier une fois qu'il est décodé", async () => {
    audio = installFakeAudio();
    stubFetch(okResponse);
    const engine = createSoundEngine({ sources: { correct: "/sfx/correct.mp3" } });

    await engine.preload();

    expect(engine.play("correct")).toBe("file");
    expect(audio.buffers).toHaveLength(1);
    expect(audio.notes).toHaveLength(0);
  });

  it("porte le volume général sur le fichier aussi", async () => {
    audio = installFakeAudio();
    stubFetch(okResponse);
    const engine = createSoundEngine({ sources: { correct: "/sfx/correct.mp3" } });

    await engine.preload();
    engine.play("correct", { volume: 0.25 });

    expect(audio.buffers[0].volume).toBeCloseTo(0.25, 5);
  });

  it("synthétise le premier clic plutôt que de le rendre muet", () => {
    audio = installFakeAudio();
    stubFetch(okResponse);
    const engine = createSoundEngine({ sources: { click: "/sfx/click.mp3" } });

    expect(engine.play("click")).toBe("synth");
    expect(audio.notes).toHaveLength(1);
  });

  it("retombe sur la synthèse quand le fichier est introuvable", async () => {
    audio = installFakeAudio();
    stubFetch({ ok: false, status: 404 } as Partial<Response> & { ok: boolean });
    const engine = createSoundEngine({ sources: { wrong: "/sfx/absent.mp3" } });

    await engine.preload();

    expect(engine.play("wrong")).toBe("synth");
    expect(audio.notes.length).toBeGreaterThan(0);
  });

  it("retombe sur la synthèse quand le fichier est indécodable", async () => {
    audio = installFakeAudio({ decodeFails: true });
    stubFetch(okResponse);
    const engine = createSoundEngine({ sources: { wrong: "/sfx/casse.mp3" } });

    await engine.preload();

    expect(audio.decodeCalls).toBe(1);
    expect(engine.play("wrong")).toBe("synth");
  });

  it("n'insiste pas sur un fichier condamné", async () => {
    audio = installFakeAudio();
    const fetchMock = stubFetch({ ok: false, status: 500 } as Partial<Response> & { ok: boolean });
    const engine = createSoundEngine({ sources: { click: "/sfx/absent.mp3" } });

    await engine.preload();
    engine.play("click");
    engine.play("click");
    await Promise.resolve();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("ne va rien chercher quand aucun fichier n'est déclaré", async () => {
    audio = installFakeAudio();
    const fetchMock = stubFetch(okResponse);
    const engine = createSoundEngine();

    await engine.preload();
    engine.play("click");

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
