import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { palette, paletteDark, paletteHalloween, paletteHalloweenDark, Stack } from "@canop/ui";
import { squircleClip, tokens } from "@canop/ui";
import { monoFontFamily } from "../../kit/codeStyle";

type PaletteFamily = { main: string; light: string; dark: string; contrastText: string };

export type PaletteSwatchesSource = "light" | "dark" | "halloween" | "halloweenDark";

const sources = {
  light: palette,
  dark: paletteDark,
  halloween: paletteHalloween,
  halloweenDark: paletteHalloweenDark,
} as const;

const familyNames = [
  "primary",
  "secondary",
  "accent",
  "error",
  "warning",
  "info",
  "success",
] as const;

function Swatch({ label, color, textColor }: { label: string; color: string; textColor: string }) {
  return (
    <Box
      sx={[
        {
          flex: "1 1 7rem",
          minWidth: 0,
          overflowWrap: "anywhere",
          padding: "0.75rem",
          bgcolor: color,
          color: textColor,
        },
        squircleClip(tokens.radius.xs),
      ]}
    >
      <Typography
        sx={{
          fontSize: "0.75rem",
          fontWeight: 700,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.7rem",
          fontFamily: monoFontFamily,
          opacity: 0.85,
        }}
      >
        {color}
      </Typography>
    </Box>
  );
}

function RowTitle({ children }: { children: string }) {
  return (
    <Typography
      sx={{
        fontSize: "0.85rem",
        fontWeight: 700,
      }}
    >
      {children}
    </Typography>
  );
}

function FamilyRow({ name, family }: { name: string; family: PaletteFamily }) {
  return (
    <Stack gap="xs">
      <RowTitle>{name}</RowTitle>
      <Stack direction="row" gap="sm" wrap>
        <Swatch label="main" color={family.main} textColor={family.contrastText} />
        <Swatch label="light" color={family.light} textColor={family.contrastText} />
        <Swatch label="dark" color={family.dark} textColor={family.contrastText} />
      </Stack>
    </Stack>
  );
}

function SurfaceRow({ source }: { source: PaletteSwatchesSource }) {
  const { background, surface, text } = sources[source];
  return (
    <Stack gap="xs">
      <RowTitle>background · surface</RowTitle>
      <Stack direction="row" gap="sm" wrap>
        <Swatch label="default" color={background.default} textColor={text.primary} />
        <Swatch label="sunken" color={surface.sunken} textColor={text.primary} />
        <Swatch label="base" color={surface.base} textColor={text.primary} />
        <Swatch label="raised" color={surface.raised} textColor={text.primary} />
        <Swatch label="overlay" color={surface.overlay} textColor={text.secondary} />
      </Stack>
    </Stack>
  );
}

export function PaletteSwatches({ source }: { source: PaletteSwatchesSource }) {
  const families = sources[source];
  return (
    <Stack gap="md">
      {familyNames.map((name) => (
        <FamilyRow key={name} name={name} family={families[name]} />
      ))}
      <SurfaceRow source={source} />
    </Stack>
  );
}
