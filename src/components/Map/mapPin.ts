const PIN_SIZE = "2.25rem";

const PIN_PATH =
  "M12 1.6c-4.14 0-7.5 3.3-7.5 7.36 0 5.3 6.02 12.09 7.06 13.23a.6.6 0 0 0 .88 0" +
  "c1.04-1.14 7.06-7.93 7.06-13.23 0-4.06-3.36-7.36-7.5-7.36Z";

const PIN_FILL = "var(--canop-palette-primary-main)";
const PIN_STROKE = "var(--canop-palette-background-paper)";

const PIN_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" ` +
  `aria-hidden="true" focusable="false" style="display:block">` +
  `<path d="${PIN_PATH}" fill="${PIN_FILL}" stroke="${PIN_STROKE}" stroke-width="1.4" ` +
  `stroke-linejoin="round" />` +
  `<circle cx="12" cy="8.9" r="2.9" fill="${PIN_STROKE}" />` +
  `</svg>`;

export function createMapPin(): HTMLElement {
  const element = document.createElement("div");
  element.className = "canop-map-pin";
  element.style.width = PIN_SIZE;
  element.style.height = PIN_SIZE;
  element.style.cursor = "pointer";
  element.style.filter = "var(--canop-drop-shadow-e1)";
  element.innerHTML = PIN_SVG;
  return element;
}
