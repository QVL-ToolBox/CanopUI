import Box from "@mui/material/Box";
import { useCallback, useMemo, type KeyboardEvent, type ReactNode } from "react";
import {
  parseViewBox,
  useSvgMapViewport,
  viewBoxAspect,
  type UseSvgMapViewportResult,
} from "../../svgmap";
import { useTranslation } from "../../i18n";
import { SvgMapControls } from "./SvgMapControls";
import { useSvgMapGestures } from "./useSvgMapGestures";

export interface CanopSvgMapRegion {
  id: string;
  /** Le tracé, tel quel : l'attribut `d` d'un `<path>`. */
  path: string;
  /**
   * Nom lisible, **affiché** en infobulle au survol (`<title>`), et nom
   * accessible à défaut d'`ariaLabel`.
   */
  name?: string;
  /**
   * Nom accessible de la région, **jamais affiché**.
   *
   * Il existe parce que les deux besoins ne se confondent pas : un jeu de
   * désignation retire `name` pour qu'aucune infobulle ne vende la réponse au
   * survol, et se retrouvait alors avec un nom accessible replié sur l'`id` —
   * donc un lecteur d'écran qui annonce le numéro du département cherché. Cette
   * propriété étiquette la région sans rien montrer.
   *
   * Ordre de résolution du nom accessible d'une région sélectionnable :
   * `ariaLabel`, puis `name`, puis l'`id` en dernier recours — un bouton sans
   * nom accessible étant pire encore. **Si l'`id` porte l'information à
   * deviner, poser `ariaLabel`** : c'est le seul moyen de ne pas la dire.
   */
  ariaLabel?: string;
}

export interface CanopSvgMapProps {
  /** Vue d'ensemble du SVG, au format de l'attribut `viewBox`. */
  viewBox: string;
  regions: readonly CanopSvgMapRegion[];
  /** Couleur de remplissage d'une région. Appelée à chaque rendu. */
  fill?: (id: string) => string;
  /**
   * Couleur du contour des régions, `divider` par défaut.
   *
   * Ce jeton est le trait discret qui sépare deux surfaces, et il convient
   * tant que la carte n'est qu'une illustration. Il ne suffit plus dès que le
   * **découpage lui-même porte l'information** : en thème sombre, `divider`
   * est une surface neutre logée dans la même famille que tous les
   * remplissages disponibles, et le contour y plafonne à 1,47:1 — sous le 3:1
   * que WCAG 1.4.11 demande à un objet graphique. Une carte qu'on lit, ou sur
   * laquelle on désigne, doit donc monter son trait : `text.disabled` vaut
   * 2,94:1 en clair et 3,07:1 en sombre, le plus discret qui approche le
   * seuil des deux côtés.
   */
  stroke?: string;
  onSelect?: (id: string) => void;
  /**
   * Rend les régions cliquables et atteignables au clavier.
   *
   * Une carte non sélectionnable reste une image : elle se déplace et se
   * zoome, mais ne répond pas.
   */
  selectable?: boolean;
  /**
   * Vue partagée avec l'appelant, pour piloter le cadrage de l'extérieur —
   * un bouton « Île-de-France », par exemple. Sans elle, le composant tient
   * la sienne.
   */
  viewport?: UseSvgMapViewportResult;
  maxZoom?: number;
  /**
   * Largeur maximale de la carte, centrée dans son conteneur au-delà.
   *
   * Une carte occupe toute la largeur qu'on lui laisse et sa hauteur suit le
   * rapport du `viewBox` : sous un conteneur large, une vue presque carrée
   * dépasse l'écran en hauteur. Sans cette prop, chaque appelant devait
   * l'encadrer lui-même.
   */
  maxWidth?: string;
  /**
   * Hauteur maximale de la carte.
   *
   * Elle est **traduite en largeur** — `hauteur × rapport du viewBox` — parce
   * qu'une carte tire sa hauteur de sa largeur : posée telle quelle, une
   * hauteur maximale ne rétrécirait rien, elle laisserait le dessin déborder
   * du cadre au lieu de le contraindre. Traduite, elle borne réellement la
   * carte, le cadre reste collé au dessin — donc les commandes de zoom aussi —
   * et le centrage de `maxWidth` vaut pour les deux.
   *
   * C'est la borne qui compte dès que la place manque en hauteur : sur un
   * écran de bureau peu haut, une vue presque carrée est plafonnée par la
   * hauteur utile bien avant de l'être par la largeur, et l'élargir n'y change
   * rien. Posée avec `maxWidth`, la plus serrée des deux l'emporte.
   */
  maxHeight?: string;
  /** Boutons de zoom intégrés. */
  controls?: boolean;
  tapTolerance?: number;
  wheel?: boolean;
  ariaLabel?: string;
  /** Posé au-dessus de la carte : légende, commandes maison, consigne. */
  overlay?: ReactNode;
}

