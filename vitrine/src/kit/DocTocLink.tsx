import Box from "@mui/material/Box";
import { hoverOrKeyboardFocus, withoutFocusRing } from "@canop/ui";

export interface DocTocLinkProps {
  title: string;
  active: boolean;
  onSelect: () => void;
}

const EASE = "var(--canop-motion-duration-fast) var(--canop-motion-ease-standard)";

export function DocTocLink({ title, active, onSelect }: DocTocLinkProps) {
  return (
    <Box
      component="button"
      type="button"
      aria-current={active ? "location" : undefined}
      onClick={onSelect}
      sx={{
        display: "block",
        width: "100%",
        marginLeft: "-0.0625rem",
        padding: "0.375rem 0 0.375rem 0.875rem",
        border: 0,
        borderLeft: "0.125rem solid",
        borderColor: active ? "primary.main" : "transparent",
        background: "none",
        font: "inherit",
        fontSize: "0.875rem",
        lineHeight: 1.45,
        fontWeight: active ? 600 : 400,
        textAlign: "left",
        overflowWrap: "anywhere",
        color: active ? "primary.main" : "text.secondary",
        cursor: "pointer",
        transition: `color ${EASE}, border-color ${EASE}`,
        ...withoutFocusRing,
        [hoverOrKeyboardFocus()]: { color: active ? "primary.main" : "text.primary" },
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      {title}
    </Box>
  );
}
