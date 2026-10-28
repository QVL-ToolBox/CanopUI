import { Button, DataTable, EmptyState, Icon, type CanopColumn } from "@canop/ui";
import type { EmptyStateTexts } from "./emptyStateTexts";

interface Operation {
  id: string;
  label: string;
  date: string;
  amount: string;
}

const NO_OPERATIONS: Operation[] = [];

export interface EmptyTableDemoProps {
  t: EmptyStateTexts;
}

export function EmptyTableDemo({ t }: EmptyTableDemoProps) {
  const columns: CanopColumn<Operation>[] = [
    { key: "label", header: t.samples.columns.label },
    { key: "date", header: t.samples.columns.date, hideOnMobile: true },
    { key: "amount", header: t.samples.columns.amount, align: "right" },
  ];

  return (
    <DataTable
      columns={columns}
      rows={NO_OPERATIONS}
      getRowKey={(row) => row.id}
      fixedLayout
      emptyMessage={
        <EmptyState
          size="sm"
          surface="plain"
          headingLevel={3}
          icon={<Icon name="wallet" size="md" />}
          title={t.samples.tableTitle}
          description={t.samples.tableDescription}
          action={
            <Button variant="tonal" size="small">
              {t.samples.syncLabel}
            </Button>
          }
        />
      }
    />
  );
}
