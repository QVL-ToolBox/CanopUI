import Box from "@mui/material/Box";
import { useTranslation } from "../../i18n";
import { EmptyState } from "../EmptyState";
import { Icon } from "../Icon";
import { Link } from "../Link";

export interface MapFallbackProps {
  center: { lat: number; lng: number };
  zoom: number;
  height: number | string;
}

function externalHref(center: { lat: number; lng: number }, zoom: number): string {
  const view = `${Math.round(zoom)}/${center.lat}/${center.lng}`;
  return `https://www.openstreetmap.org/?mlat=${center.lat}&mlon=${center.lng}#map=${view}`;
}

export function MapFallback({ center, zoom, height }: MapFallbackProps) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        height: height,
        width: "100%",
        backgroundColor: "var(--canop-palette-surface-sunken)",
      }}
    >
      <EmptyState
        surface="plain"
        minHeight="100%"
        animated={false}
        icon={<Icon name="mapLocation" size="lg" color="primary" />}
        title={t("canop.map.unavailable")}
        description={t("canop.map.unavailableHint")}
        action={
          <Link href={externalHref(center, zoom)} size="small">
            {t("canop.map.openExternally")}
          </Link>
        }
      />
    </Box>
  );
}
