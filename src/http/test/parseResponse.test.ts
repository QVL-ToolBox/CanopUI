import { describe, expect, it } from "vitest";
import { CanopApiError } from "../ApiError";
import { parseApiError, parseJsonBody } from "../parseResponse";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("parseJsonBody", () => {
  it("renvoie undefined sur un 204", async () => {
    await expect(parseJsonBody(new Response(null, { status: 204 }))).resolves.toBeUndefined();
  });

  it("renvoie undefined sur un corps vide", async () => {
    await expect(parseJsonBody(new Response(""))).resolves.toBeUndefined();
  });

  it("deserialise un objet JSON", async () => {
    await expect(parseJsonBody(jsonResponse({ id: "u-1" }))).resolves.toEqual({ id: "u-1" });
  });

  it("deserialise un tableau JSON", async () => {
    await expect(parseJsonBody(jsonResponse([1, 2]))).resolves.toEqual([1, 2]);
  });

  it("deserialise une valeur scalaire", async () => {
    await expect(parseJsonBody(jsonResponse(false))).resolves.toBe(false);
  });

  it("propage l'echec de deserialisation d'un corps invalide", async () => {
    await expect(parseJsonBody(new Response("<html/>"))).rejects.toBeInstanceOf(SyntaxError);
  });
});

describe("parseApiError", () => {
  it("porte le statut de la reponse", async () => {
    const error = await parseApiError(jsonResponse({}, 418));
    expect(error).toBeInstanceOf(CanopApiError);
    expect(error.status).toBe(418);
  });

  it("retient le message applicatif", async () => {
    const error = await parseApiError(jsonResponse({ message: "Quota depasse" }, 409));
    expect(error.message).toBe("Quota depasse");
  });

  it("retient le code applicatif", async () => {
    const error = await parseApiError(jsonResponse({ error: "quota_exceeded" }, 409));
    expect(error.code).toBe("quota_exceeded");
  });

  it("utilise le code comme message a defaut de message", async () => {
    const error = await parseApiError(jsonResponse({ error: "quota_exceeded" }, 409));
    expect(error.message).toBe("quota_exceeded");
  });

  it("prefere le message au code quand les deux sont presents", async () => {
    const error = await parseApiError(jsonResponse({ error: "code", message: "Message" }, 409));
    expect(error.message).toBe("Message");
    expect(error.code).toBe("code");
  });

  it("construit un message par defaut sur un corps JSON sans champ connu", async () => {
    const error = await parseApiError(jsonResponse({ detail: "autre" }, 500));
    expect(error.message).toBe("Erreur 500");
    expect(error.code).toBeUndefined();
  });

  it("ignore des champs message et code non textuels", async () => {
    const error = await parseApiError(jsonResponse({ error: 1, message: [] }, 500));
    expect(error.message).toBe("Erreur 500");
    expect(error.code).toBeUndefined();
  });

  it("construit un message par defaut sur un corps non JSON", async () => {
    const error = await parseApiError(new Response("<html/>", { status: 502 }));
    expect(error.message).toBe("Erreur 502");
  });

  it("construit un message par defaut sur un corps vide", async () => {
    const error = await parseApiError(new Response(null, { status: 503 }));
    expect(error.message).toBe("Erreur 503");
  });

  it("tolere un corps JSON nul", async () => {
    const error = await parseApiError(jsonResponse(null, 500));
    expect(error.message).toBe("Erreur 500");
  });
});
