import { useState } from "react";

export interface NotchFieldSetState {
  empty: string;
  setEmpty: (value: string) => void;
  filled: string;
  setFilled: (value: string) => void;
  longLabelled: string;
  setLongLabelled: (value: string) => void;
  invalid: string;
  setInvalid: (value: string) => void;
}

export function useNotchFieldSet(filledValue: string, invalidValue: string): NotchFieldSetState {
  const [empty, setEmpty] = useState("");
  const [filled, setFilled] = useState(filledValue);
  const [longLabelled, setLongLabelled] = useState(filledValue);
  const [invalid, setInvalid] = useState(invalidValue);
  return {
    empty,
    setEmpty,
    filled,
    setFilled,
    longLabelled,
    setLongLabelled,
    invalid,
    setInvalid,
  };
}
