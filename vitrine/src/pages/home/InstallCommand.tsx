import Box from "@mui/material/Box";
import { IconActionButton, squircleSurface, tokens } from "@canop/ui";
import { monoFontFamily } from "../../kit/codeStyle";
import { useCopyCode } from "../../kit/useCopyCode";

const INSTALL_COMMAND = "npm i @canop/ui";
const BUTTON_SIZE = "2.25rem";

const surfaceSx = squircleSurface({
  radius: "1.375rem",
  shape: "pill",
  background: "var(--canop-palette-surface-sunken)",
  borderColor: "var(--canop-palette-divider)",
  borderWidth: "0.0625rem",
});

export function InstallCommand() {
  const { label, icon, copyCode } = useCopyCode(INSTALL_COMMAND);

  return (
    <Box
      sx={{
        ...surfaceSx,
        display: "inline-flex",
        alignItems: "center",
        gap: tokens.spacing.sm,
        maxWidth: "100%",
        minWidth: 0,
        paddingBlock: tokens.spacing["2xs"],
        paddingInlineStart: tokens.spacing.md,
        paddingInlineEnd: tokens.spacing["2xs"],
        fontFamily: monoFontFamily,
        fontSize: "0.9375rem",
      }}
    >
      <Box component="span" aria-hidden sx={{ color: "text.disabled", userSelect: "none" }}>
        $
      </Box>
      <Box
        component="code"
        sx={{
          minWidth: 0,
          fontFamily: "inherit",
          color: "text.primary",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {INSTALL_COMMAND}
      </Box>
      <IconActionButton
        icon={icon}
        ariaLabel={label}
        tooltip
        variant="secondary"
        size={BUTTON_SIZE}
        onClick={copyCode}
      />
    </Box>
  );
}
