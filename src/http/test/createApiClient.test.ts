import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CanopApiError } from "../ApiError";
import { createApiClient } from "../createApiClient";

const REFRESH_DEFAULT_PATH = "/api/auth/refresh";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function textResponse(body: string, status = 200): Response {
  return new Response(body, { status });
}

function emptyResponse(status: number): Response {
  return new Response(null, { status });
}

function initOf(call: unknown[]): RequestInit {
  return call[1] as RequestInit;
}

function headersOf(call: unknown[]): Record<string, string> {
  return (initOf(call).headers ?? {}) as Record<string, string>;
}

function flush(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("createApiClient - lecture du corps de reponse", () => {
  it("deserialise le corps JSON d'une reponse 200", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: "u-1" }));
    const api = createApiClient({ basePath: "/api" });
    await expect(api.request<{ id: string }>("/me")).resolves.toEqual({ id: "u-1" });
  });

  it("renvoie undefined sur un 204 sans lire le corps", async () => {
    fetchMock.mockResolvedValue(emptyResponse(204));
    const api = createApiClient({ basePath: "/api" });
    await expect(api.request("/me")).resolves.toBeUndefined();
  });

  it("renvoie undefined quand le corps d'une reponse 200 est vide", async () => {
    fetchMock.mockResolvedValue(textResponse(""));
    const api = createApiClient({ basePath: "/api" });
    await expect(api.request("/me")).resolves.toBeUndefined();
  });

  it("deserialise un corps JSON servi sans en-tete de type", async () => {
    fetchMock.mockResolvedValue(textResponse('{"id":"u-2"}', 202));
    const api = createApiClient({ basePath: "/api" });
    await expect(api.request<{ id: string }>("/me")).resolves.toEqual({ id: "u-2" });
  });
});

describe("createApiClient - construction de la requete", () => {
  it("prefixe le chemin par basePath et envoie les cookies same-origin", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    const api = createApiClient({ basePath: "https://srv/api" });
    await api.request("/me");
    expect(fetchMock.mock.calls[0][0]).toBe("https://srv/api/me");
    expect(initOf(fetchMock.mock.calls[0]).credentials).toBe("same-origin");
  });

  it("ajoute le Content-Type JSON quand aucun init n'est fourni", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    const api = createApiClient({ basePath: "/api" });
    await api.request("/me");
    expect(headersOf(fetchMock.mock.calls[0])).toEqual({
      "Content-Type": "application/json",
    });
  });

  it("fusionne les en-tetes fournis avec le Content-Type JSON", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    const api = createApiClient({ basePath: "/api" });
    await api.request("/me", { headers: { "X-Trace": "abc" } });
    expect(headersOf(fetchMock.mock.calls[0])).toEqual({
      "Content-Type": "application/json",
      "X-Trace": "abc",
    });
  });

  it("laisse l'appelant surcharger le Content-Type JSON", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    const api = createApiClient({ basePath: "/api" });
    await api.request("/me", { headers: { "Content-Type": "text/plain" } });
    expect(headersOf(fetchMock.mock.calls[0])["Content-Type"]).toBe("text/plain");
  });

  it("n'impose aucun Content-Type quand le corps est un FormData", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    const api = createApiClient({ basePath: "/api" });
    const form = new FormData();
    form.append("file", "contenu");
    await api.request("/documents", { method: "POST", body: form });
    expect(initOf(fetchMock.mock.calls[0]).headers).toBeUndefined();
  });

  it("conserve les en-tetes explicites d'un envoi FormData", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    const api = createApiClient({ basePath: "/api" });
    const form = new FormData();
    await api.request("/documents", {
      method: "POST",
      body: form,
      headers: { "X-Trace": "abc" },
    });
    expect(headersOf(fetchMock.mock.calls[0])).toEqual({ "X-Trace": "abc" });
  });

  it("retombe sur le Content-Type JSON quand FormData n'existe pas dans l'environnement", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    vi.stubGlobal("FormData", undefined);
    const api = createApiClient({ basePath: "/api" });
    await api.request("/me", { method: "POST", body: "brut" });
    expect(headersOf(fetchMock.mock.calls[0])).toEqual({
      "Content-Type": "application/json",
    });
  });

  it("preserve la methode et le corps transmis par l'appelant", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    const api = createApiClient({ basePath: "/api" });
    await api.request("/me", { method: "PATCH", body: JSON.stringify({ a: 1 }) });
    const init = initOf(fetchMock.mock.calls[0]);
    expect(init.method).toBe("PATCH");
    expect(init.body).toBe('{"a":1}');
  });
});

