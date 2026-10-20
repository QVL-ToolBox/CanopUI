import { useTranslation } from "../../i18n";
import type { UseSvgMapViewportResult } from "../../svgmap";
import { IconActionButton } from "../IconActionButton";
import { Stack } from "../Stack";

export interface CanopSvgMapControlsProps {
  viewport: UseSvgMapViewportResult;
  /** Pas de zoom des boutons. 1,6 est plus franc que la molette. */
  step?: number;
}

const DEFAULT_STEP = 1.6;

/**
 * Les commandes de zoom, pour qui n'a ni molette ni deux doigts.
 *
 * La vue d'ensemble n'apparaît que lorsqu'on est zoomé : un bouton qui ne
 * ferait rien vaut moins qu'un bouton absent.
 */
export function SvgMapControls({ viewport, step = DEFAULT_STEP }: CanopSvgMapControlsProps) {
  const { t } = useTranslation();

  return (
    <Stack direction="column" gap="xs" ariaLabel={t("canop.svgMap.controls")} role="group">
      <IconActionButton
        icon="zoomIn"
        size="2.25rem"
        iconSize="sm"
        variant="secondary"
        ariaLabel={t("canop.svgMap.zoomIn")}
        onClick={() => viewport.zoomBy(1 / step)}
      />
      <IconActionButton
        icon="zoomOut"
        size="2.25rem"
        iconSize="sm"
        variant="secondary"
        ariaLabel={t("canop.svgMap.zoomOut")}
        onClick={() => viewport.zoomBy(step)}
      />
      {viewport.zoomed && (
        <IconActionButton
          icon="expand"
          size="2.25rem"
          iconSize="sm"
          variant="secondary"
          ariaLabel={t("canop.svgMap.reset")}
          onClick={viewport.reset}
        />
      )}
    </Stack>
  );
}
