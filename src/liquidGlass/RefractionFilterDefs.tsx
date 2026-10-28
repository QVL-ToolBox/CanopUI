import Box from "@mui/material/Box";
import type { CanopRefractionFilter } from "./useRefractionFilter";

export interface RefractionFilterDefsProps {
  filter: CanopRefractionFilter;
}

const LENS = "lens";

const CHANNEL_ONLY = {
  red: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
  green: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
  blue: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
} as const;

type Channel = keyof typeof CHANNEL_ONLY;

interface ShiftedChannelProps {
  channel: Channel;
  scale: number;
}

function ShiftedChannel({ channel, scale }: ShiftedChannelProps) {
  return (
    <>
      <feDisplacementMap
        in="SourceGraphic"
        in2={LENS}
        scale={scale}
        xChannelSelector="R"
        yChannelSelector="G"
        result={`${channel}-shift`}
      />
      <feColorMatrix
        in={`${channel}-shift`}
        type="matrix"
        values={CHANNEL_ONLY[channel]}
        result={channel}
      />
    </>
  );
}

function DispersedDisplacement({ displacement, dispersion }: CanopRefractionFilter) {
  return (
    <>
      <ShiftedChannel channel="red" scale={displacement} />
      <ShiftedChannel channel="green" scale={displacement * (1 - dispersion / 2)} />
      <ShiftedChannel channel="blue" scale={displacement * (1 - dispersion)} />
      <feBlend in="red" in2="green" mode="screen" result="red-green" />
      <feBlend in="red-green" in2="blue" mode="screen" />
    </>
  );
}

export function RefractionFilterDefs({ filter }: RefractionFilterDefsProps) {
  return (
    <Box
      component="svg"
      aria-hidden
      sx={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <filter
        id={filter.id}
        x="0"
        y="0"
        width="100%"
        height="100%"
        colorInterpolationFilters="sRGB"
      >
        <feImage
          href={filter.map}
          x="0"
          y="0"
          width={filter.width}
          height={filter.height}
          preserveAspectRatio="none"
          result={LENS}
        />
        {filter.dispersion > 0 ? (
          <DispersedDisplacement {...filter} />
        ) : (
          <feDisplacementMap
            in="SourceGraphic"
            in2={LENS}
            scale={filter.displacement}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        )}
      </filter>
    </Box>
  );
}
