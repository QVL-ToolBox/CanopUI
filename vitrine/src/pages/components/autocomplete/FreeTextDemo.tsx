import { useState } from "react";
import { Autocomplete, Stack } from "@canop/ui";
import { DEPARTEMENTS } from "./autocompleteSamples";
import { RetainedValue } from "./RetainedValue";

export interface FreeTextDemoProps {
  labels: { strict: string; free: string };
}

export function FreeTextDemo({ labels }: FreeTextDemoProps) {
  const [strict, setStrict] = useState("");
  const [free, setFree] = useState("");

  return (
    <Stack gap="lg" alignItems="stretch">
      <Stack gap="sm" alignItems="start">
        <Autocomplete
          options={DEPARTEMENTS}
          value={strict}
          onChange={setStrict}
          label={labels.strict}
          fullWidth
        />
        <RetainedValue value={strict} />
      </Stack>
      <Stack gap="sm" alignItems="start">
        <Autocomplete
          options={DEPARTEMENTS}
          value={free}
          onChange={setFree}
          allowFreeText
          label={labels.free}
          fullWidth
        />
        <RetainedValue value={free} />
      </Stack>
    </Stack>
  );
}
