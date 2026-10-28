import Box from "@mui/material/Box";
import { HalloweenGlyphLayer } from "./HalloweenGlyphLayer";
import type { HalloweenWebSpec } from "./halloweenSceneTypes";
import { hiddenOnMobileSx } from "./hiddenOnMobileSx";
import { dewSx, webAnchorSx, webSx } from "./spiderSx";
import { spiderWebGeometry } from "./spiderWebGeometry";

interface HalloweenSpiderWebProps {
  spec: HalloweenWebSpec;
  animated: boolean;
}

const { strands, dew: dewDrops } = spiderWebGeometry;

export function HalloweenSpiderWeb({ spec, animated }: HalloweenSpiderWebProps) {
  return (
    <Box sx={[webAnchorSx(spec), spec.hiddenOnMobile && hiddenOnMobileSx]}>
      <Box component="span" sx={webSx(spec, animated)}>
        <HalloweenGlyphLayer viewBox="0 0 100 100">
          {strands.map((strand) => (
            <path
              key={strand.id}
              data-part="strand"
              d={strand.d}
              fill="none"
              strokeWidth="0.45"
              strokeLinecap="round"
            />
          ))}
        </HalloweenGlyphLayer>
        {dewDrops.map((dew, index) => (
          <Box key={dew.id} component="span" sx={dewSx(dew, index, spec, animated)} />
        ))}
      </Box>
    </Box>
  );
}
