import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type {
  CanopUploadPhase,
  CanopUploadProgress,
  CanopUploadResult,
  CanopUploadStrategy,
  CanopUploaderOptions,
} from "../../core";
import { useChunkedUpload } from "../useChunkedUpload";

const { createUploaderSpy } = vi.hoisted(() => ({ createUploaderSpy: vi.fn() }));

vi.mock("../../core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../core")>();
  return { ...actual, createUploader: createUploaderSpy };
});

const uploadResult: CanopUploadResult = {
  strategy: "chunked",
  node: { id: "node-1", parent_id: "root", name: "video.mp4", size: 12 },
};

function makeUploader() {
  return {
    start: vi.fn(async () => uploadResult),
    pause: vi.fn(),
    resume: vi.fn(async () => uploadResult),
    abort: vi.fn(async () => undefined),
    getProgress: vi.fn(),
  };
}

let uploader: ReturnType<typeof makeUploader>;

function lastOptions(): CanopUploaderOptions {
  return createUploaderSpy.mock.calls.at(-1)?.[0] as CanopUploaderOptions;
}

function emitProgress(phase: CanopUploadPhase, strategy: CanopUploadStrategy = "chunked"): void {
  const progress: CanopUploadProgress = {
    phase,
    strategy,
    uploadedBytes: 4,
    totalBytes: 12,
    ratio: 1 / 3,
    percentage: 33,
    chunkCount: 3,
    completedChunkCount: 1,
  };
  act(() => lastOptions().onProgress?.(progress));
}

function makeFile(name = "video.mp4"): File {
  return new File(["abc"], name, { type: "video/mp4" });
}

function renderUpload(overrides: Partial<Parameters<typeof useChunkedUpload>[0]> = {}) {
  return renderHook(() =>
    useChunkedUpload({
      basePath: "/api",
      getToken: () => "tok",
      ...overrides,
    }),
  );
}

beforeEach(() => {
  uploader = makeUploader();
  createUploaderSpy.mockReturnValue(uploader);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("useChunkedUpload - selection de fichier", () => {
  it("part d'un etat inactif sans fichier ni erreur", () => {
    const { result } = renderUpload();
    expect(result.current.fileName).toBeNull();
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.progress.phase).toBe("idle");
    expect(result.current.isActive).toBe(false);
  });

  it("memorise le nom du fichier selectionne", () => {
    const { result } = renderUpload();
    act(() => result.current.selectFile(makeFile("clip.mp4")));
    expect(result.current.fileName).toBe("clip.mp4");
  });

  it("n'instancie aucun uploader tant que le televersement n'est pas lance", () => {
    const { result } = renderUpload();
    act(() => result.current.selectFile(makeFile()));
    expect(createUploaderSpy).not.toHaveBeenCalled();
  });

  it("ignore le lancement quand aucun fichier n'est selectionne", () => {
    const { result } = renderUpload();
    act(() => result.current.start());
    expect(createUploaderSpy).not.toHaveBeenCalled();
  });
});

describe("useChunkedUpload - lancement", () => {
  it("transmet la configuration et le dossier parent a l'uploader", async () => {
    const { result } = renderUpload({ parentId: "folder-42", filesPath: "/f", chunkSize: 512 });
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    expect(lastOptions()).toMatchObject({ basePath: "/api", filesPath: "/f", chunkSize: 512 });
    expect(uploader.start).toHaveBeenCalledWith(expect.objectContaining({ parentId: "folder-42" }));
  });

  it("construit la source a partir du fichier selectionne", async () => {
    const { result } = renderUpload();
    act(() => result.current.selectFile(makeFile("clip.mp4")));
    await act(async () => result.current.start());
    expect(uploader.start).toHaveBeenCalledWith(
      expect.objectContaining({
        source: expect.objectContaining({ name: "clip.mp4", size: 3 }),
      }),
    );
  });

  it("notifie l'appelant a la fin du televersement", async () => {
    const onCompleted = vi.fn();
    const { result } = renderUpload({ onCompleted });
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    expect(onCompleted).toHaveBeenCalledWith(uploadResult);
    expect(result.current.errorMessage).toBeNull();
  });

  it("ne casse pas quand aucun callback de fin n'est fourni", async () => {
    const { result } = renderUpload();
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    expect(result.current.errorMessage).toBeNull();
  });
});

describe("useChunkedUpload - gestion des echecs", () => {
  it("expose le message d'erreur et previent l'appelant", async () => {
    const onError = vi.fn();
    const failure = new Error("Serveur indisponible");
    uploader.start.mockRejectedValue(failure);
    const { result } = renderUpload({ onError });
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    expect(result.current.errorMessage).toBe("Serveur indisponible");
    expect(onError).toHaveBeenCalledWith(failure);
  });

  it("retient le message i18n par defaut quand l'echec n'est pas une Error", async () => {
    uploader.start.mockRejectedValue("panne brute");
    const { result } = renderUpload();
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    expect(result.current.errorMessage).toBe("Échec du téléversement");
  });

  it("privilegie la surcharge explicite au message i18n par defaut", async () => {
    uploader.start.mockRejectedValue("panne brute");
    const { result } = renderUpload({ errorFallbackLabel: "Transfert impossible" });
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    expect(result.current.errorMessage).toBe("Transfert impossible");
  });

  it("ne signale pas une mise en pause comme une erreur", async () => {
    const onError = vi.fn();
    const pauseError = new Error("Upload en pause");
    pauseError.name = "PauseError";
    uploader.start.mockRejectedValue(pauseError);
    const { result } = renderUpload({ onError });
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    expect(result.current.errorMessage).toBeNull();
    expect(onError).not.toHaveBeenCalled();
  });

  it("ne signale pas une annulation comme une erreur", async () => {
    const onError = vi.fn();
    const abortError = new Error("Upload interrompu");
    abortError.name = "AbortError";
    uploader.start.mockRejectedValue(abortError);
    const { result } = renderUpload({ onError });
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    expect(result.current.errorMessage).toBeNull();
    expect(onError).not.toHaveBeenCalled();
  });

  it("ne casse pas quand aucun callback d'erreur n'est fourni", async () => {
    uploader.start.mockRejectedValue(new Error("Serveur indisponible"));
    const { result } = renderUpload();
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    expect(result.current.errorMessage).toBe("Serveur indisponible");
  });

  it("efface l'erreur precedente au nouveau lancement", async () => {
    uploader.start.mockRejectedValueOnce(new Error("Serveur indisponible"));
    const { result } = renderUpload();
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    expect(result.current.errorMessage).toBe("Serveur indisponible");
    await act(async () => result.current.start());
    expect(result.current.errorMessage).toBeNull();
  });
});

describe("useChunkedUpload - commandes de pilotage", () => {
  it("ignore pause, resume et abort tant qu'aucun uploader n'existe", () => {
    const { result } = renderUpload();
    act(() => result.current.pause());
    act(() => result.current.resume());
    act(() => result.current.abort());
    expect(createUploaderSpy).not.toHaveBeenCalled();
  });

  it("relaie la mise en pause a l'uploader courant", async () => {
    const { result } = renderUpload();
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    act(() => result.current.pause());
    expect(uploader.pause).toHaveBeenCalledOnce();
  });

  it("relaie la reprise et notifie la fin du televersement", async () => {
    const onCompleted = vi.fn();
    const { result } = renderUpload({ onCompleted });
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    await act(async () => result.current.resume());
    expect(uploader.resume).toHaveBeenCalledOnce();
    expect(onCompleted).toHaveBeenCalledTimes(2);
  });

  it("remonte l'echec d'une reprise", async () => {
    uploader.resume.mockRejectedValue(new Error("Reprise impossible"));
    const { result } = renderUpload();
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    await act(async () => result.current.resume());
    expect(result.current.errorMessage).toBe("Reprise impossible");
  });

  it("relaie l'annulation a l'uploader courant", async () => {
    const { result } = renderUpload();
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    act(() => result.current.abort());
    expect(uploader.abort).toHaveBeenCalledOnce();
  });

  it("oublie fichier, erreur et progression a la reinitialisation", async () => {
    uploader.start.mockRejectedValue(new Error("Serveur indisponible"));
    const { result } = renderUpload();
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    emitProgress("uploading");
    act(() => result.current.reset());
    expect(result.current.fileName).toBeNull();
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.progress.phase).toBe("idle");
  });

  it("cede l'uploader precedent quand un autre fichier est selectionne", async () => {
    const { result } = renderUpload();
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    act(() => result.current.selectFile(makeFile("autre.mp4")));
    act(() => result.current.pause());
    expect(uploader.pause).not.toHaveBeenCalled();
  });

  it("annule le televersement en cours au demontage", async () => {
    const { result, unmount } = renderUpload();
    act(() => result.current.selectFile(makeFile()));
    await act(async () => result.current.start());
    unmount();
    await waitFor(() => expect(uploader.abort).toHaveBeenCalledOnce());
  });
});

