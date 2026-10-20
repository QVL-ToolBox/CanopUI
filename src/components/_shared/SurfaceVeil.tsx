import Box from "@mui/material/Box";

export interface SurfaceVeilProps {
  opacity: number;
}

export function SurfaceVeil({ opacity }: SurfaceVeilProps) {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        backgroundColor: "background.default",
        opacity,
      }}
    />
  );
}
