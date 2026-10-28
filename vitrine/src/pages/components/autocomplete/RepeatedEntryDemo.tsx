import { useState } from "react";
import { Autocomplete, Stack, StatusChip, Text } from "@canop/ui";
import { DEPARTEMENTS, labelOfDepartement } from "./autocompleteSamples";

export interface RepeatedEntryDemoProps {
  labels: { field: string; none: string };
}

export function RepeatedEntryDemo({ labels }: RepeatedEntryDemoProps) {
  const [guesses, setGuesses] = useState<string[]>([]);

  return (
    <Stack gap="md" alignItems="start">
      <Autocomplete
        options={DEPARTEMENTS.filter((option) => !guesses.includes(option.value))}
        value=""
        onChange={(code) => setGuesses((current) => [...current, code])}
        clearOnSelect
        label={labels.field}
        fullWidth
      />
      <Stack direction="row" gap="xs" wrap>
        {guesses.length === 0 ? (
          <Text variant="body-sm" tone="muted">
            {labels.none}
          </Text>
        ) : (
          guesses.map((code) => (
            <StatusChip key={code} tone="info" label={`${labelOfDepartement(code)} (${code})`} />
          ))
        )}
      </Stack>
    </Stack>
  );
}
