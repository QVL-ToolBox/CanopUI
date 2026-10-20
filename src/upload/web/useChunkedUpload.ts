import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createUploader,
  type CanopTokenProvider,
  type CanopUploadProgress,
  type CanopUploadResult,
  type CanopUploader,
} from "../core";
import { fileUploadSource } from "./fileUploadSource";
import { useUploadErrorFallback } from "./useFileUploaderLabels";

export interface UseChunkedUploadParams {
  basePath: string;
  getToken: CanopTokenProvider;
  parentId?: string;
  filesPath?: string;
  chunkSize?: number;
  /** Message affiché quand l'échec ne porte aucun message exploitable. */
  errorFallbackLabel?: string;
  onCompleted?: (result: CanopUploadResult) => void;
  onError?: (error: unknown) => void;
}

export interface UseChunkedUploadResult {
  progress: CanopUploadProgress;
  fileName: string | null;
  errorMessage: string | null;
  isActive: boolean;
  canPause: boolean;
  canResume: boolean;
  selectFile: (file: File) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  abort: () => void;
  reset: () => void;
}

const initialProgress: CanopUploadProgress = {
  phase: "idle",
  strategy: "chunked",
  uploadedBytes: 0,
  totalBytes: 0,
  ratio: 0,
  percentage: 0,
  chunkCount: 0,
  completedChunkCount: 0,
};

function errorToMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export function useChunkedUpload({
  basePath,
  getToken,
  parentId,
  filesPath,
  chunkSize,
  errorFallbackLabel,
  onCompleted,
  onError,
}: UseChunkedUploadParams): UseChunkedUploadResult {
  const errorFallback = useUploadErrorFallback(errorFallbackLabel);
  const [progress, setProgress] = useState<CanopUploadProgress>(initialProgress);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileRef = useRef<File | null>(null);
  const uploaderRef = useRef<CanopUploader | null>(null);

  const buildUploader = useCallback((): CanopUploader => {
    return createUploader({
      basePath,
      filesPath,
      getToken,
      chunkSize,
      onProgress: setProgress,
    });
  }, [basePath, filesPath, getToken, chunkSize]);

  const handleResult = useCallback(
    (result: CanopUploadResult) => {
      setErrorMessage(null);
      onCompleted?.(result);
    },
    [onCompleted],
  );

  const handleFailure = useCallback(
    (error: unknown) => {
      if (error instanceof Error && error.name === "PauseError") {
        return;
      }
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      setErrorMessage(errorToMessage(error, errorFallback));
      onError?.(error);
    },
    [onError, errorFallback],
  );

  const selectFile = useCallback((file: File) => {
    fileRef.current = file;
    uploaderRef.current = null;
    setFileName(file.name);
    setErrorMessage(null);
    setProgress(initialProgress);
  }, []);

  const start = useCallback(() => {
    const file = fileRef.current;
    if (!file) {
      return;
    }
    const uploader = buildUploader();
    uploaderRef.current = uploader;
    setErrorMessage(null);
    uploader
      .start({ source: fileUploadSource(file), parentId })
      .then(handleResult)
      .catch(handleFailure);
  }, [buildUploader, parentId, handleResult, handleFailure]);

  const pause = useCallback(() => {
    uploaderRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    const uploader = uploaderRef.current;
    if (!uploader) {
      return;
    }
    setErrorMessage(null);
    uploader.resume().then(handleResult).catch(handleFailure);
  }, [handleResult, handleFailure]);

  const abort = useCallback(() => {
    void uploaderRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    fileRef.current = null;
    uploaderRef.current = null;
    setFileName(null);
    setErrorMessage(null);
    setProgress(initialProgress);
  }, []);

  useEffect(() => {
    return () => {
      void uploaderRef.current?.abort();
    };
  }, []);

  const isActive = useMemo(
    () =>
      progress.phase === "opening" ||
      progress.phase === "uploading" ||
      progress.phase === "completing",
    [progress.phase],
  );

  const canPause = useMemo(
    () => progress.phase === "uploading" && progress.strategy === "chunked",
    [progress.phase, progress.strategy],
  );

  const canResume = useMemo(
    () => progress.phase === "paused" || progress.phase === "error",
    [progress.phase],
  );

  return {
    progress,
    fileName,
    errorMessage,
    isActive,
    canPause,
    canResume,
    selectFile,
    start,
    pause,
    resume,
    abort,
    reset,
  };
}
