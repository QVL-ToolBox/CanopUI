import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export function lazyNamed<K extends string>(
  load: () => Promise<Record<K, ComponentType>>,
  name: K,
): LazyExoticComponent<ComponentType> {
  return lazy(() => load().then((module) => ({ default: module[name] })));
}
