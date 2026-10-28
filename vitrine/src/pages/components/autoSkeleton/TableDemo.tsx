import { DataTable, type CanopColumn } from "@canop/ui";
import type { AutoSkeletonTexts } from "./autoSkeletonTexts";

interface Operation {
  id: string;
  label: string;
  date: string;
  amount: string;
}

const OPERATIONS: Operation[] = [
  { id: "1", label: "Boulangerie du Chêne", date: "24/10", amount: "-4,20 €" },
  { id: "2", label: "Salaire octobre", date: "23/10", amount: "+2 310,00 €" },
  { id: "3", label: "Librairie Sève", date: "21/10", amount: "-18,90 €" },
  { id: "4", label: "Abonnement énergie", date: "20/10", amount: "-64,00 €" },
];

interface TableDemoProps {
  loading: boolean;
  skeleton?: boolean;
  t: AutoSkeletonTexts["sample"]["columns"];
}

export function TableDemo({ loading, skeleton, t }: TableDemoProps) {
  const columns: CanopColumn<Operation>[] = [
    { key: "label", header: t.label },
    { key: "date", header: t.date, hideOnMobile: true },
    { key: "amount", header: t.amount, align: "right" },
  ];

  return (
    <DataTable
      columns={columns}
      rows={loading ? [] : OPERATIONS}
      getRowKey={(row) => row.id}
      loading={loading}
      skeleton={skeleton}
      animated
      fixedLayout
    />
  );
}
