import Box from "@mui/material/Box";
import { squircleClip } from "../../squircle";
import type { CanopLightboxItem } from "./Lightbox";

export interface LightboxMediaProps {
  item: CanopLightboxItem;
}

export function LightboxMedia({ item }: LightboxMediaProps) {
  if (item.kind === "video") {
    return (
      <Box
        component="video"
        src={item.src}
        controls
        playsInline
        preload="metadata"
        aria-label={item.alt ?? item.title ?? undefined}
        sx={{
          ...squircleClip("var(--canop-radius-md)"),
          display: "block",
          maxWidth: "92vw",
          maxHeight: "82dvh",
          backgroundColor: "common.black",
          filter: "var(--canop-drop-shadow-e5)",
        }}
      />
    );
  }

  if (item.kind === "document") {
    return (
      <Box
        component="iframe"
        src={item.src}
        title={item.title ?? item.alt ?? item.src}
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "surface.raised",
          ...squircleClip("var(--canop-radius-md)"),
          border: 0,
          maxWidth: "72rem",
          maxHeight: "82dvh",
        }}
      />
    );
  }

  return (
    <Box
      component="img"
      src={item.src}
      alt={item.alt ?? item.title ?? ""}
      sx={{
        ...squircleClip("var(--canop-radius-md)"),
        display: "block",
        maxWidth: "92vw",
        maxHeight: "82dvh",
        objectFit: "contain",
        filter: "var(--canop-drop-shadow-e5)",
      }}
    />
  );
}
