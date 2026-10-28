import type { CSSObject } from "@mui/material/styles";
import { PAGE_BOTTOM_INSET_VAR } from "./pageBottomInset";
import { PAGE_TOP_RIGHT_INSET_VAR } from "./pageTopRightInset";

export function resetPageInsets(): CSSObject {
  return { [PAGE_TOP_RIGHT_INSET_VAR]: "0rem", [PAGE_BOTTOM_INSET_VAR]: "0rem" };
}
