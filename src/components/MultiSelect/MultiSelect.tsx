import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { isValidElement, type ReactNode } from "react";
import { Icon } from "../Icon";
import { FieldLabel } from "../_shared/FieldLabel";
import { useFieldLabelling } from "../_shared/useFieldLabelling";
import type { CanopSelectOption } from "../Select";

/**
 * Même forme d'option que `CanopSelectOption` : les deux sélecteurs décrivent le
 * même concept et partagent donc les mêmes capacités, icône comprise.
 */
export type CanopMultiSelectOption = CanopSelectOption;

export interface CanopMultiSelectProps {
  options: CanopMultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  /** Libellé visible au-dessus du champ, et nom accessible par défaut. */
  label?: string;
  /** Nom accessible explicite, pour un champ sans libellé visible. Prend le pas sur `label`. */
  ariaLabel?: string;
  placeholder?: string;
}

const CHIP_INSET_ALIGNED_WITH_TEXT = "0.75rem";
const CHIP_GAP_COMPENSATION = "-0.25rem";

const CHIP_SX = {
  backgroundColor: "primary.main",
  color: "primary.contrastText",
  "& .MuiChip-icon": {
    color: "primary.contrastText",
    marginLeft: CHIP_INSET_ALIGNED_WITH_TEXT,
    marginRight: CHIP_GAP_COMPENSATION,
  },
  "& .MuiChip-deleteIcon": {
    color: "primary.contrastText",
    marginRight: CHIP_INSET_ALIGNED_WITH_TEXT,
    marginLeft: CHIP_GAP_COMPENSATION,
    "&:hover": { color: "primary.contrastText", opacity: 0.8 },
  },
} as const;

function elementIcon(icon: ReactNode) {
  return isValidElement(icon) ? icon : undefined;
}

export function MultiSelect({
  options,
  value,
  onChange,
  label,
  ariaLabel,
  placeholder,
}: CanopMultiSelectProps) {
  const { labelId, labelledBy, accessibleName } = useFieldLabelling({ label, ariaLabel });
  const available = options.filter((option) => !value.includes(option.value));
  const optionOf = (target: string) => options.find((option) => option.value === target);

  const add = (next: string) => {
    if (next && !value.includes(next)) onChange([...value, next]);
  };
  const remove = (target: string) => onChange(value.filter((item) => item !== target));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <FieldLabel id={labelId} label={label} />

      {value.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {value.map((item) => {
            const option = optionOf(item);
            return (
              <Chip
                key={item}
                icon={elementIcon(option?.icon)}
                label={option?.label ?? item}
                onDelete={() => remove(item)}
                sx={CHIP_SX}
              />
            );
          })}
        </Box>
      ) : null}

      <MuiSelect
        size="small"
        value=""
        displayEmpty
        labelId={labelledBy}
        inputProps={{ "aria-label": accessibleName }}
        onChange={(event) => add(event.target.value as string)}
        renderValue={() => (
          <Typography
            component="span"
            sx={{
              color: "text.secondary",
            }}
          >
            {placeholder ?? ""}
          </Typography>
        )}
      >
        {available.length === 0 ? (
          <MenuItem value="" disabled>
            {placeholder ?? ""}
          </MenuItem>
        ) : (
          available.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: "0.5rem",
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    minWidth: 0,
                  }}
                >
                  {option.icon}
                  <span>{option.label ?? option.value}</span>
                </Box>
                <Icon name="plus" size="xs" />
              </Box>
            </MenuItem>
          ))
        )}
      </MuiSelect>
    </Box>
  );
}
