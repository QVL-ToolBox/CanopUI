export type CanopUploadSessionState = "open" | "completing" | "completed" | "aborted";

export interface CanopUploadSessionResponse {
  session_id: string;
  parent_id: string;
  file_name: string;
  declared_size: number;
  reserved_bytes: number;
  chunk_size: number;
  chunk_count: number;
  state: CanopUploadSessionState;
  received_bytes: number;
  expires_at: string;
}

export interface CanopOpenUploadBody {
  parent_id?: string;
  file_name: string;
  declared_size: number;
  chunk_size: number;
  declared_mime?: string;
  checksum?: string;
}

export interface CanopPutChunkResponse {
  session_id: string;
  chunk_index: number;
  received_bytes: number;
  declared_size: number;
}

export interface CanopUploadNode {
  id: string;
  parent_id: string;
  name: string;
  mime?: string;
  size: number;
}

export type CanopUploadBytes = Uint8Array<ArrayBuffer>;

export interface CanopUploadSource {
  name: string;
  size: number;
  mime?: string;
  slice: (start: number, end: number) => Promise<CanopUploadBytes>;
}

export type CanopUploadStrategy = "single-shot" | "chunked";

export type CanopUploadPhase =
  "idle" | "opening" | "uploading" | "completing" | "completed" | "paused" | "aborted" | "error";

export interface CanopUploadProgress {
  phase: CanopUploadPhase;
  strategy: CanopUploadStrategy;
  uploadedBytes: number;
  totalBytes: number;
  ratio: number;
  percentage: number;
  chunkCount: number;
  completedChunkCount: number;
}

export interface CanopUploadResult {
  strategy: CanopUploadStrategy;
  node: CanopUploadNode;
}

export type CanopTokenProvider = () => string | null | Promise<string | null>;

export interface CanopUploadTransportOptions {
  basePath: string;
  filesPath?: string;
  getToken: CanopTokenProvider;
}

export interface CanopStartUploadParams {
  source: CanopUploadSource;
  parentId?: string;
  checksum?: string;
}
