import Box from "@mui/material/Box";
import { CityField } from "./CityField";

export interface CityLayoutsLabels {
  city: string;
  placeholder: string;
  disabled: string;
}

export interface CityLayoutsDemoProps {
  labels: CityLayoutsLabels;
}

export function CityLayoutsDemo({ labels }: CityLayoutsDemoProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" },
        gap: "1rem",
      }}
    >
      <CityField label={labels.city} size="small" />
      <CityField label={labels.city} size="medium" />
      <CityField ariaLabel={labels.placeholder} placeholder={labels.placeholder} size="small" />
      <CityField ariaLabel={labels.placeholder} placeholder={labels.placeholder} size="medium" />
      <CityField label={labels.disabled} size="medium" initialValue="13055" disabled />
    </Box>
  );
}
