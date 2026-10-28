import { useState } from "react";
import { Input } from "@canop/ui";
import { searchSuggestion } from "./searchSuggestion";

export interface SearchCompletionDemoProps {
  label: string;
  placeholder: string;
}

export function SearchCompletionDemo({ label, placeholder }: SearchCompletionDemoProps) {
  const [query, setQuery] = useState("");
  return (
    <Input
      label={label}
      placeholder={placeholder}
      value={query}
      onChange={setQuery}
      icon="search"
      completion={searchSuggestion}
    />
  );
}