describe("createApiClient - conversion des reponses en erreur", () => {
  it("leve une CanopApiError portant le statut", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: "Interdit" }, 403));
    const api = createApiClient({ basePath: "/api" });
    const error = await api.request("/me").catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(CanopApiError);
    expect(error).toMatchObject({ status: 403, message: "Interdit" });
  });

  it("expose le code applicatif du corps", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: "quota_exceeded", message: "Quota" }, 409));
    const api = createApiClient({ basePath: "/api" });
    await expect(api.request("/me")).rejects.toMatchObject({
      status: 409,
      code: "quota_exceeded",
      message: "Quota",
    });
  });

  it("utilise le code comme message quand le corps ne porte pas de message", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: "quota_exceeded" }, 409));
    const api = createApiClient({ basePath: "/api" });
    await expect(api.request("/me")).rejects.toMatchObject({
      code: "quota_exceeded",
      message: "quota_exceeded",
    });
  });

  it("construit un message par defaut quand le corps ne porte ni message ni code", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, 500));
    const api = createApiClient({ basePath: "/api" });
    await expect(api.request("/me")).rejects.toMatchObject({
      status: 500,
      message: "Erreur 500",
      code: undefined,
    });
  });

  it("ignore les champs message et code non textuels", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: 42, message: { fr: "non" } }, 500));
    const api = createApiClient({ basePath: "/api" });
    await expect(api.request("/me")).rejects.toMatchObject({
      message: "Erreur 500",
      code: undefined,
    });
  });

  it("construit un message par defaut quand le corps d'erreur n'est pas du JSON", async () => {
    fetchMock.mockResolvedValue(textResponse("<html>oops</html>", 502));
    const api = createApiClient({ basePath: "/api" });
    await expect(api.request("/me")).rejects.toMatchObject({
      status: 502,
      message: "Erreur 502",
    });
  });

  it("construit un message par defaut quand le corps d'erreur est vide", async () => {
    fetchMock.mockResolvedValue(emptyResponse(503));
    const api = createApiClient({ basePath: "/api" });
    await expect(api.request("/me")).rejects.toMatchObject({
      status: 503,
      message: "Erreur 503",
    });
  });
});

