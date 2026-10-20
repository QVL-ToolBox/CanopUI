import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { DataTable, squircleClip, tokens, type CanopColumn } from "@canop/ui";
import { monoFontFamily } from "./CodeBlock";
import { useDocLocale, type DocLocale } from "../i18n/useDocLocale";

const headers = {
  fr: { name: "Nom", type: "Type", defaultValue: "Défaut", description: "Description" },
  en: { name: "Name", type: "Type", defaultValue: "Default", description: "Description" },
};

export interface PropRow {
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
  description: string;
}

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <Box
      component="code"
      sx={{
        padding: "0.125rem 0.4rem",
        ...squircleClip(tokens.radius.xs),
        display: "inline-block",
        fontFamily: monoFontFamily,
        fontSize: "0.8rem",

        backgroundColor:
          "color-mix(in srgb, var(--canop-palette-secondary-light) 22%, var(--canop-palette-background-paper))",

        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Box>
  );
}

function buildColumns(locale: DocLocale): CanopColumn<PropRow>[] {
  const t = headers[locale];
  return [
    {
      key: "name",
      header: t.name,
      render: (row) => (
        <InlineCode>
          {row.name}
          {row.required ? "*" : ""}
        </InlineCode>
      ),
    },
    {
      key: "type",
      header: t.type,
      render: (row) => <InlineCode>{row.type}</InlineCode>,
    },
    {
      key: "defaultValue",
      header: t.defaultValue,
      hideOnMobile: true,
      render: (row) => (row.defaultValue ? <InlineCode>{row.defaultValue}</InlineCode> : "—"),
    },
    {
      key: "description",
      header: t.description,
    },
  ];
}

export interface PropsTableProps {
  rows: PropRow[];
  /**
   * Ce que la table décrit : un composant, les options d'un hook, ce qu'il
   * renvoie. Indispensable dès qu'une page en empile plusieurs — sans lui,
   * rien ne dit laquelle appartient à quoi.
   */
  title?: string;
}

export function PropsTable({ rows, title }: PropsTableProps) {
  const locale = useDocLocale();
  const table = (
    <DataTable columns={buildColumns(locale)} rows={rows} getRowKey={(row) => row.name} />
  );

  if (!title) return table;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Box
        component="h4"
        sx={{
          margin: 0,
          fontFamily: monoFontFamily,
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "text.secondary",
        }}
      >
        {title}
      </Box>
      {table}
    </Box>
  );
}
