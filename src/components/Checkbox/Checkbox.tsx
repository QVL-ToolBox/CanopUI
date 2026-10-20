import Box from "@mui/material/Box";
import MuiCheckbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { useId, type MouseEvent, type ReactNode } from "react";
import { SquircleCheckboxIcon } from "./SquircleCheckboxIcon";

export interface CanopCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  sublabel?: ReactNode;
  disabled?: boolean;
  size?: "small" | "medium";
  required?: boolean;
  error?: string | null;
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.closest("a, button") !== null;
}

export function Checkbox({
  checked,
  onChange,
  label,
  sublabel,
  disabled = false,
  size = "medium",
  required = false,
  error = null,
}: CanopCheckboxProps) {
  const helperTextId = useId();
  const controlId = useId();
  const hasError = Boolean(error);

  const control = (
    <MuiCheckbox
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      disabled={disabled}
      size={size}
      color="primary"
      required={required}
      icon={<SquircleCheckboxIcon state="empty" />}
      checkedIcon={<SquircleCheckboxIcon state="checked" />}
      indeterminateIcon={<SquircleCheckboxIcon state="indeterminate" />}
      slotProps={{
        input: {
          id: controlId,
          "aria-invalid": hasError || undefined,
          "aria-describedby": hasError ? helperTextId : undefined,
        },
      }}
    />
  );

  if (!label && !hasError) {
    return control;
  }

  const keepInteractiveClicksFromToggling = (event: MouseEvent<HTMLSpanElement>) => {
    if (isInteractiveTarget(event.target)) {
      event.stopPropagation();
    }
  };

  if (sublabel) {
    return (
      <FormControl error={hasError} disabled={disabled} required={required}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            alignItems: "center",
            columnGap: "0.25rem",
            "& .MuiCheckbox-root": { paddingTop: "0.125rem", paddingBottom: "0.125rem" },
          }}
        >
          {control}
          <Box
            component="label"
            htmlFor={controlId}
            sx={{ cursor: disabled ? "default" : "pointer" }}
          >
            {label}
          </Box>
          <Box sx={{ gridColumn: "1 / -1", paddingLeft: "0.5rem" }}>
            {sublabel}
            {required ? (
              <Box
                component="span"
                aria-hidden
                sx={{
                  color: hasError ? "error.main" : "inherit",
                }}
              >
                {" *"}
              </Box>
            ) : null}
          </Box>
        </Box>
        {hasError ? <FormHelperText id={helperTextId}>{error}</FormHelperText> : null}
      </FormControl>
    );
  }

  return (
    <FormControl error={hasError} disabled={disabled} required={required}>
      {label ? (
        <FormControlLabel
          control={control}
          disabled={disabled}
          label={<span onClick={keepInteractiveClicksFromToggling}>{label}</span>}
        />
      ) : (
        control
      )}
      {hasError ? <FormHelperText id={helperTextId}>{error}</FormHelperText> : null}
    </FormControl>
  );
}
