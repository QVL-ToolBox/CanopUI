import { afterEach, describe, expect, it, vi } from "vitest";
import { CanopApiError } from "../../../http";
import { withRetry } from "../retry";

function failingOperation(error: unknown, successAfter = Number.POSITIVE_INFINITY) {
  let calls = 0;
  return vi.fn(async () => {
    calls += 1;
    if (calls > successAfter) {
      return "ok";
    }
    throw error;
  });
}

function flush(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("withRetry - issue des tentatives", () => {
  it("n'appelle l'operation qu'une fois quand elle reussit du premier coup", async () => {
    const operation = vi.fn(async () => "ok");
    await expect(withRetry(operation, { maxRetries: 3, baseDelayMs: 1 })).resolves.toBe("ok");
    expect(operation).toHaveBeenCalledOnce();
  });

  it("reessaie jusqu'a la reussite et renvoie le resultat", async () => {
    const operation = failingOperation(new CanopApiError(503, "indisponible"), 2);
    await expect(withRetry(operation, { maxRetries: 5, baseDelayMs: 1 })).resolves.toBe("ok");
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it("abandonne apres maxRetries reessais et relance la derniere erreur", async () => {
    const error = new CanopApiError(500, "panne");
    const operation = failingOperation(error);
    await expect(withRetry(operation, { maxRetries: 2, baseDelayMs: 1 })).rejects.toBe(error);
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it("n'effectue aucun reessai quand maxRetries vaut zero", async () => {
    const operation = failingOperation(new CanopApiError(500, "panne"));
    await expect(withRetry(operation, { maxRetries: 0, baseDelayMs: 1 })).rejects.toThrow("panne");
    expect(operation).toHaveBeenCalledOnce();
  });
});

describe("withRetry - selection des erreurs reessayables", () => {
  it.each([500, 502, 503])("reessaie sur une erreur serveur %i", async (status) => {
    const operation = failingOperation(new CanopApiError(status, "serveur"), 1);
    await expect(withRetry(operation, { maxRetries: 3, baseDelayMs: 1 })).resolves.toBe("ok");
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("reessaie sur une reponse 429", async () => {
    const operation = failingOperation(new CanopApiError(429, "trop de requetes"), 1);
    await expect(withRetry(operation, { maxRetries: 3, baseDelayMs: 1 })).resolves.toBe("ok");
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it.each([400, 401, 404, 409, 422])(
    "abandonne immediatement sur une erreur cliente %i",
    async (status) => {
      const operation = failingOperation(new CanopApiError(status, "refuse"));
      await expect(withRetry(operation, { maxRetries: 5, baseDelayMs: 1 })).rejects.toMatchObject({
        status,
      });
      expect(operation).toHaveBeenCalledOnce();
    },
  );

  it("reessaie sur une erreur qui n'est pas une CanopApiError", async () => {
    const operation = failingOperation(new TypeError("reseau coupe"), 1);
    await expect(withRetry(operation, { maxRetries: 3, baseDelayMs: 1 })).resolves.toBe("ok");
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("reessaie sur une valeur rejetee qui n'est pas une Error", async () => {
    const operation = failingOperation("panne brute", 1);
    await expect(withRetry(operation, { maxRetries: 3, baseDelayMs: 1 })).resolves.toBe("ok");
    expect(operation).toHaveBeenCalledTimes(2);
  });
});

describe("withRetry - delais entre tentatives", () => {
  it("espace les tentatives selon un delai exponentiel", async () => {
    vi.useFakeTimers();
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    const operation = failingOperation(new CanopApiError(500, "panne"));
    const settled = withRetry(operation, { maxRetries: 3, baseDelayMs: 100 }).catch(() => "echec");
    await vi.advanceTimersByTimeAsync(100 + 200 + 400);
    await expect(settled).resolves.toBe("echec");
    expect(setTimeoutSpy.mock.calls.map((call) => call[1])).toEqual([100, 200, 400]);
  });

  it("n'attend pas apres la derniere tentative", async () => {
    vi.useFakeTimers();
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    const operation = failingOperation(new CanopApiError(500, "panne"));
    const settled = withRetry(operation, { maxRetries: 0, baseDelayMs: 100 }).catch(() => "echec");
    await expect(settled).resolves.toBe("echec");
    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });
});

describe("withRetry - interruption par signal", () => {
  it("refuse de lancer l'operation quand le signal est deja avorte", async () => {
    const controller = new AbortController();
    controller.abort(new Error("deja avorte"));
    const operation = vi.fn(async () => "ok");
    await expect(
      withRetry(operation, { maxRetries: 3, baseDelayMs: 1, signal: controller.signal }),
    ).rejects.toThrow("deja avorte");
    expect(operation).not.toHaveBeenCalled();
  });

  it("relance l'erreur d'origine quand l'operation avorte le signal", async () => {
    const controller = new AbortController();
    const operation = vi.fn(async () => {
      controller.abort(new Error("interrompu"));
      throw new CanopApiError(500, "panne");
    });
    await expect(
      withRetry(operation, { maxRetries: 3, baseDelayMs: 1, signal: controller.signal }),
    ).rejects.toThrow("panne");
    expect(operation).toHaveBeenCalledOnce();
  });

  it("interrompt l'attente en cours quand le signal est avorte", async () => {
    const controller = new AbortController();
    const operation = failingOperation(new CanopApiError(500, "panne"));
    const settled = withRetry(operation, {
      maxRetries: 5,
      baseDelayMs: 5000,
      signal: controller.signal,
    }).catch((error: unknown) => error);
    await flush();
    controller.abort(new Error("interrompu"));
    await expect(settled).resolves.toMatchObject({ message: "interrompu" });
    expect(operation).toHaveBeenCalledOnce();
  });

  it("mene la boucle a son terme quand le signal reste actif", async () => {
    const controller = new AbortController();
    const operation = failingOperation(new CanopApiError(500, "panne"), 1);
    await expect(
      withRetry(operation, { maxRetries: 3, baseDelayMs: 1, signal: controller.signal }),
    ).resolves.toBe("ok");
    expect(controller.signal.aborted).toBe(false);
  });
});
