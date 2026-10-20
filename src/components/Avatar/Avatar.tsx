import Box from "@mui/material/Box";
import { squircleClip } from "../../squircle";
import { tokens } from "../../tokens";
import { Icon } from "../Icon";
import type { CanopAvatarTone } from "./avatarTone";
import { useAvatar, type CanopAvatarSize } from "./useAvatar";

export type { CanopAvatarSize, CanopAvatarTone };

export interface CanopAvatarProps {
  name: string;
  size?: CanopAvatarSize;
}

const avatarShape = squircleClip("50%", { shape: "circle" });

export function Avatar({ name, size = "md" }: CanopAvatarProps) {
  const { label, initials, tone, diameter, fontSize, iconSize, background, foreground } = useAvatar(
    name,
    size,
  );

  return (
    <Box
      component="span"
      role="img"
      aria-label={label}
      data-tone={tone}
      data-size={size}
      sx={{
        ...avatarShape,
        display: "inline-flex",
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        width: diameter,
        height: diameter,
        backgroundColor: background,
        color: foreground,
        fontFamily: tokens.typography.fontFamily,
        fontSize,
        fontWeight: tokens.typography.fontWeight.bold,
        lineHeight: 1,
        letterSpacing: tokens.typography.letterSpacing.none,
        userSelect: "none",
      }}
    >
      {initials ? (
        <span aria-hidden>{initials}</span>
      ) : (
        <Icon name="user" variant="solid" size={iconSize} color="inherit" />
      )}
    </Box>
  );
}
