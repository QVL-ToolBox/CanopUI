import { useState } from "react";

export interface UseCanopyVariantResult<T extends string> {
  value: T;
  setValue: (value: T) => void;
}

export function useCanopyVariant<T extends string>(initial: T): UseCanopyVariantResult<T> {
  const [value, setValue] = useState<T>(initial);
  return { value, setValue };
}
