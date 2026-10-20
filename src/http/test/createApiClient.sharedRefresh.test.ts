import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CanopApiError as CanopApiErrorClass } from "../ApiError";
import type { createApiClient as CreateApiClient } from "../createApiClient";

const DEFAULT_REFRESH = "/api/auth/refresh";

type RefreshOutcome = Response | Error;

interface FakeServer {
  refreshCalls: string[];
  dataCalls: string[];
  pendingRefreshes: number;
  completeRefresh: (outcome: RefreshOutcome) => void;
  expireToken: () => void;
}

function emptyResponse(status: number): Response {
  return new Response(null, { status });
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function flush(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function installFakeServer(refreshPaths: string[]): FakeServer {
  let token = "old";
  const waiters: Array<(outcome: RefreshOutcome) => void> = [];
  const server: FakeServer = {
    refreshCalls: [],
    dataCalls: [],
    get pendingRefreshes() {
      return waiters.length;
    },
    completeRefresh: (outcome) => {
      const waiter = waiters.shift();
      if (waiter) waiter(outcome);
    },
    expireToken: () => {
      token = "old";
    },
  };
  const fetchMock = vi.fn((url: string) => {
    if (refreshPaths.includes(url)) {
      server.refreshCalls.push(url);
      return new Promise<Response>((resolve, reject) => {
        waiters.push((outcome) => {
          if (outcome instanceof Error) {
            reject(outcome);
            return;
          }
          if (outcome.ok) token = "new";
          resolve(outcome);
        });
      });
    }
    server.dataCalls.push(`${url}@${token}`);
    if (token === "old") return Promise.resolve(jsonResponse({ message: `expire ${url}` }, 401));
    return Promise.resolve(jsonResponse({ url, token }));
  });
  vi.stubGlobal("fetch", fetchMock);
  return server;
}

let createApiClient: typeof CreateApiClient;
let CanopApiError: typeof CanopApiErrorClass;

beforeEach(async () => {
  vi.resetModules();
  ({ createApiClient } = await import("../createApiClient"));
  ({ CanopApiError } = await import("../ApiError"));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function twoRefreshingClients() {
  return [
    createApiClient({ basePath: "/portal", withRefresh: true }),
    createApiClient({ basePath: "/auth-portals", withRefresh: true }),
  ] as const;
}

describe("createApiClient - refresh partage entre instances", () => {
  it("n'envoie qu'un seul POST refresh quand deux clients recoivent un 401 en meme temps", async () => {
    const server = installFakeServer([DEFAULT_REFRESH]);
    const [portal, authPortals] = twoRefreshingClients();

    const first = portal.request<{ url: string; token: string }>("/me");
    const second = authPortals.request<{ url: string; token: string }>("/session");
    await flush();

    expect(server.refreshCalls).toEqual([DEFAULT_REFRESH]);
    expect(server.pendingRefreshes).toBe(1);

    server.completeRefresh(emptyResponse(200));

    await expect(Promise.all([first, second])).resolves.toEqual([
      { url: "/portal/me", token: "new" },
      { url: "/auth-portals/session", token: "new" },
    ]);
    expect(server.refreshCalls).toHaveLength(1);
    expect(server.dataCalls.filter((call) => call.endsWith("@new")).sort()).toEqual([
      "/auth-portals/session@new",
      "/portal/me@new",
    ]);
  });

  it("fait attendre un client dont le 401 arrive pendant le refresh d'un autre client", async () => {
    const server = installFakeServer([DEFAULT_REFRESH]);
    const [portal, authPortals] = twoRefreshingClients();

    const first = portal.request("/me");
    await flush();
    const late = authPortals.request("/session");
    await flush();

    expect(server.refreshCalls).toHaveLength(1);
    server.completeRefresh(emptyResponse(204));

    await expect(Promise.all([first, late])).resolves.toEqual([
      { url: "/portal/me", token: "new" },
      { url: "/auth-portals/session", token: "new" },
    ]);
    expect(server.refreshCalls).toHaveLength(1);
  });

  it("propage la 401 d'origine aux deux clients sans rien rejouer quand le refresh repond 500", async () => {
    const server = installFakeServer([DEFAULT_REFRESH]);
    const [portal, authPortals] = twoRefreshingClients();

    const first = portal.request("/me").catch((error: unknown) => error);
    const second = authPortals.request("/session").catch((error: unknown) => error);
    await flush();
    server.completeRefresh(emptyResponse(500));

    const [firstError, secondError] = await Promise.all([first, second]);
    expect(firstError).toBeInstanceOf(CanopApiError);
    expect(secondError).toBeInstanceOf(CanopApiError);
    expect(firstError).toMatchObject({ status: 401, message: "expire /portal/me" });
    expect(secondError).toMatchObject({ status: 401, message: "expire /auth-portals/session" });
    expect(server.refreshCalls).toHaveLength(1);
    expect(server.dataCalls).toEqual(["/portal/me@old", "/auth-portals/session@old"]);
  });

  it("propage la 401 d'origine aux deux clients sans rien rejouer quand le refresh rejette", async () => {
    const server = installFakeServer([DEFAULT_REFRESH]);
    const [portal, authPortals] = twoRefreshingClients();

    const first = portal.request("/me").catch((error: unknown) => error);
    const second = authPortals.request("/session").catch((error: unknown) => error);
    await flush();
    server.completeRefresh(new Error("reseau indisponible"));

    const [firstError, secondError] = await Promise.all([first, second]);
    expect(firstError).toBeInstanceOf(CanopApiError);
    expect(secondError).toBeInstanceOf(CanopApiError);
    expect(firstError).toMatchObject({ status: 401, message: "expire /portal/me" });
    expect(secondError).toMatchObject({ status: 401, message: "expire /auth-portals/session" });
    expect(server.refreshCalls).toHaveLength(1);
    expect(server.dataCalls).toHaveLength(2);
  });

  it("ne fait pas attendre deux clients dont les refreshPath different", async () => {
    const server = installFakeServer(["/portal/refresh", "/admin/refresh"]);
    const portal = createApiClient({
      basePath: "/portal",
      withRefresh: true,
      refreshPath: "/portal/refresh",
    });
    const admin = createApiClient({
      basePath: "/admin",
      withRefresh: true,
      refreshPath: "/admin/refresh",
    });

    const first = portal.request("/me");
    const second = admin.request("/me");
    await flush();

    expect(server.refreshCalls.sort()).toEqual(["/admin/refresh", "/portal/refresh"]);
    expect(server.pendingRefreshes).toBe(2);

    server.completeRefresh(emptyResponse(200));
    server.completeRefresh(emptyResponse(200));
    await expect(Promise.all([first, second])).resolves.toHaveLength(2);
  });

  it("libere le verrou apres un refresh reussi : un nouveau 401 relance un refresh", async () => {
    const server = installFakeServer([DEFAULT_REFRESH]);
    const [portal, authPortals] = twoRefreshingClients();

    const first = portal.request("/me");
    await flush();
    server.completeRefresh(emptyResponse(200));
    await first;

    server.expireToken();
    const second = authPortals.request("/session");
    await flush();

    expect(server.refreshCalls).toHaveLength(2);
    server.completeRefresh(emptyResponse(200));
    await expect(second).resolves.toEqual({ url: "/auth-portals/session", token: "new" });
  });

  it("libere le verrou apres un refresh en echec : un nouveau 401 relance un refresh", async () => {
    const server = installFakeServer([DEFAULT_REFRESH]);
    const [portal, authPortals] = twoRefreshingClients();

    const failed = portal.request("/me").catch((error: unknown) => error);
    await flush();
    server.completeRefresh(emptyResponse(500));
    await expect(failed).resolves.toMatchObject({ status: 401 });

    const retried = authPortals.request("/session");
    await flush();

    expect(server.refreshCalls).toHaveLength(2);
    server.completeRefresh(emptyResponse(200));
    await expect(retried).resolves.toEqual({ url: "/auth-portals/session", token: "new" });
  });
});
