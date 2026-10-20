import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createUploader } from "../createUploader";
import type { CanopUploadTransport } from "../uploadTransport";
import type {
  CanopPutChunkResponse,
  CanopTokenProvider,
  CanopUploadNode,
  CanopUploadProgress,
  CanopUploadSessionResponse,
  CanopUploadSource,
} from "../types";

const MIB = 1024 * 1024;
const CHUNK = 16 * MIB;
const THRESHOLD = 100 * MIB;

function makeSource(size: number, name = "video.mp4"): CanopUploadSource {
  return {
    name,
    size,
    mime: "video/mp4",
    slice: async (start: number, end: number) => new Uint8Array(Math.max(0, end - start)),
  };
}

function makeNode(id = "node-1"): CanopUploadNode {
  return { id, parent_id: "root", name: "video.mp4", size: 0 };
}

function makeSession(declaredSize: number, receivedBytes: number): CanopUploadSessionResponse {
  return {
    session_id: "sess-1",
    parent_id: "root",
    file_name: "video.mp4",
    declared_size: declaredSize,
    reserved_bytes: declaredSize,
    chunk_size: CHUNK,
    chunk_count: Math.ceil(declaredSize / CHUNK),
    state: "open",
    received_bytes: receivedBytes,
    expires_at: "2030-01-01T00:00:00Z",
  };
}

function createMockTransport(
  declaredSize: number,
  initialReceived: number,
): CanopUploadTransport & { putCalls: number[] } {
  const putCalls: number[] = [];
  let received = initialReceived;
  const transport: CanopUploadTransport = {
    open: vi.fn(async () => makeSession(declaredSize, initialReceived)),
    status: vi.fn(async () => makeSession(declaredSize, initialReceived)),
    putChunk: vi.fn(
      async (_sessionId: string, chunkIndex: number): Promise<CanopPutChunkResponse> => {
        putCalls.push(chunkIndex);
        const end = Math.min((chunkIndex + 1) * CHUNK, declaredSize);
        received = end;
        return {
          session_id: "sess-1",
          chunk_index: chunkIndex,
          received_bytes: received,
          declared_size: declaredSize,
        };
      },
    ),
    complete: vi.fn(async () => makeNode()),
    abort: vi.fn(async () => undefined),
    uploadSingleShot: vi.fn(async () => makeNode("single")),
  };
  return Object.assign(transport, { putCalls });
}

describe("AC routage - bascule single-shot vs chunked au niveau uploader", () => {
  it("utilise single-shot (POST files) sous 100 Mio", async () => {
    const transport = createMockTransport(5 * MIB, 0);
    const uploader = createUploader({
      basePath: "http://api",
      getToken: () => "tok",
      transport,
    });
    const result = await uploader.start({ source: makeSource(5 * MIB) });
    expect(result.strategy).toBe("single-shot");
    expect(transport.uploadSingleShot).toHaveBeenCalledOnce();
    expect(transport.open).not.toHaveBeenCalled();
  });

  it("utilise le mode chunke exactement a 100 Mio", async () => {
    const transport = createMockTransport(THRESHOLD, 0);
    const uploader = createUploader({
      basePath: "http://api",
      getToken: () => "tok",
      transport,
    });
    const result = await uploader.start({ source: makeSource(THRESHOLD) });
    expect(result.strategy).toBe("chunked");
    expect(transport.open).toHaveBeenCalledOnce();
    expect(transport.uploadSingleShot).not.toHaveBeenCalled();
  });

  it("decoupe sous 100 Mio quand l'appelant abaisse le seuil", async () => {
    const taille = 40 * MIB;
    const transport = createMockTransport(taille, 0);
    const uploader = createUploader({
      basePath: "http://api",
      getToken: () => "tok",
      transport,
      singleShotThreshold: 17 * MIB,
    });
    const result = await uploader.start({ source: makeSource(taille) });
    expect(result.strategy).toBe("chunked");
    expect(transport.open).toHaveBeenCalledOnce();
    expect(transport.uploadSingleShot).not.toHaveBeenCalled();
  });
});

describe("AC sequence chunke complete open -> putChunk x N -> complete", () => {
  it("ouvre la session, envoie chaque chunk dans l'ordre puis complete", async () => {
    const declaredSize = 100 * MIB;
    const transport = createMockTransport(declaredSize, 0);
    const uploader = createUploader({
      basePath: "http://api",
      getToken: () => "tok",
      transport,
    });
    const result = await uploader.start({ source: makeSource(declaredSize) });
    expect(transport.open).toHaveBeenCalledOnce();
    expect(transport.putCalls).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(transport.complete).toHaveBeenCalledOnce();
    expect(result.node.id).toBe("node-1");
  });
});

