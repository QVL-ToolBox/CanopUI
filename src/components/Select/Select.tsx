import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { FieldLabel } from "../_shared/FieldLabel";
import { useFieldLabelling } from "../_shared/useFieldLabelling";

export interface CanopSelectOption {
  value: string;
  label?: string;
  /**
   * Adornment optionnel (icône, pastille…) affiché avant le libellé — à la fois
   * dans la liste déroulante et sur la valeur sélectionnée.
   */
  icon?: ReactNode;
}

export interface CanopSelectProps {
  options: CanopSelectOption[];
  value: string;
  onChange: (value: string) => void;
  /** Libellé visible au-dessus du champ, et nom accessible par défaut. */
  label?: string;
  /** Nom accessible explicite, pour un champ sans libellé visible. Prend le pas sur `label`. */
  ariaLabel?: string;
  placeholder?: string;
}

const ROW_SX = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  minWidth: 0,
} as const;

/**
 * Sélecteur mono-valeur (une seule option à la fois). Pendant de `MultiSelect`
 * pour les cas où l'utilisateur ne peut choisir qu'une valeur. Chaque option
 * peut porter une icône/pastille optionnelle, rendue dans la liste et sur la
 * valeur sélectionnée.
 */
export function Select({
  options,
  value,
  onChange,
  label,
  ariaLabel,
  placeholder,
}: CanopSelectProps) {
  const { labelId, labelledBy, accessibleName } = useFieldLabelling({ label, ariaLabel });
  const optionOf = (target: string) => options.find((option) => option.value === target);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <FieldLabel id={labelId} label={label} />

      <MuiSelect
        size="small"
        value={value}
        displayEmpty
        labelId={labelledBy}
        inputProps={{ "aria-label": accessibleName }}
        onChange={(event) => onChange(event.target.value as string)}
        renderValue={(selected) => {
          const option = selected ? optionOf(selected as string) : undefined;
          if (!selected) {
            return (
              <Typography
                component="span"
                sx={{
                  color: "text.secondary",
                }}
              >
                {placeholder ?? ""}
              </Typography>
            );
          }
          return (
            <Box component="span" sx={ROW_SX}>
              {option?.icon}
              <Box
                component="span"
                sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {option?.label ?? (selected as string)}
              </Box>
            </Box>
          );
        }}
      >
        {placeholder !== undefined ? (
          <MenuItem value="">
            <Typography
              component="span"
              sx={{
                color: "text.secondary",
              }}
            >
              {placeholder}
            </Typography>
          </MenuItem>
        ) : null}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Box component="span" sx={ROW_SX}>
              {option.icon}
              <span>{option.label ?? option.value}</span>
            </Box>
          </MenuItem>
        ))}
      </MuiSelect>
    </Box>
  );
}
