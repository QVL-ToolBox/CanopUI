import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Link, Stack, Text, squircleClip, tokens } from "@canop/ui";
import { InlineCode } from "../kit/InlineCode";
import type { ChangelogBlock, ChangelogInline } from "./parseChangelog";

function InlineRun({ content }: { content: ChangelogInline[] }) {
  return (
    <>
      {content.map((part, index) => {
        if (part.kind === "code") {
          return <InlineCode key={index}>{part.value}</InlineCode>;
        }
        if (part.kind === "strong") {
          return (
            <Box
              key={index}
              component="strong"
              sx={{
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              {part.value}
            </Box>
          );
        }
        if (part.kind === "link") {
          return part.href.startsWith("http") ? (
            <Link key={index} href={part.href} size="small">
              {part.value}
            </Link>
          ) : (
            <InlineCode key={index}>{part.value}</InlineCode>
          );
        }
        return (
          <Box key={index} component="span">
            {part.value}
          </Box>
        );
      })}
    </>
  );
}

function ChangelogTable({
  head,
  rows,
}: {
  head: ChangelogInline[][];
  rows: ChangelogInline[][][];
}) {
  return (
    <Box
      sx={{
        ...squircleClip(tokens.radius.sm),
        border: "0.0625rem solid",
        borderColor: "divider",
        overflowX: "auto",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            {head.map((cell, index) => (
              <TableCell key={index} sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                <InlineRun content={cell} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} sx={{ color: "text.secondary", borderBottom: "none" }}>
                  <InlineRun content={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

function ChangelogQuote({ blocks }: { blocks: ChangelogBlock[] }) {
  return (
    <Box
      sx={{
        paddingLeft: "1rem",
        borderLeft: "0.1875rem solid",
        borderColor: "accent.main",
        fontStyle: "italic",
      }}
    >
      <ChangelogBlocks blocks={blocks} />
    </Box>
  );
}

function ChangelogListItem({ blocks }: { blocks: ChangelogBlock[] }) {
  const single = blocks.length === 1 && blocks[0].kind === "paragraph" ? blocks[0] : undefined;
  return (
    <Box
      component="li"
      sx={{
        paddingLeft: "0.25rem",
        "&::marker": { color: "text.disabled" },
      }}
    >
      {single ? (
        <Text variant="body-md" tone="muted" as="span">
          <InlineRun content={single.content} />
        </Text>
      ) : (
        <Stack gap="sm">
          <ChangelogBlocks blocks={blocks} />
        </Stack>
      )}
    </Box>
  );
}

function ChangelogList({ ordered, items }: { ordered: boolean; items: ChangelogBlock[][] }) {
  return (
    <Box
      component={ordered ? "ol" : "ul"}
      sx={{
        margin: 0,
        paddingLeft: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.625rem",
      }}
    >
      {items.map((item, index) => (
        <ChangelogListItem key={index} blocks={item} />
      ))}
    </Box>
  );
}

export interface ChangelogBlocksProps {
  blocks: ChangelogBlock[];
}

export function ChangelogBlocks({ blocks }: ChangelogBlocksProps) {
  return (
    <Stack gap="sm">
      {blocks.map((block, index) => {
        if (block.kind === "paragraph") {
          return (
            <Text key={index} variant="body-md" tone="muted">
              <InlineRun content={block.content} />
            </Text>
          );
        }
        if (block.kind === "quote") {
          return <ChangelogQuote key={index} blocks={block.blocks} />;
        }
        if (block.kind === "table") {
          return <ChangelogTable key={index} head={block.head} rows={block.rows} />;
        }
        return <ChangelogList key={index} ordered={block.ordered} items={block.items} />;
      })}
    </Stack>
  );
}