const DEFAULT_FILL = "var(--canop-palette-background-paper)";
const DEFAULT_STROKE = "var(--canop-palette-divider)";

const ASPECT_PRECISION = 10000;

function widthUnderHeight(viewBox: string, maxHeight?: string): string | undefined {
  if (!maxHeight) return undefined;
  const overview = parseViewBox(viewBox);
  if (!overview) return undefined;
  const aspect = Math.round(viewBoxAspect(overview) * ASPECT_PRECISION) / ASPECT_PRECISION;
  return `calc(${maxHeight} * ${aspect})`;
}

function inlineBound(maxWidth?: string, underHeight?: string): string | undefined {
  if (maxWidth && underHeight) return `min(${maxWidth}, ${underHeight})`;
  return maxWidth ?? underHeight;
}

export function SvgMap({
  viewBox,
  regions,
  fill,
  stroke = DEFAULT_STROKE,
  onSelect,
  selectable = false,
  viewport: controlledViewport,
  maxZoom = 9,
  maxWidth,
  maxHeight,
  controls = true,
  tapTolerance,
  wheel = true,
  ariaLabel,
  overlay,
}: CanopSvgMapProps) {
  const { t } = useTranslation();
  const maxInlineSize = useMemo(
    () => inlineBound(maxWidth, widthUnderHeight(viewBox, maxHeight)),
    [maxHeight, maxWidth, viewBox],
  );
  const ownViewport = useSvgMapViewport({ viewBox, maxZoom });
  const viewport = controlledViewport ?? ownViewport;

  const { onPointerDown, isDragging, attach } = useSvgMapGestures({
    viewport,
    tapTolerance,
    wheel,
  });

  const selectUnlessEndingADrag = useCallback(
    (id: string) => {
      if (isDragging()) return;
      onSelect?.(id);
    },
    [isDragging, onSelect],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<SVGPathElement>, id: string) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      onSelect?.(id);
    },
    [onSelect],
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        ...(maxInlineSize ? { maxWidth: maxInlineSize, marginInline: "auto" } : {}),
      }}
    >
      <Box
        component="svg"
        ref={attach}
        viewBox={viewport.viewBox}
        onPointerDown={onPointerDown}
        role={selectable ? "group" : "img"}
        aria-label={ariaLabel ?? t("canop.svgMap.label")}
        sx={{
          display: "block",
          width: "100%",
          height: "auto",
          touchAction: "none",
          userSelect: "none",
          WebkitTouchCallout: "none",
        }}
      >
        {regions.map((region) => (
          <Box
            component="path"
            key={region.id}
            ref={(element: SVGPathElement | null) => viewport.registerRegion(region.id, element)}
            d={region.path}
            role={selectable ? "button" : undefined}
            tabIndex={selectable ? 0 : undefined}
            aria-label={selectable ? (region.ariaLabel ?? region.name ?? region.id) : undefined}
            onClick={selectable ? () => selectUnlessEndingADrag(region.id) : undefined}
            onKeyDown={selectable ? (event) => onKeyDown(event, region.id) : undefined}
            sx={{
              fill: fill?.(region.id) ?? DEFAULT_FILL,
              stroke,
              strokeWidth: 0.4,
              vectorEffect: "non-scaling-stroke",
              transition: "fill 0.15s",
              ...(selectable
                ? {
                    cursor: "pointer",
                    outline: "none",
                    "&:hover": { filter: "brightness(0.92)" },
                    "&:focus-visible": {
                      stroke: "var(--canop-palette-primary-main)",
                      strokeWidth: 2.5,
                    },
                  }
                : {}),
            }}
          >
            {region.name ? <title>{region.name}</title> : null}
          </Box>
        ))}
      </Box>
      {(controls || overlay) && (
        <Box
          sx={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "flex-end",
          }}
        >
          {controls && <SvgMapControls viewport={viewport} />}
          {overlay}
        </Box>
      )}
    </Box>
  );
}
