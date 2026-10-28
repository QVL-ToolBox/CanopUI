import Box from "@mui/material/Box";
import { DataTable, Heading, Stack, squircleClip, tokens, type CanopColumn } from "@canop/ui";
import { inlineCodeSurface, monoFontFamily } from "../../../kit/codeStyle";
import { keyAlternatives } from "./keyAlternatives";

export interface CompletionShortcut {
  keys: string;
  effect: string;
}

export interface CompletionShortcutsTableProps {
  title: string;
  headers: CompletionShortcut;
  rows: CompletionShortcut[];
}

const KEYS_COLUMN_WIDTH = "40%";

function KeyCaps({ keys }: { keys: string }) {
  return (
    <Stack direction="row" gap="xs" wrap>
      {keyAlternatives(keys).map((alternative) => (
        <Box
          key={alternative}
          component="kbd"
          sx={{
            ...squircleClip(tokens.radius.xs),
            display: "inline-block",
            maxWidth: "100%",
            paddingInline: "0.5rem",
            paddingBlock: "0.125rem",
            fontFamily: monoFontFamily,
            fontSize: "0.8rem",
            overflowWrap: "anywhere",
            backgroundColor: inlineCodeSurface,
          }}
        >
          {alternative}
        </Box>
      ))}
    </Stack>
  );
}

export function CompletionShortcutsTable({ title, headers, rows }: CompletionShortcutsTableProps) {
  const columns: CanopColumn<CompletionShortcut>[] = [
    {
      key: "keys",
      header: headers.keys,
      width: KEYS_COLUMN_WIDTH,
      render: (row) => <KeyCaps keys={row.keys} />,
    },
    { key: "effect", header: headers.effect },
  ];
  return (
    <Stack gap="sm">
      <Heading level={3} size={5} gutterBottom={false}>
        {title}
      </Heading>
      <DataTable columns={columns} rows={rows} getRowKey={(row) => row.keys} fixedLayout />
    </Stack>
  );
}
