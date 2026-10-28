import { Heading, Stack, Text } from "@canop/ui";
import { CodeBlock } from "./CodeBlock";

export interface CodeExampleProps {
  title: string;
  description?: string;
  code: string;
}

export function CodeExample({ title, description, code }: CodeExampleProps) {
  return (
    <Stack gap="sm">
      <Heading level={3} size={{ xs: 6, md: 5 }} gutterBottom={false}>
        {title}
      </Heading>
      {description ? <Text tone="muted">{description}</Text> : null}
      <CodeBlock code={code} />
    </Stack>
  );
}
