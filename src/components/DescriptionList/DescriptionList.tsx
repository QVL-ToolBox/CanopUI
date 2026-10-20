import Box from "@mui/material/Box";
import { Fragment, type ReactNode } from "react";
import { tokens } from "../../tokens";

export interface CanopDescriptionItem {
  label: string;

  value?: ReactNode;
}

export interface CanopDescriptionListProps {
  items: CanopDescriptionItem[];
}

function renderValue(value: ReactNode) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return value;
}

export function DescriptionList({ items }: CanopDescriptionListProps) {
  return (
    <Box
      component="dl"
      sx={{
        margin: 0,
        "& dt": {
          fontWeight: tokens.typography.fontWeight.semibold,
          marginTop: tokens.spacing.sm,
        },
        "& dt:first-of-type": {
          marginTop: 0,
        },
        "& dd": {
          margin: `${tokens.spacing.xs} 0 0`,
        },
        "& dd ul": {
          margin: 0,
          paddingLeft: tokens.spacing.lg,
        },
      }}
    >
      {items.map(({ label, value }) => (
        <Fragment key={label}>
          <dt>{label}</dt>
          <dd>{renderValue(value)}</dd>
        </Fragment>
      ))}
    </Box>
  );
}
