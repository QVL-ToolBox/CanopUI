import { lazy, type ComponentType, type LazyExoticComponent } from "react";

const modules = import.meta.glob<{ default: ComponentType }>("../pages/components/*Doc.tsx");

function slugFromPath(path: string): string {
  const name =
    path
      .split("/")
      .pop()
      ?.replace(/Doc\.tsx$/, "") ?? "";
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

const pages = new Map<string, LazyExoticComponent<ComponentType>>();

for (const [path, loader] of Object.entries(modules)) {
  pages.set(slugFromPath(path), lazy(loader));
}

export function componentPage(slug: string): LazyExoticComponent<ComponentType> | undefined {
  return pages.get(slug);
}