describe("useChunkedUpload - etats derives de la progression", () => {
  async function renderStarted() {
    const rendered = renderUpload();
    act(() => rendered.result.current.selectFile(makeFile()));
    await act(async () => rendered.result.current.start());
    return rendered;
  }

  it.each<CanopUploadPhase>(["opening", "uploading", "completing"])(
    "considere la phase %s comme active",
    async (phase) => {
      const { result } = await renderStarted();
      emitProgress(phase);
      expect(result.current.isActive).toBe(true);
    },
  );

  it.each<CanopUploadPhase>(["idle", "completed", "paused", "aborted", "error"])(
    "considere la phase %s comme inactive",
    async (phase) => {
      const { result } = await renderStarted();
      emitProgress(phase);
      expect(result.current.isActive).toBe(false);
    },
  );

  it("autorise la pause pendant un envoi fragmente", async () => {
    const { result } = await renderStarted();
    emitProgress("uploading", "chunked");
    expect(result.current.canPause).toBe(true);
  });

  it("interdit la pause pendant un envoi en une seule requete", async () => {
    const { result } = await renderStarted();
    emitProgress("uploading", "single-shot");
    expect(result.current.canPause).toBe(false);
  });

  it("interdit la pause hors phase d'envoi", async () => {
    const { result } = await renderStarted();
    emitProgress("completing", "chunked");
    expect(result.current.canPause).toBe(false);
  });

  it.each<CanopUploadPhase>(["paused", "error"])(
    "autorise la reprise en phase %s",
    async (phase) => {
      const { result } = await renderStarted();
      emitProgress(phase);
      expect(result.current.canResume).toBe(true);
    },
  );

  it.each<CanopUploadPhase>(["idle", "uploading", "completed", "aborted"])(
    "interdit la reprise en phase %s",
    async (phase) => {
      const { result } = await renderStarted();
      emitProgress(phase);
      expect(result.current.canResume).toBe(false);
    },
  );
});