describe("AC reprise - aucun chunk deja recu n'est re-emis", () => {
  it("reprend depuis received_bytes via GET status sans renvoyer les chunks recus", async () => {
    const declaredSize = 100 * MIB;
    const transport = createMockTransport(declaredSize, 0);
    const uploader = createUploader({
      basePath: "http://api",
      getToken: () => "tok",
      transport,
    });

    let blocked = false;
    const originalPut = transport.putChunk;
    (transport as { putChunk: CanopUploadTransport["putChunk"] }).putChunk = vi.fn(
      async (sessionId, chunkIndex, bytes, signal) => {
        if (chunkIndex === 3 && !blocked) {
          blocked = true;
          uploader.pause();
        }
        return originalPut(sessionId, chunkIndex, bytes, signal);
      },
    );

    await uploader.start({ source: makeSource(declaredSize) }).catch(() => undefined);

    const resumeTransport = createMockTransport(declaredSize, CHUNK * 3);
    const resumeUploader = createUploader({
      basePath: "http://api",
      getToken: () => "tok",
      transport: resumeTransport,
    });
    await resumeUploader.start({ source: makeSource(declaredSize) }).catch(() => undefined);

    const fromReceived = createMockTransport(declaredSize, CHUNK * 3);
    fromReceived.open = vi.fn(async () => makeSession(declaredSize, CHUNK * 3));
    const u2 = createUploader({
      basePath: "http://api",
      getToken: () => "tok",
      transport: fromReceived,
    });
    await u2.start({ source: makeSource(declaredSize) });
    expect(fromReceived.putCalls[0]).toBe(3);
    expect(fromReceived.putCalls.includes(0)).toBe(false);
    expect(fromReceived.putCalls.includes(1)).toBe(false);
    expect(fromReceived.putCalls.includes(2)).toBe(false);
  });
});

describe("AC barre de progression basee sur received_bytes / declared_size", () => {
  it("met a jour uploadedBytes avec received_bytes renvoye par le serveur apres chaque chunk", async () => {
    const declaredSize = 100 * MIB;
    const transport = createMockTransport(declaredSize, 0);
    const progresses: CanopUploadProgress[] = [];
    const uploader = createUploader({
      basePath: "http://api",
      getToken: () => "tok",
      transport,
      onProgress: (p) => progresses.push({ ...p }),
    });
    await uploader.start({ source: makeSource(declaredSize) });

    const uploadingSnapshots = progresses.filter((p) => p.phase === "uploading");
    const ratios = uploadingSnapshots.map((p) => p.ratio);
    for (let i = 1; i < ratios.length; i += 1) {
      expect(ratios[i]).toBeGreaterThanOrEqual(ratios[i - 1]);
    }
    const final = uploader.getProgress();
    expect(final.totalBytes).toBe(declaredSize);
    expect(final.uploadedBytes).toBe(declaredSize);
    expect(final.ratio).toBe(1);
    expect(final.percentage).toBe(100);
  });

  it("reflete exactement received_bytes / declared_size apres un chunk", async () => {
    const declaredSize = 100 * MIB;
    const transport = createMockTransport(declaredSize, 0);
    const progresses: CanopUploadProgress[] = [];
    const uploader = createUploader({
      basePath: "http://api",
      getToken: () => "tok",
      transport,
      onProgress: (p) => progresses.push({ ...p }),
    });
    await uploader.start({ source: makeSource(declaredSize) });
    const afterFirstChunk = progresses.find(
      (p) => p.phase === "uploading" && p.completedChunkCount === 1,
    );
    expect(afterFirstChunk?.uploadedBytes).toBe(CHUNK);
    expect(afterFirstChunk?.ratio).toBeCloseTo(CHUNK / declaredSize, 5);
  });
});

