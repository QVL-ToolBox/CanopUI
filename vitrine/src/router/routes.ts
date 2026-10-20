export function routeHref(path: string): string {
  return `#/${path.replace(/^\/+/, "")}`;
}

export function navigateTo(path: string): void {
  window.location.hash = routeHref(path).slice(1);
}
