import { CanopApiError } from "./ApiError";

export function isUnauthorized(error: unknown): boolean {
  return error instanceof CanopApiError && error.status === 401;
}

export function isForbidden(error: unknown): boolean {
  return error instanceof CanopApiError && error.status === 403;
}
