import { Input, type CanopInputProps } from "./Input";

export type CanopInputTextProps = Omit<CanopInputProps, "type">;

export function InputText(props: CanopInputTextProps) {
  return <Input type="text" {...props} />;
}
