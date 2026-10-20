import Typography from "@mui/material/Typography";

export interface FieldLabelProps {
  id: string;
  label?: string;
}

export function FieldLabel({ id, label }: FieldLabelProps) {
  if (!label) return null;

  return (
    <Typography
      id={id}
      variant="body2"
      sx={{
        color: "text.secondary",
      }}
    >
      {label}
    </Typography>
  );
}