describe("createApiClient - rafraichissement de session sur 401", () => {
  it("ne tente aucun rafraichissement quand withRefresh est desactive", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: "expired" }, 401));
    const api = createApiClient({ basePath: "/api" });
    await expect(api.request("/me")).rejects.toMatchObject({ status: 401 });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("ne tente aucun rafraichissement sur un statut d'erreur autre que 401", async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, 403));
    const api = createApiClient({ basePath: "/api", withRefresh: true });
    await expect(api.request("/me")).rejects.toMatchObject({ status: 403 });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("rejoue la requete apres un rafraichissement reussi", async () => {
    let attempts = 0;
    fetchMock.mockImplementation(async (url: string) => {
      if (url === REFRESH_DEFAULT_PATH) return emptyResponse(200);
      attempts += 1;
      return attempts === 1 ? emptyResponse(401) : jsonResponse({ id: "u-1" });
    });
    const api = createApiClient({ basePath: "/api", withRefresh: true });
    await expect(api.request<{ id: string }>("/me")).resolves.toEqual({ id: "u-1" });
    expect(attempts).toBe(2);
  });

  it("appelle le chemin de rafraichissement par defaut en POST", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url === REFRESH_DEFAULT_PATH ? emptyResponse(200) : jsonResponse({}, 401),
    );
    const api = createApiClient({ basePath: "/api", withRefresh: true });
    await api.request("/me").catch(() => undefined);
    const refreshCalls = fetchMock.mock.calls.filter((call) => call[0] === REFRESH_DEFAULT_PATH);
    expect(refreshCalls).toHaveLength(1);
    expect(initOf(refreshCalls[0])).toMatchObject({
      method: "POST",
      credentials: "same-origin",
    });
  });

  it("appelle le chemin de rafraichissement fourni", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url === "/auth/renew" ? emptyResponse(200) : jsonResponse({}, 401),
    );
    const api = createApiClient({
      basePath: "/api",
      withRefresh: true,
      refreshPath: "/auth/renew",
    });
    await api.request("/me").catch(() => undefined);
    expect(fetchMock.mock.calls.some((call) => call[0] === "/auth/renew")).toBe(true);
  });

  it("propage la 401 quand le rafraichissement repond en erreur", async () => {
    let attempts = 0;
    fetchMock.mockImplementation(async (url: string) => {
      if (url === REFRESH_DEFAULT_PATH) return emptyResponse(500);
      attempts += 1;
      return jsonResponse({ error: "expired" }, 401);
    });
    const api = createApiClient({ basePath: "/api", withRefresh: true });
    await expect(api.request("/me")).rejects.toMatchObject({ status: 401 });
    expect(attempts).toBe(1);
  });

  it("propage la 401 quand le rafraichissement rejette", async () => {
    let attempts = 0;
    fetchMock.mockImplementation(async (url: string) => {
      if (url === REFRESH_DEFAULT_PATH) throw new Error("reseau indisponible");
      attempts += 1;
      return emptyResponse(401);
    });
    const api = createApiClient({ basePath: "/api", withRefresh: true });
    await expect(api.request("/me")).rejects.toMatchObject({ status: 401 });
    expect(attempts).toBe(1);
  });

  it("propage l'erreur quand la requete rejouee echoue encore", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url === REFRESH_DEFAULT_PATH
        ? emptyResponse(200)
        : jsonResponse({ message: "Toujours" }, 401),
    );
    const api = createApiClient({ basePath: "/api", withRefresh: true });
    await expect(api.request("/me")).rejects.toMatchObject({
      status: 401,
      message: "Toujours",
    });
  });

  it("mutualise un seul rafraichissement pour deux requetes 401 concurrentes", async () => {
    let refreshCalls = 0;
    let releaseRefresh: () => void = () => {};
    const pendingRefresh = new Promise<Response>((resolve) => {
      releaseRefresh = () => resolve(emptyResponse(200));
    });
    const seen = new Set<string>();
    fetchMock.mockImplementation(async (url: string) => {
      if (url === REFRESH_DEFAULT_PATH) {
        refreshCalls += 1;
        return pendingRefresh;
      }
      if (seen.has(url)) return jsonResponse({ url });
      seen.add(url);
      return emptyResponse(401);
    });

    const api = createApiClient({ basePath: "/api", withRefresh: true });
    const first = api.request<{ url: string }>("/a");
    const second = api.request<{ url: string }>("/b");
    await flush();
    releaseRefresh();

    await expect(Promise.all([first, second])).resolves.toEqual([
      { url: "/api/a" },
      { url: "/api/b" },
    ]);
    expect(refreshCalls).toBe(1);
  });

  it("relance un rafraichissement une fois le precedent termine", async () => {
    let refreshCalls = 0;
    const seen = new Set<string>();
    fetchMock.mockImplementation(async (url: string) => {
      if (url === REFRESH_DEFAULT_PATH) {
        refreshCalls += 1;
        return emptyResponse(200);
      }
      if (seen.has(url)) return jsonResponse({ url });
      seen.add(url);
      return emptyResponse(401);
    });
    const api = createApiClient({ basePath: "/api", withRefresh: true });
    await api.request("/a");
    await api.request("/b");
    expect(refreshCalls).toBe(2);
  });
});
