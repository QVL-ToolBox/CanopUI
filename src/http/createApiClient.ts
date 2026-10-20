import { parseApiError, parseJsonBody } from "./parseResponse";

export interface CanopApiClientOptions {
  basePath: string;
  withRefresh?: boolean;
  refreshPath?: string;
}

export interface CanopApiClient {
  request: <T>(path: string, init?: RequestInit) => Promise<T>;
}

function isFormData(body: BodyInit | null | undefined): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function buildHeaders(init: RequestInit | undefined): HeadersInit | undefined {
  if (isFormData(init?.body)) {
    return init?.headers;
  }
  return { "Content-Type": "application/json", ...(init?.headers ?? {}) };
}

const refreshesInFlight = new Map<string, Promise<boolean>>();

function sharedRefresh(refreshPath: string): Promise<boolean> {
  const inFlight = refreshesInFlight.get(refreshPath);
  if (inFlight) return inFlight;
  const refresh = fetch(refreshPath, {
    method: "POST",
    credentials: "same-origin",
  })
    .then((r) => r.ok)
    .catch(() => false)
    .finally(() => {
      refreshesInFlight.delete(refreshPath);
    });
  refreshesInFlight.set(refreshPath, refresh);
  return refresh;
}

export function createApiClient({
  basePath,
  withRefresh = false,
  refreshPath = "/api/auth/refresh",
}: CanopApiClientOptions): CanopApiClient {
  const rawFetch = (path: string, init?: RequestInit): Promise<Response> =>
    fetch(`${basePath}${path}`, {
      credentials: "same-origin",
      ...init,
      headers: buildHeaders(init),
    });

  const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
    let res = await rawFetch(path, init);

    if (res.status === 401 && withRefresh) {
      const refreshed = await sharedRefresh(refreshPath);
      if (refreshed) {
        res = await rawFetch(path, init);
      }
    }

    if (!res.ok) {
      throw await parseApiError(res);
    }
    return parseJsonBody<T>(res);
  };

  return { request };
}
