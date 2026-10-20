import { afterEach, describe, expect, it, vi, type Mock } from "vitest";
import { CanopApiError } from "../../../http";
import { DEFAULT_CHUNK_SIZE, SINGLE_SHOT_THRESHOLD } from "../constants";
import { createUploader, type CanopUploader } from "../createUploader";
import type { CanopUploadTransport } from "../uploadTransport";
import type {
  CanopUploadBytes,
  CanopUploadNode,
  CanopUploadPhase,
  CanopUploadProgress,
  CanopUploadSessionResponse,
  CanopUploadSource,
} from "../types";

const NODE: CanopUploadNode = {
  id: "node-1",
  parent_id: "parent-1",
  name: "rapport.pdf",
  size: 250,
};

function bytes(length: number): CanopUploadBytes {
  return new Uint8Array(new ArrayBuffer(length));
}

function session(overrides: Partial<CanopUploadSessionResponse> = {}): CanopUploadSessionResponse {
  return {
    session_id: "sess-1",
    parent_id: "parent-1",
    file_name: "rapport.pdf",
    declared_size: 250,
    reserved_bytes: 250,
    chunk_size: 100,
    chunk_count: 3,
    state: "open",
    received_bytes: 0,
    expires_at: "2030-01-01T00:00:00Z",
    ...overrides,
  };
}

function source(size: number, overrides: Partial<CanopUploadSource> = {}): CanopUploadSource {
  return {
    name: "rapport.pdf",
    size,
    slice: async (start, end) => bytes(end - start),
    ...overrides,
  };
}

function lightSource(size: number, overrides: Partial<CanopUploadSource> = {}): CanopUploadSource {
  return source(size, { slice: async () => bytes(0), ...overrides });
}

type FakeTransport = { [K in keyof CanopUploadTransport]: Mock<CanopUploadTransport[K]> };

function fakeTransport(): FakeTransport {
  let received = 0;
  return {
    open: vi.fn<CanopUploadTransport["open"]>(async () => {
      received = 0;
      return session();
    }),
    putChunk: vi.fn<CanopUploadTransport["putChunk"]>(async (sessionId, chunkIndex, chunk) => {
      received += chunk.length;
      return {
        session_id: sessionId,
        chunk_index: chunkIndex,
        received_bytes: received,
        declared_size: 250,
      };
    }),
    status: vi.fn<CanopUploadTransport["status"]>(async () =>
      session({ received_bytes: received }),
    ),
    complete: vi.fn<CanopUploadTransport["complete"]>(async () => NODE),
    abort: vi.fn<CanopUploadTransport["abort"]>(async () => undefined),
    uploadSingleShot: vi.fn<CanopUploadTransport["uploadSingleShot"]>(async () => NODE),
  };
}

function phaseSequence(snapshots: CanopUploadProgress[]): CanopUploadPhase[] {
  return snapshots
    .map((snapshot) => snapshot.phase)
    .filter((phase, index, all) => phase !== all[index - 1]);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createUploader - choix de la strategie", () => {
  it("televerse d'un bloc un fichier plus petit que le seuil", async () => {
    const transport = fakeTransport();
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 100,
    });
    const result = await uploader.start({ source: source(50) });
    expect(result.strategy).toBe("single-shot");
    expect(transport.uploadSingleShot).toHaveBeenCalledOnce();
    expect(transport.open).not.toHaveBeenCalled();
  });

  it("decoupe un fichier qui atteint exactement le seuil", async () => {
    const transport = fakeTransport();
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 100,
      chunkSize: 100,
    });
    const result = await uploader.start({ source: source(100) });
    expect(result.strategy).toBe("chunked");
    expect(transport.open).toHaveBeenCalledOnce();
    expect(transport.uploadSingleShot).not.toHaveBeenCalled();
  });

  it("s'appuie sur le seuil de cent mebioctets par defaut", async () => {
    const transport = fakeTransport();
    const uploader = createUploader({ basePath: "/api", getToken: () => "jeton", transport });
    const juste = await uploader.start({ source: lightSource(SINGLE_SHOT_THRESHOLD - 1) });
    expect(juste.strategy).toBe("single-shot");
    const gros = await uploader.start({ source: lightSource(SINGLE_SHOT_THRESHOLD) });
    expect(gros.strategy).toBe("chunked");
  });

  it("abaisse le seuil pour une passerelle plus stricte", async () => {
    const transport = fakeTransport();
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 10,
      chunkSize: 100,
    });
    const result = await uploader.start({ source: source(50) });
    expect(result.strategy).toBe("chunked");
  });
});

