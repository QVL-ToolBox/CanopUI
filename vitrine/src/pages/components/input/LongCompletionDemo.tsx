import Box from "@mui/material/Box";
import { useState } from "react";
import { Input } from "@canop/ui";
import { LONG_SENTENCE_START, LONG_SENTENCES } from "./completionSamples";

export interface LongCompletionDemoProps {
  label: string;
}

export function LongCompletionDemo({ label }: LongCompletionDemoProps) {
  const [sentence, setSentence] = useState(LONG_SENTENCE_START);
  return (
    <Box sx={{ width: "100%", maxWidth: "18rem" }}>
      <Input
        label={label}
        value={sentence}
        onChange={setSentence}
        icon="mapLocation"
        completion={LONG_SENTENCES}
      />
    </Box>
  );
}
