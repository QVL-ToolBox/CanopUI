import { useState } from "react";
import { Autocomplete, Stack } from "@canop/ui";
import { DEPARTEMENTS } from "./autocompleteSamples";
import { RetainedValue } from "./RetainedValue";

export interface DepartementDemoProps {
  label: string;
}

export function DepartementDemo({ label }: DepartementDemoProps) {
  const [code, setCode] = useState("");

  return (
    <Stack gap="md" alignItems="start">
      <Autocomplete
        options={DEPARTEMENTS}
        value={code}
        onChange={setCode}
        label={label}
        fullWidth
      />
      <RetainedValue value={code} />
    </Stack>
  );
}