describe("createUploader - ouverture de session", () => {
  it("declare la taille de fragment par defaut", async () => {
    const transport = fakeTransport();
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 0,
    });
    await uploader.start({ source: source(50) });
    expect(transport.open).toHaveBeenCalledWith(
      expect.objectContaining({ chunk_size: DEFAULT_CHUNK_SIZE }),
    );
  });

  it("transmet les metadonnees du fichier et sa destination", async () => {
    const transport = fakeTransport();
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 0,
      chunkSize: 100,
    });
    await uploader.start({
      source: source(250, { mime: "application/pdf" }),
      parentId: "dossier-7",
      checksum: "abc123",
    });
    expect(transport.open).toHaveBeenCalledWith({
      parent_id: "dossier-7",
      file_name: "rapport.pdf",
      declared_size: 250,
      chunk_size: 100,
      declared_mime: "application/pdf",
      checksum: "abc123",
    });
  });

  it("omet les metadonnees facultatives non fournies", async () => {
    const transport = fakeTransport();
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 0,
      chunkSize: 100,
    });
    await uploader.start({ source: source(250) });
    expect(transport.open).toHaveBeenCalledWith({
      parent_id: undefined,
      file_name: "rapport.pdf",
      declared_size: 250,
      chunk_size: 100,
      declared_mime: undefined,
      checksum: undefined,
    });
  });

  it("transmet le dossier de destination en televersement d'un bloc", async () => {
    const transport = fakeTransport();
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 1000,
    });
    await uploader.start({ source: source(50, { mime: "text/plain" }), parentId: "dossier-7" });
    expect(transport.uploadSingleShot).toHaveBeenCalledWith(
      "rapport.pdf",
      expect.anything(),
      "text/plain",
      "dossier-7",
      expect.anything(),
    );
  });
});

describe("createUploader - decoupage en fragments", () => {
  it("envoie un fragment par tranche de la taille demandee", async () => {
    const transport = fakeTransport();
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 0,
      chunkSize: 100,
    });
    await uploader.start({ source: source(250) });
    expect(transport.putChunk).toHaveBeenCalledTimes(3);
    const indexes = transport.putChunk.mock.calls.map((call) => call[1]);
    expect(indexes).toEqual([0, 1, 2]);
  });

  it("finalise la session une fois tous les fragments envoyes", async () => {
    const transport = fakeTransport();
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 0,
      chunkSize: 100,
    });
    const result = await uploader.start({ source: source(250) });
    expect(transport.complete).toHaveBeenCalledWith("sess-1");
    expect(result.node).toEqual(NODE);
  });
});

describe("createUploader - progression", () => {
  it("part d'une progression vierge", () => {
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport: fakeTransport(),
    });
    expect(uploader.getProgress()).toMatchObject({
      phase: "idle",
      uploadedBytes: 0,
      totalBytes: 0,
      ratio: 0,
      percentage: 0,
    });
  });

  it("annonce les phases successives d'un televersement decoupe", async () => {
    const snapshots: CanopUploadProgress[] = [];
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport: fakeTransport(),
      singleShotThreshold: 0,
      chunkSize: 100,
      onProgress: (progress) => snapshots.push(progress),
    });
    await uploader.start({ source: source(250) });
    expect(phaseSequence(snapshots)).toEqual(["opening", "uploading", "completing", "completed"]);
  });

  it("annonce les phases d'un televersement d'un bloc", async () => {
    const snapshots: CanopUploadProgress[] = [];
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport: fakeTransport(),
      singleShotThreshold: 1000,
      onProgress: (progress) => snapshots.push(progress),
    });
    await uploader.start({ source: source(50) });
    expect(phaseSequence(snapshots)).toEqual(["uploading", "completed"]);
  });

  it("convertit les octets recus en pourcentage", async () => {
    const snapshots: CanopUploadProgress[] = [];
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport: fakeTransport(),
      singleShotThreshold: 0,
      chunkSize: 100,
      onProgress: (progress) => snapshots.push(progress),
    });
    await uploader.start({ source: source(250) });
    const pendant = snapshots
      .filter((snapshot) => snapshot.phase === "uploading")
      .map((snapshot) => snapshot.percentage);
    expect(pendant).toEqual([0, 40, 80, 100]);
  });

  it("compte les fragments termines une fois la session finalisee", async () => {
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport: fakeTransport(),
      singleShotThreshold: 0,
      chunkSize: 100,
    });
    await uploader.start({ source: source(250) });
    expect(uploader.getProgress()).toMatchObject({
      phase: "completed",
      chunkCount: 3,
      completedChunkCount: 3,
      uploadedBytes: 250,
      ratio: 1,
      percentage: 100,
    });
  });

  it("televerse sans observateur de progression", async () => {
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport: fakeTransport(),
      singleShotThreshold: 0,
      chunkSize: 100,
    });
    await expect(uploader.start({ source: source(250) })).resolves.toMatchObject({
      strategy: "chunked",
    });
  });
});

