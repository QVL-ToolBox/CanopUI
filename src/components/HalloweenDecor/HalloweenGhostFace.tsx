import type { HalloweenExpression } from "./halloweenSceneTypes";

interface HalloweenGhostFaceProps {
  expression: HalloweenExpression;
}

export function HalloweenGhostFace({ expression }: HalloweenGhostFaceProps) {
  switch (expression) {
    case "boo":
      return (
        <>
          <ellipse data-part="eye" cx="10.75" cy="11" rx="1" ry="1.4" />
          <ellipse data-part="eye" cx="15.25" cy="11" rx="1" ry="1.4" />
          <ellipse data-part="eye" cx="13" cy="14.75" rx="0.9" ry="1.2" />
        </>
      );
    case "surprised":
      return (
        <>
          <circle data-part="eye" cx="10.6" cy="10.8" r="1.3" />
          <circle data-part="eye" cx="15.4" cy="10.8" r="1.3" />
          <ellipse data-part="eye" cx="13" cy="15" rx="0.6" ry="0.8" />
        </>
      );
    case "smile":
      return (
        <>
          <ellipse data-part="eye" cx="10.75" cy="11" rx="0.9" ry="1.2" />
          <ellipse data-part="eye" cx="15.25" cy="11" rx="0.9" ry="1.2" />
          <path data-part="line" d="M11.2 14.2c1 1.1 2.6 1.1 3.6 0" strokeWidth="0.8" />
        </>
      );
    case "sleepy":
      return (
        <>
          <path data-part="line" d="M9.8 11.2c.6.6 1.3.6 1.9 0" strokeWidth="0.7" />
          <path data-part="line" d="M14.3 11.2c.6.6 1.3.6 1.9 0" strokeWidth="0.7" />
          <ellipse data-part="eye" cx="13" cy="14.6" rx="0.5" ry="0.6" />
        </>
      );
  }
}
