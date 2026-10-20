import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useInView } from "../useInView";

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];

  observe = vi.fn();
  disconnect = vi.fn();
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
    FakeIntersectionObserver.instances.push(this);
  }

  emit(entries: Partial<IntersectionObserverEntry>[]) {
    this.callback(entries as IntersectionObserverEntry[], this as unknown as IntersectionObserver);
  }
}

const instances = () => FakeIntersectionObserver.instances;

const lastInstance = () => instances()[instances().length - 1];

describe("useInView", () => {
  beforeEach(() => {
    FakeIntersectionObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("n'observe rien tant qu'aucun nœud n'est attaché", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>());

    expect(result.current.inView).toBe(false);
    expect(instances()).toHaveLength(0);
  });

  it("observe le nœud attaché sans le déclarer visible", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>());
    const node = document.createElement("div");

    act(() => result.current.ref(node));

    expect(instances()).toHaveLength(1);
    expect(lastInstance().observe).toHaveBeenCalledWith(node);
    expect(result.current.inView).toBe(false);
  });

  it("déclare le nœud visible quand il entre dans la zone observée", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>());

    act(() => result.current.ref(document.createElement("div")));
    act(() => lastInstance().emit([{ isIntersecting: true }]));

    expect(result.current.inView).toBe(true);
  });

  it("cesse d'observer après la première entrée quand once est actif", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>());

    act(() => result.current.ref(document.createElement("div")));
    const observer = lastInstance();
    act(() => observer.emit([{ isIntersecting: true }]));

    expect(observer.disconnect).toHaveBeenCalled();
  });

  it("reste visible sans réobserver quand un nouveau nœud est attaché après coup", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>());

    act(() => result.current.ref(document.createElement("div")));
    act(() => lastInstance().emit([{ isIntersecting: true }]));
    act(() => result.current.ref(document.createElement("div")));

    expect(instances()).toHaveLength(1);
    expect(result.current.inView).toBe(true);
  });

  it("repasse à invisible à la sortie quand once est désactivé", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>({ once: false }));

    act(() => result.current.ref(document.createElement("div")));
    act(() => lastInstance().emit([{ isIntersecting: true }]));

    expect(result.current.inView).toBe(true);

    act(() => lastInstance().emit([{ isIntersecting: false }]));

    expect(result.current.inView).toBe(false);
  });

  it("continue d'observer après une entrée quand once est désactivé", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>({ once: false }));

    act(() => result.current.ref(document.createElement("div")));
    act(() => lastInstance().emit([{ isIntersecting: true }]));

    expect(lastInstance().disconnect).not.toHaveBeenCalled();
    expect(result.current.inView).toBe(true);
  });

  it("ignore une notification sans entrée", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>());

    act(() => result.current.ref(document.createElement("div")));
    act(() => lastInstance().emit([]));

    expect(result.current.inView).toBe(false);
  });

  it("ignore une sortie de zone quand once est actif", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>());

    act(() => result.current.ref(document.createElement("div")));
    act(() => lastInstance().emit([{ isIntersecting: false }]));

    expect(result.current.inView).toBe(false);
    expect(lastInstance().disconnect).not.toHaveBeenCalled();
  });

  it("libère l'observateur quand le nœud est détaché", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>({ once: false }));

    act(() => result.current.ref(document.createElement("div")));
    const observer = lastInstance();
    act(() => result.current.ref(null));

    expect(observer.disconnect).toHaveBeenCalled();
    expect(result.current.inView).toBe(false);
  });

  it("remplace l'observateur quand un autre nœud est attaché", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>({ once: false }));

    act(() => result.current.ref(document.createElement("div")));
    const first = lastInstance();
    act(() => result.current.ref(document.createElement("div")));

    expect(first.disconnect).toHaveBeenCalled();
    expect(instances()).toHaveLength(2);
  });

  it("libère l'observateur au démontage", () => {
    const { result, unmount } = renderHook(() => useInView<HTMLDivElement>({ once: false }));

    act(() => result.current.ref(document.createElement("div")));
    const observer = lastInstance();
    unmount();

    expect(observer.disconnect).toHaveBeenCalled();
  });

  it("applique les options d'observation par défaut", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>());

    act(() => result.current.ref(document.createElement("div")));

    expect(lastInstance().options).toEqual({ root: null, rootMargin: "0px", threshold: 0.1 });
  });

  it("applique les options d'observation fournies", () => {
    const root = document.createElement("section");
    const { result } = renderHook(() =>
      useInView<HTMLDivElement>({ root, rootMargin: "24px", amount: 0.75 }),
    );

    act(() => result.current.ref(document.createElement("div")));

    expect(lastInstance().options).toEqual({ root, rootMargin: "24px", threshold: 0.75 });
  });
});

describe("useInView sans IntersectionObserver", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("déclare le nœud visible dès son attachement", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>());

    act(() => result.current.ref(document.createElement("div")));

    expect(result.current.inView).toBe(true);
  });

  it("reste invisible quand aucun nœud n'est attaché", () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>());

    act(() => result.current.ref(null));

    expect(result.current.inView).toBe(false);
  });
});
