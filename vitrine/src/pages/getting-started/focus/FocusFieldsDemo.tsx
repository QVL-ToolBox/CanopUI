import { Input, Select, type CanopSelectOption } from "@canop/ui";
import { FocusDemoSurface } from "./FocusDemoSurface";

export interface FocusFieldsLabels {
  group: string;
  name: string;
  fruit: string;
  apple: string;
  pear: string;
  plum: string;
}

export interface FocusFieldsDemoProps {
  labels: FocusFieldsLabels;
  name: string;
  onNameChange: (name: string) => void;
  fruit: string;
  onFruitChange: (fruit: string) => void;
}

export function FocusFieldsDemo({
  labels,
  name,
  onNameChange,
  fruit,
  onFruitChange,
}: FocusFieldsDemoProps) {
  const fruitOptions: CanopSelectOption[] = [
    { value: "apple", label: labels.apple },
    { value: "pear", label: labels.pear },
    { value: "plum", label: labels.plum },
  ];

  return (
    <FocusDemoSurface ariaLabel={labels.group} layout="stacked">
      <Input label={labels.name} value={name} onChange={onNameChange} />
      <Select options={fruitOptions} value={fruit} onChange={onFruitChange} label={labels.fruit} />
    </FocusDemoSurface>
  );
}
