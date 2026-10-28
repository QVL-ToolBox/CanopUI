import Box from "@mui/material/Box";
import { Stack, Text, scrollbarSx } from "@canop/ui";
import { DocTocLink } from "./DocTocLink";
import type { DocTocEntry } from "./useDocToc";

export interface DocTocProps {
  label: string;
  entries: DocTocEntry[];
  activeId: string | undefined;
  onSelect: (id: string) => void;
}

const MIN_ENTRIES = 2;
const STICKY_TOP = "4.5rem";

export function DocToc({ label, entries, activeId, onSelect }: DocTocProps) {
  if (entries.length < MIN_ENTRIES) return null;

  return (
    <Box
      component="nav"
      aria-label={label}
      sx={{
        position: "sticky",
        top: STICKY_TOP,
        maxHeight: `calc(100dvh - 2 * ${STICKY_TOP})`,
        overflowY: "auto",
        ...scrollbarSx("thin"),
      }}
    >
      <Stack gap="sm">
        <Text variant="overline" tone="muted">
          {label}
        </Text>
        <Box
          component="ul"
          sx={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            borderLeft: "0.0625rem solid var(--canop-palette-divider)",
          }}
        >
          {entries.map((entry) => (
            <Box component="li" key={entry.id}>
              <DocTocLink
                title={entry.title}
                active={entry.id === activeId}
                onSelect={() => onSelect(entry.id)}
              />
            </Box>
          ))}
        </Box>
      </Stack>
    </Box>
  );
}
