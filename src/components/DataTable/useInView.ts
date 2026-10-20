import { useEffect, useRef, useState } from "react";

export interface UseInViewOptions {
  root?: Element | null;
  rootMargin?: string;
  amount?: number;
  once?: boolean;
}

export interface UseInViewResult<T extends Element> {
  ref: (node: T | null) => void;
  inView: boolean;
}

export function useInView<T extends Element>({
  root = null,
  rootMargin = "0px",
  amount = 0.1,
  once = true,
}: UseInViewOptions = {}): UseInViewResult<T> {
  const [inView, setInView] = useState(false);
  const nodeRef = useRef<T | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const inViewRef = useRef(false);

  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  const ref = (node: T | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    nodeRef.current = node;
    if (!node || typeof IntersectionObserver === "undefined") {
      if (!node) return;
      setInView(true);
      return;
    }
    if (once && inViewRef.current) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) {
            observer.disconnect();
            observerRef.current = null;
          }
        } else if (!once) {
          setInView(false);
        }
      },
      { root, rootMargin, threshold: amount },
    );
    observer.observe(node);
    observerRef.current = observer;
  };

  return { ref, inView };
}
