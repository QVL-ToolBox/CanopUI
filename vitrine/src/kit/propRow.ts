export interface PropRow {
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
  description: string;
}

export function propLabel(row: PropRow): string {
  return row.required ? `${row.name}*` : row.name;
}
