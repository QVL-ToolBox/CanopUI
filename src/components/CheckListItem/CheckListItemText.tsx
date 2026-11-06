import type { ReactNode } from "react";
import { CheckListItemLabel } from "./CheckListItemLabel";
import type { CheckListItemContent } from "./useCheckListItem";

interface CheckListItemTextProps {
  content: CheckListItemContent;
  label: string;
  struck: boolean;
  editor: ReactNode;
}

export function CheckListItemText({ content, label, struck, editor }: CheckListItemTextProps) {
  switch (content) {
    case "editor":
      return editor;
    case "static-label":
      return <CheckListItemLabel label={label} struck={struck} />;
    case "toggle-label":
      return null;
  }
}