describe("createUploader - chemins d'erreur", () => {
  it("bascule en erreur quand l'ouverture de session echoue", async () => {
    const transport = fakeTransport();
    transport.open.mockRejectedValue(new CanopApiError(500, "panne serveur"));
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 0,
      chunkSize: 100,
    });
    await expect(uploader.start({ source: source(250) })).rejects.toThrow("panne serveur");
    expect(uploader.getProgress().phase).toBe("error");
  });

  it("bascule en erreur quand un fragment est refuse", async () => {
    const transport = fakeTransport();
    transport.putChunk.mockRejectedValue(new CanopApiError(422, "fragment refuse"));
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 0,
      chunkSize: 100,
    });
    await expect(uploader.start({ source: source(250) })).rejects.toThrow("fragment refuse");
    expect(uploader.getProgress().phase).toBe("error");
  });

  it("bascule en erreur quand la finalisation echoue", async () => {
    const transport = fakeTransport();
    transport.complete.mockRejectedValue(new CanopApiError(500, "finalisation kaput"));
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 0,
      chunkSize: 100,
    });
    await expect(uploader.start({ source: source(250) })).rejects.toThrow("finalisation kaput");
    expect(uploader.getProgress().phase).toBe("error");
  });

  it("bascule en erreur quand le televersement d'un bloc echoue", async () => {
    const transport = fakeTransport();
    transport.uploadSingleShot.mockRejectedValue(new CanopApiError(413, "trop gros"));
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 1000,
    });
    await expect(uploader.start({ source: source(50) })).rejects.toThrow("trop gros");
    expect(uploader.getProgress().phase).toBe("error");
  });

  it("rejoue un fragment apres une indisponibilite passagere", async () => {
    const transport = fakeTransport();
    transport.putChunk.mockRejectedValueOnce(new CanopApiError(503, "indisponible"));
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 0,
      chunkSize: 250,
      retryBaseDelayMs: 1,
    });
    await expect(uploader.start({ source: source(250) })).resolves.toMatchObject({ node: NODE });
    expect(transport.putChunk).toHaveBeenCalledTimes(2);
  });

  it("abandonne apres le nombre de reessais autorise", async () => {
    const transport = fakeTransport();
    transport.putChunk.mockRejectedValue(new CanopApiError(503, "indisponible"));
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 0,
      chunkSize: 250,
      maxRetriesPerChunk: 1,
      retryBaseDelayMs: 1,
    });
    await expect(uploader.start({ source: source(250) })).rejects.toThrow("indisponible");
    expect(transport.putChunk).toHaveBeenCalledTimes(2);
  });
});

