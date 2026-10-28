import Box from "@mui/material/Box";
import { PropCard } from "./PropCard";
import type { PropRow } from "./propRow";

export interface PropsCardListProps {
  rows: PropRow[];
}

export function PropsCardList({ rows }: PropsCardListProps) {
  return (
    <Box
      component="ul"
      sx={{
        margin: 0,
        padding: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        minWidth: 0,
      }}
    >
      {rows.map((row) => (
        <Box component="li" key={row.name} sx={{ minWidth: 0 }}>
          <PropCard row={row} />
        </Box>
      ))}
    </Box>
  );
}
