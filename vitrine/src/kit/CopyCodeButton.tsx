import { Button, Icon } from "@canop/ui";
import { useCopyCode } from "./useCopyCode";

export interface CopyCodeButtonProps {
  code: string;
}

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const { label, icon, copyCode } = useCopyCode(code);

  return (
    <Button
      variant="tonal"
      size="small"
      onClick={copyCode}
      startIcon={<Icon name={icon} size="xs" />}
    >
      {label}
    </Button>
  );
}
