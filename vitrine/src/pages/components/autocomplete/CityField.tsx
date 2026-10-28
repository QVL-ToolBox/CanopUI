import { useState } from "react";
import { Autocomplete, type CanopAutocompleteProps } from "@canop/ui";
import { VILLES } from "./autocompleteSamples";

export type CityFieldProps = Pick<
  CanopAutocompleteProps,
  "label" | "ariaLabel" | "placeholder" | "size" | "disabled"
> & {
  initialValue?: string;
};

export function CityField({ initialValue = "", ...fieldProps }: CityFieldProps) {
  const [city, setCity] = useState(initialValue);
  return (
    <Autocomplete {...fieldProps} options={VILLES} value={city} onChange={setCity} fullWidth />
  );
}
