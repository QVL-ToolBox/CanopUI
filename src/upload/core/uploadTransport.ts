import { CanopApiError } from "../../http";
import { parseApiError, parseJsonBody } from "../../http/parseResponse";
import type {
  CanopOpenUploadBody,
  CanopPutChunkResponse,
  CanopTokenProvider,
  CanopUploadBytes,
  CanopUploadNode,
  CanopUploadSessionResponse,
  CanopUploadTransportOptions,
} from "./types";

export interface CanopUploadTransport {
  open: (body: CanopOpenUploadBody) => Promise<CanopUploadSessionResponse>;
  putChunk: (
    sessionId: string,
    chunkIndex: number,
    bytes: CanopUploadBytes,
    signal?: AbortSignal,
  ) => Promise<CanopPutChunkResponse>;
  status: (sessionId: string) => Promise<CanopUploadSessionResponse>;
  complete: (sessionId: string) => Promise<CanopUploadNode>;
  abort: (sessionId: string) => Promise<void>;
  uploadSingleShot: (
    fileName: string,
    bytes: CanopUploadBytes,
    mime: string | undefined,
    parentId: string | undefined,
    signal?: AbortSignal,
  ) => Promise<CanopUploadNode>;
}

async function authorizationHeader(getToken: CanopTokenProvider): Promise<Record<string, string>> {
  const token = await getToken();
  if (!token) {
    throw new CanopApiError(401, "Token JWT indisponible", "missing_token");
  }
  return { Authorization: `Bearer ${token}` };
}

export function createUploadTransport({
  basePath,
  filesPath = "/files",
  getToken,
}: CanopUploadTransportOptions): CanopUploadTransport {
  const send = async (path: string, init: RequestInit): Promise<Response> => {
    const auth = await authorizationHeader(getToken);
    const response = await fetch(`${basePath}${path}`, {
      ...init,
      headers: { ...auth, ...(init.headers ?? {}) },
    });
    if (!response.ok) {
      throw await parseApiError(response);
    }
    return response;
  };

  const open: CanopUploadTransport["open"] = async (body) => {
    const response = await send("/v1/uploads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return parseJsonBody<CanopUploadSessionResponse>(response);
  };

  const putChunk: CanopUploadTransport["putChunk"] = async (
    sessionId,
    chunkIndex,
    bytes,
    signal,
  ) => {
    const response = await send(`/v1/uploads/${sessionId}/chunks/${chunkIndex}`, {
      method: "PUT",
      headers: { "Content-Type": "application/octet-stream" },
      body: bytes,
      signal,
    });
    return parseJsonBody<CanopPutChunkResponse>(response);
  };

  const status: CanopUploadTransport["status"] = async (sessionId) => {
    const response = await send(`/v1/uploads/${sessionId}`, {
      method: "GET",
    });
    return parseJsonBody<CanopUploadSessionResponse>(response);
  };

  const complete: CanopUploadTransport["complete"] = async (sessionId) => {
    const response = await send(`/v1/uploads/${sessionId}/complete`, {
      method: "POST",
    });
    return parseJsonBody<CanopUploadNode>(response);
  };

  const abort: CanopUploadTransport["abort"] = async (sessionId) => {
    await send(`/v1/uploads/${sessionId}`, { method: "DELETE" });
  };

  const uploadSingleShot: CanopUploadTransport["uploadSingleShot"] = async (
    fileName,
    bytes,
    mime,
    parentId,
    signal,
  ) => {
    const form = new FormData();
    const blob = new Blob([bytes], {
      type: mime ?? "application/octet-stream",
    });
    form.append("file", blob, fileName);
    if (parentId) {
      form.append("parent_id", parentId);
    }
    const response = await send(filesPath, {
      method: "POST",
      body: form,
      signal,
    });
    return parseJsonBody<CanopUploadNode>(response);
  };

  return {
    open,
    putChunk,
    status,
    complete,
    abort,
    uploadSingleShot,
  };
}
