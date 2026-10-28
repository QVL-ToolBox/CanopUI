export function isCaretAtEnd(input: HTMLInputElement | null): boolean {
  if (!input) return false;
  const end = input.value.length;
  return input.selectionStart === end && input.selectionEnd === end;
}

export function startsInsideClip(element: Element | null, clip: Element): boolean {
  const clipBox = clip.getBoundingClientRect();
  if (!element || clipBox.width === 0) return true;
  return Math.round(element.getBoundingClientRect().left) < Math.round(clipBox.right);
}

export function isPointWithin(element: Element | null, x: number, y: number): boolean {
  if (!element) return false;
  const box = element.getBoundingClientRect();
  return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
}
