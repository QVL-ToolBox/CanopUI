import Box from "@mui/material/Box";
import type { InputBaseComponentProps } from "@mui/material/InputBase";
import { useForkRef } from "@mui/material/utils";
import type { Ref } from "react";
import { GhostCompletionMirror } from "./GhostCompletionMirror";
import { ghostCompletionFieldSx } from "./ghostCompletionSx";
import { useInlineCompletionGhost } from "./InlineCompletionContext";
import { useGhostScrollSync } from "./useGhostScrollSync";

export type GhostCompletionInputProps = InputBaseComponentProps & {
  ref?: Ref<HTMLInputElement>;
};

export function GhostCompletionInput({ ref, className, ...inputProps }: GhostCompletionInputProps) {
  const ghost = useInlineCompletionGhost();
  const { inputRef, clipRef, trackRef } = useGhostScrollSync(ghost);
  const forkedRef = useForkRef(ref, inputRef);

  return (
    <Box component="span" sx={ghostCompletionFieldSx}>
      <input ref={forkedRef} className={className} {...inputProps} />
      {ghost ? (
        <GhostCompletionMirror
          ghost={ghost}
          inputClassName={className}
          clipRef={clipRef}
          trackRef={trackRef}
        />
      ) : null}
    </Box>
  );
}