describe("createUploader - pause et reprise", () => {
  it("s'arrete entre deux fragments sur demande de pause", async () => {
    const transport = fakeTransport();
    let uploader: CanopUploader | null = null;
    let pauseDemandee = false;
    const nominal = transport.putChunk;
    transport.putChunk = vi.fn<CanopUploadTransport["putChunk"]>(async (...args) => {
      if (!pauseDemandee) {
        pauseDemandee = true;
        uploader?.pause();
      }
      return nominal(...args);
    });
    uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 0,
      chunkSize: 100,
    });
    await expect(uploader.start({ source: source(250) })).rejects.toThrow("Upload en pause");
    expect(transport.putChunk).toHaveBeenCalledOnce();
    expect(uploader.getProgress().phase).toBe("paused");
  });

  it("reprend la session la ou elle s'etait arretee", async () => {
    const transport = fakeTransport();
    let uploader: CanopUploader | null = null;
    let pauseDemandee = false;
    const nominal = transport.putChunk;
    transport.putChunk = vi.fn<CanopUploadTransport["putChunk"]>(async (...args) => {
      if (!pauseDemandee) {
        pauseDemandee = true;
        uploader?.pause();
      }
      return nominal(...args);
    });
    uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 0,
      chunkSize: 100,
    });
    await expect(uploader.start({ source: source(250) })).rejects.toThrow("Upload en pause");
    await expect(uploader.resume()).resolves.toMatchObject({ node: NODE });
    expect(transport.status).toHaveBeenCalledWith("sess-1");
    expect(transport.putChunk).toHaveBeenCalledTimes(3);
    expect(transport.open).toHaveBeenCalledOnce();
  });

  it("ignore une demande de pause hors televersement", async () => {
    const transport = fakeTransport();
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 0,
      chunkSize: 100,
    });
    uploader.pause();
    await expect(uploader.start({ source: source(250) })).resolves.toMatchObject({ node: NODE });
  });

  it("refuse de reprendre sans televersement en cours", async () => {
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport: fakeTransport(),
    });
    await expect(uploader.resume()).rejects.toThrow("Aucun upload a reprendre");
  });

  it("relance depuis le debut la reprise d'un televersement d'un bloc", async () => {
    const transport = fakeTransport();
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 1000,
    });
    await uploader.start({ source: source(50) });
    await expect(uploader.resume()).resolves.toMatchObject({ strategy: "single-shot" });
    expect(transport.uploadSingleShot).toHaveBeenCalledTimes(2);
  });
});

describe("createUploader - annulation", () => {
  it("interrompt le televersement decoupe en cours", async () => {
    const transport = fakeTransport();
    let uploader: CanopUploader | null = null;
    let annulationDemandee = false;
    const nominal = transport.putChunk;
    transport.putChunk = vi.fn<CanopUploadTransport["putChunk"]>(async (...args) => {
      if (!annulationDemandee) {
        annulationDemandee = true;
        await uploader?.abort();
      }
      return nominal(...args);
    });
    uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 0,
      chunkSize: 100,
    });
    await expect(uploader.start({ source: source(250) })).rejects.toThrow("Upload interrompu");
    expect(transport.abort).toHaveBeenCalledWith("sess-1");
    expect(uploader.getProgress().phase).toBe("aborted");
  });

  it("n'appelle pas le serveur pour annuler sans session ouverte", async () => {
    const transport = fakeTransport();
    const uploader = createUploader({ basePath: "/api", getToken: () => "jeton", transport });
    await uploader.abort();
    expect(transport.abort).not.toHaveBeenCalled();
    expect(uploader.getProgress().phase).toBe("aborted");
  });

  it("oublie la session meme quand son annulation serveur echoue", async () => {
    const transport = fakeTransport();
    const uploader = createUploader({
      basePath: "/api",
      getToken: () => "jeton",
      transport,
      singleShotThreshold: 0,
      chunkSize: 100,
    });
    await uploader.start({ source: source(250) });
    transport.abort.mockRejectedValue(new CanopApiError(500, "annulation kaput"));
    await expect(uploader.abort()).rejects.toThrow("annulation kaput");
    await expect(uploader.resume()).resolves.toMatchObject({ node: NODE });
    expect(transport.open).toHaveBeenCalledTimes(2);
  });
});

describe("createUploader - transport par defaut", () => {
  function responseOf(payload: unknown): Response {
    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify(payload),
    } as unknown as Response;
  }

  it("s'adresse au serveur configure quand aucun transport n'est fourni", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => responseOf(NODE));
    vi.stubGlobal("fetch", fetchMock);
    const uploader = createUploader({ basePath: "/api", getToken: () => "jeton" });
    await uploader.start({ source: source(50) });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toBe("/api/files");
  });

  it("utilise le chemin de fichiers configure", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => responseOf(NODE));
    vi.stubGlobal("fetch", fetchMock);
    const uploader = createUploader({
      basePath: "/api",
      filesPath: "/v1/files",
      getToken: () => "jeton",
    });
    await uploader.start({ source: source(50) });
    expect(fetchMock.mock.calls[0][0]).toBe("/api/v1/files");
  });

  it("refuse de televerser sans jeton d'authentification", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => responseOf(NODE));
    vi.stubGlobal("fetch", fetchMock);
    const uploader = createUploader({ basePath: "/api", getToken: () => null });
    await expect(uploader.start({ source: source(50) })).rejects.toThrow("Token JWT indisponible");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
