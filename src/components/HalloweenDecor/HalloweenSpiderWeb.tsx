import Box from "@mui/material/Box";
import type { HalloweenWebSpec } from "./halloweenSceneTypes";
import { hiddenOnMobileSx } from "./hiddenOnMobileSx";
import { webAnchorSx, webSx } from "./spiderSx";
import { spiderWebGeometry } from "./spiderWebGeometry";

interface HalloweenSpiderWebProps {
  spec: HalloweenWebSpec;
  animated: boolean;
}

const { strands, dew } = spiderWebGeometry;

export function HalloweenSpiderWeb({ spec, animated }: HalloweenSpiderWebProps) {
  return (
    <Box sx={[webAnchorSx(spec), spec.hiddenOnMobile && hiddenOnMobileSx]}>
      <Box component="svg" viewBox="0 0 100 100" sx={webSx(spec, animated)}>
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
        {dew.map((drop) => (
          <circle key={drop.id} data-part="dew" cx={drop.cx} cy={drop.cy} r="0.9" />
        ))}
      </Box>
    </Box>
  );
}