describe("AC JWT sur chaque requete - via transport reel et fetch mocke", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let getToken: CanopTokenProvider & ReturnType<typeof vi.fn>;
  let tokenCounter: number;

  function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  beforeEach(() => {
    tokenCounter = 0;
    getToken = vi.fn(async () => {
      tokenCounter += 1;
      return `token-${tokenCounter}`;
    }) as CanopTokenProvider & ReturnType<typeof vi.fn>;
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function authHeaderOf(call: unknown[]): string | null {
    const init = call[1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    return headers.Authorization ?? null;
  }

  it("porte Authorization Bearer et rafraichit le token sur chaque requete d'un flux chunke", async () => {
    const declaredSize = 100 * MIB;
    fetchMock.mockImplementation(async (url: string, init: RequestInit) => {
      if (url.endsWith("/v1/uploads") && init.method === "POST") {
        return jsonResponse(makeSession(declaredSize, 0));
      }
      if (url.includes("/chunks/")) {
        const index = Number(url.split("/chunks/")[1]);
        const end = Math.min((index + 1) * CHUNK, declaredSize);
        return jsonResponse({
          session_id: "sess-1",
          chunk_index: index,
          received_bytes: end,
          declared_size: declaredSize,
        });
      }
      if (url.endsWith("/complete")) {
        return jsonResponse(makeNode());
      }
      return jsonResponse({}, 200);
    });

    const uploader = createUploader({
      basePath: "http://api",
      getToken,
    });
    await uploader.start({ source: makeSource(declaredSize) });

    expect(fetchMock).toHaveBeenCalled();
    for (const call of fetchMock.mock.calls) {
      const auth = authHeaderOf(call);
      expect(auth).toMatch(/^Bearer token-\d+$/);
    }
    expect(getToken.mock.calls.length).toBe(fetchMock.mock.calls.length);
    const distinctTokens = new Set(fetchMock.mock.calls.map((c) => authHeaderOf(c)));
    expect(distinctTokens.size).toBe(fetchMock.mock.calls.length);
  });

  it("porte Authorization Bearer sur la requete single-shot POST files", async () => {
    fetchMock.mockResolvedValue(jsonResponse(makeNode("single")));
    const uploader = createUploader({
      basePath: "http://api",
      getToken,
    });
    await uploader.start({ source: makeSource(5 * MIB) });
    expect(fetchMock).toHaveBeenCalledOnce();
    const call = fetchMock.mock.calls[0];
    expect(call[0]).toBe("http://api/files");
    expect(authHeaderOf(call)).toMatch(/^Bearer token-\d+$/);
    expect(getToken).toHaveBeenCalledOnce();
  });

  it("porte Authorization Bearer sur status (GET) et abort (DELETE)", async () => {
    fetchMock.mockImplementation(async (_url: string, init: RequestInit) => {
      if (init.method === "GET") {
        return jsonResponse(makeSession(100 * MIB, CHUNK * 2));
      }
      if (init.method === "DELETE") {
        return new Response(null, { status: 204 });
      }
      return jsonResponse({});
    });
    const { createUploadTransport } = await import("../uploadTransport");
    const transport = createUploadTransport({
      basePath: "http://api",
      getToken,
    });
    await transport.status("sess-1");
    await transport.abort("sess-1");
    expect(fetchMock.mock.calls).toHaveLength(2);
    for (const call of fetchMock.mock.calls) {
      expect(authHeaderOf(call)).toMatch(/^Bearer token-\d+$/);
    }
    expect(getToken).toHaveBeenCalledTimes(2);
  });

  it("rejette toute requete sans token disponible (401 missing_token)", async () => {
    const noToken = vi.fn(async () => null);
    const { createUploadTransport } = await import("../uploadTransport");
    const transport = createUploadTransport({
      basePath: "http://api",
      getToken: noToken,
    });
    await expect(transport.status("sess-1")).rejects.toMatchObject({
      status: 401,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("AC routage - chemins d'URL effectivement frappes", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("single-shot envoie un POST sur le chemin files", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(makeNode("single")), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const { createUploadTransport } = await import("../uploadTransport");
    const transport = createUploadTransport({
      basePath: "http://api",
      getToken: () => "tok",
    });
    await transport.uploadSingleShot("f.bin", new Uint8Array(1), undefined, undefined);
    const call = fetchMock.mock.calls[0];
    expect(call[0]).toBe("http://api/files");
    expect((call[1] as RequestInit).method).toBe("POST");
  });

  it("le flux chunke ouvre la session via un POST sur le chemin uploads", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(makeSession(100 * MIB, 0)), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const { createUploadTransport } = await import("../uploadTransport");
    const transport = createUploadTransport({
      basePath: "http://api",
      getToken: () => "tok",
    });
    await transport.open({
      file_name: "f.bin",
      declared_size: 100 * MIB,
      chunk_size: CHUNK,
    });
    const call = fetchMock.mock.calls[0];
    expect(String(call[0])).toContain("/uploads");
    expect((call[1] as RequestInit).method).toBe("POST");
  });
});
