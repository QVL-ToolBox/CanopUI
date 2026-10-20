import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CanopApiError } from "../../../http";
import { createUploadTransport } from "../uploadTransport";
import type { CanopUploadBytes } from "../types";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function bytes(length = 4): CanopUploadBytes {
  return new Uint8Array(new ArrayBuffer(length));
}

function urlOf(index: number): string {
  return String(fetchMock.mock.calls[index][0]);
}

function initOf(index: number): RequestInit {
  return fetchMock.mock.calls[index][1] as RequestInit;
}

function headersOf(index: number): Record<string, string> {
  return (initOf(index).headers ?? {}) as Record<string, string>;
}

let fetchMock: ReturnType<typeof vi.fn>;

function makeTransport(token: string | null = "tok", filesPath?: string) {
  return createUploadTransport({ basePath: "http://api", filesPath, getToken: () => token });
}

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("createUploadTransport - routes appelees", () => {
  it("ouvre une session en POST avec un corps JSON", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ session_id: "s-1" }));
    await makeTransport().open({ file_name: "f.bin", declared_size: 10, chunk_size: 5 });
    expect(urlOf(0)).toBe("http://api/v1/uploads");
    expect(initOf(0).method).toBe("POST");
    expect(headersOf(0)["Content-Type"]).toBe("application/json");
    expect(initOf(0).body).toBe('{"file_name":"f.bin","declared_size":10,"chunk_size":5}');
  });

  it("envoie un fragment en PUT sur l'index demande", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ chunk_index: 2 }));
    const controller = new AbortController();
    await makeTransport().putChunk("s-1", 2, bytes(), controller.signal);
    expect(urlOf(0)).toBe("http://api/v1/uploads/s-1/chunks/2");
    expect(initOf(0).method).toBe("PUT");
    expect(headersOf(0)["Content-Type"]).toBe("application/octet-stream");
    expect(initOf(0).signal).toBe(controller.signal);
  });

  it("interroge l'etat de session en GET", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ session_id: "s-1" }));
    await makeTransport().status("s-1");
    expect(urlOf(0)).toBe("http://api/v1/uploads/s-1");
    expect(initOf(0).method).toBe("GET");
  });

  it("finalise la session en POST", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: "node-1" }));
    await expect(makeTransport().complete("s-1")).resolves.toEqual({ id: "node-1" });
    expect(urlOf(0)).toBe("http://api/v1/uploads/s-1/complete");
    expect(initOf(0).method).toBe("POST");
  });

  it("annule la session en DELETE et tolere une reponse sans corps", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(makeTransport().abort("s-1")).resolves.toBeUndefined();
    expect(urlOf(0)).toBe("http://api/v1/uploads/s-1");
    expect(initOf(0).method).toBe("DELETE");
  });
});

describe("createUploadTransport - envoi en une seule requete", () => {
  it("poste un FormData sur le chemin de fichiers par defaut", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: "node-1" }));
    await makeTransport().uploadSingleShot("f.bin", bytes(), "video/mp4", undefined);
    expect(urlOf(0)).toBe("http://api/files");
    const body = initOf(0).body as FormData;
    expect(body.get("file")).toBeInstanceOf(Blob);
    expect(body.get("parent_id")).toBeNull();
  });

  it("joint le dossier parent quand il est fourni", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: "node-1" }));
    await makeTransport().uploadSingleShot("f.bin", bytes(), "video/mp4", "folder-42");
    expect((initOf(0).body as FormData).get("parent_id")).toBe("folder-42");
  });

  it("retombe sur un type binaire generique sans MIME connu", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: "node-1" }));
    await makeTransport().uploadSingleShot("f.bin", bytes(), undefined, undefined);
    const file = (initOf(0).body as FormData).get("file") as Blob;
    expect(file.type).toBe("application/octet-stream");
  });

  it("respecte un chemin de fichiers personnalise", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: "node-1" }));
    const transport = makeTransport("tok", "/v1/files");
    await transport.uploadSingleShot("f.bin", bytes(), undefined, undefined);
    expect(urlOf(0)).toBe("http://api/v1/files");
  });
});

describe("createUploadTransport - jeton d'authentification", () => {
  it("porte le jeton en Bearer sur chaque requete", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    await makeTransport("jwt-1").status("s-1");
    expect(headersOf(0).Authorization).toBe("Bearer jwt-1");
  });

  it("accepte un fournisseur de jeton asynchrone", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    const transport = createUploadTransport({
      basePath: "http://api",
      getToken: async () => "jwt-async",
    });
    await transport.status("s-1");
    expect(headersOf(0).Authorization).toBe("Bearer jwt-async");
  });

  it.each([null, ""])("refuse d'emettre la requete sans jeton exploitable (%p)", async (token) => {
    const transport = makeTransport(token);
    const error = await transport.status("s-1").catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(CanopApiError);
    expect(error).toMatchObject({ status: 401, code: "missing_token" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("createUploadTransport - conversion des reponses en erreur", () => {
  it("construit une CanopApiError depuis le message et le code du corps", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: "quota_exceeded", message: "Quota" }, 409));
    await expect(makeTransport().complete("s-1")).rejects.toMatchObject({
      status: 409,
      code: "quota_exceeded",
      message: "Quota",
    });
  });

  it("utilise le code comme message a defaut de message", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: "session_expired" }, 410));
    await expect(makeTransport().status("s-1")).rejects.toMatchObject({
      message: "session_expired",
    });
  });

  it("construit un message par defaut quand le corps d'erreur est illisible", async () => {
    fetchMock.mockResolvedValue(new Response("<html/>", { status: 500 }));
    await expect(makeTransport().status("s-1")).rejects.toMatchObject({
      status: 500,
      message: "Erreur 500",
    });
  });

  it("n'expose aucun code quand le serveur n'en fournit pas", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: "Indisponible" }, 503));
    await expect(makeTransport().status("s-1")).rejects.toMatchObject({
      code: undefined,
      message: "Indisponible",
    });
  });
});
