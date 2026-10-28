import type { Ref } from "react";
import { ghostPart } from "./ghostCompletionSx";
import type { InlineCompletionGhost } from "./inlineCompletionTypes";

export interface GhostCompletionMirrorProps {
  ghost: InlineCompletionGhost;
  inputClassName: string | undefined;
  clipRef: Ref<HTMLSpanElement>;
  trackRef: Ref<HTMLSpanElement>;
}

export function GhostCompletionMirror({
  ghost,
  inputClassName,
  clipRef,
  trackRef,
}: GhostCompletionMirrorProps) {
  return (
    <span aria-hidden className={inputClassName} {...ghostPart("mirror")}>
      <span ref={clipRef} {...ghostPart("clip")}>
        <span ref={trackRef} {...ghostPart("track")}>
          <span {...ghostPart("typed")}>{ghost.typed}</span>
          <span key={ghost.suggestion} ref={ghost.suffixRef} {...ghostPart("suffix")}>
            {ghost.suffix}
          </span>
          <kbd {...ghostPart("hint")}>{ghost.keyHint}</kbd>
        </span>
      </span>
    </span>
  );
}
