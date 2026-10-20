import type { FormEvent } from "react";

export interface UseFormParams {
  onSubmit: () => void | Promise<void>;
}

export interface UseFormResult {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function useForm({ onSubmit }: UseFormParams): UseFormResult {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit();
  }
  return { handleSubmit };
}
