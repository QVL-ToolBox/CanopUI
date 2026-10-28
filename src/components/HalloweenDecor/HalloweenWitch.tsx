import Box from "@mui/material/Box";
import { HalloweenGlyphLayer } from "./HalloweenGlyphLayer";
import type { HalloweenWitchSpec } from "./halloweenSceneTypes";
import {
  sparkleSx,
  witchAltitudeSx,
  witchBobSx,
  witchCapeSx,
  witchFigureSx,
  witchHatSx,
  witchSilhouetteSx,
  witchTrackSx,
} from "./witchSx";

const VIEW_BOX = "0 0 80 48";
const BRISTLES = "M16 31.5L3 26.5L5 31L1 33.5L5.5 35L2.5 40L16.5 35.5z";
const STICK = "M16 33.5L74 24.5";
const ARM = "M46 20C49 22 52 24.5 55 26";
const CAPE = "M40.5 15.5C35 16.5 28 18 21 17C24 20.5 23 24 19 27C25 27.8 31 26.5 37 24z";
const ROBE = "M36 31C35 25 37 19 41 16C44 14 47 15 48 18C49 22 48 27 50 31z";
const BOOT =
  "M44 30C44 34 45 36.5 47.5 37.5C49 38 50 37.5 50.5 36.6C48.8 36.4 47.4 35.6 46.8 33.8L46.5 30z";
const NOSE = "M47.8 11.6l3.4 1.6l-3.2.7z";
const HAIR = "M42 13C39 14 37 13.5 34.5 15C36.5 15.6 38.8 15.4 41.5 14.6z";
const HAT_BRIM = "M37.5 10.2C41 8.8 49 8.6 53 9.6C49 10.8 41 11.2 37.5 10.2z";
const HAT_CONE = "M41 9.6C41.5 6 40 3 36 .8C40.5 1.5 44.5 4.6 47.5 9.2z";
const HAT_BAND = "M41.2 8.6C43 8.2 45.4 8.2 47 8.5L47.4 9.3C45.6 9 43 9 41.1 9.5z";

interface HalloweenWitchProps {
  spec: HalloweenWitchSpec;
}

export function HalloweenWitch({ spec }: HalloweenWitchProps) {
  return (
    <Box sx={witchTrackSx(spec)}>
      <Box sx={witchAltitudeSx(spec)}>
        <Box sx={witchBobSx()}>
          <Box sx={witchFigureSx()}>
            <Box component="span" sx={witchSilhouetteSx()}>
              <HalloweenGlyphLayer viewBox={VIEW_BOX} sx={witchCapeSx()}>
                <path data-part="cape" d={CAPE} fill="currentColor" />
              </HalloweenGlyphLayer>
              <HalloweenGlyphLayer viewBox={VIEW_BOX}>
                <path
                  data-part="stick"
                  d={STICK}
                  fill="none"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path d={BRISTLES} fill="currentColor" />
                <path data-part="accent" d="M15.2 31.1l2.2-.3l.6 4.6l-2.2.3z" />
                <path d={ROBE} fill="currentColor" />
                <path d={BOOT} fill="currentColor" />
                <path
                  data-part="stick"
                  d={ARM}
                  fill="none"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path d={HAIR} fill="currentColor" />
                <circle cx="45" cy="12" r="3.2" fill="currentColor" />
                <path d={NOSE} fill="currentColor" />
              </HalloweenGlyphLayer>
              <HalloweenGlyphLayer viewBox={VIEW_BOX} sx={witchHatSx()}>
                <g data-part="hat">
                  <path d={HAT_CONE} fill="currentColor" />
                  <path d={HAT_BRIM} fill="currentColor" />
                  <path data-part="accent" d={HAT_BAND} />
                </g>
              </HalloweenGlyphLayer>
            </Box>
            {spec.sparkles.map((sparkle) => (
              <Box key={sparkle.id} sx={sparkleSx(sparkle)} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
