import { CanopApiError } from "./ApiError";

const NO_CONTENT_STATUS = 204;

export async function parseApiError(response: Response): Promise<CanopApiError> {
  let message = `Erreur ${response.status}`;
  let code: string | undefined;
  try {
    const body = await response.json();
    if (typeof body?.error === "string") code = body.error;
    if (typeof body?.message === "string") message = body.message;
    else if (code) message = code;
  } catch {
    message = `Erreur ${response.status}`;
  }
  return new CanopApiError(response.status, message, code);
}

export async function parseJsonBody<T>(response: Response): Promise<T> {
  if (response.status === NO_CONTENT_STATUS) {
    return undefined as T;
  }
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
