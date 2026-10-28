import { DataTable, type CanopColumn } from "@canop/ui";
import { useDocLocale } from "../i18n/useDocLocale";
import { docKitTexts, type DocKitTexts } from "./docKitTexts";
import { InlineCode } from "./InlineCode";
import { propLabel, type PropRow } from "./propRow";

export interface PropsDataTableProps {
  rows: PropRow[];
}

function buildColumns(texts: DocKitTexts["props"]): CanopColumn<PropRow>[] {
  return [
    {
      key: "name",
      header: texts.name,
      width: "22%",
      render: (row) => <InlineCode>{propLabel(row)}</InlineCode>,
    },
    {
      key: "type",
      header: texts.type,
      width: "30%",
      render: (row) => <InlineCode>{row.type}</InlineCode>,
    },
    {
      key: "defaultValue",
      header: texts.defaultValue,
      width: "16%",
      render: (row) => (row.defaultValue ? <InlineCode>{row.defaultValue}</InlineCode> : "—"),
    },
    {
      key: "description",
      header: texts.description,
    },
  ];
}

function rowKey(row: PropRow): string {
  return row.name;
}

export function PropsDataTable({ rows }: PropsDataTableProps) {
  const columns = buildColumns(docKitTexts[useDocLocale()].props);

  return <DataTable columns={columns} rows={rows} getRowKey={rowKey} fixedLayout />;
}
