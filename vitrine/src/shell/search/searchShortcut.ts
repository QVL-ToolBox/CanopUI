const APPLE_PLATFORM = /Mac|iPhone|iPad|iPod/i;

export function isSearchShortcut(event: KeyboardEvent): boolean {
  return (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
}

export function searchShortcutLabel(): string {
  return APPLE_PLATFORM.test(navigator.userAgent) ? "⌘K" : "Ctrl K";
}
