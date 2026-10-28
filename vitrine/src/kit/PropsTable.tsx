import Box from "@mui/material/Box";
import { Stack } from "@canop/ui";
import { monoFontFamily } from "./codeStyle";
import { PropsCardList } from "./PropsCardList";
import { PropsDataTable } from "./PropsDataTable";
import type { PropRow } from "./propRow";
import { usePropsTableLayout } from "./usePropsTableLayout";

export type { PropRow } from "./propRow";

export interface PropsTableProps {
  rows: PropRow[];
  title?: string;
}

export function PropsTable({ rows, title }: PropsTableProps) {
  const { compact } = usePropsTableLayout();
  const table = compact ? <PropsCardList rows={rows} /> : <PropsDataTable rows={rows} />;

  if (!title) return table;

  return (
    <Stack gap="xs">
      <Box
        component="h3"
        sx={{
          margin: 0,
          fontFamily: monoFontFamily,
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "text.secondary",
          overflowWrap: "anywhere",
        }}
      >
        {title}
      </Box>
      {table}
    </Stack>
  );
}
