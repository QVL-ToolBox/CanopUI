import { Card, DescriptionList, Stack, Text } from "@canop/ui";
import { useDocLocale } from "../i18n/useDocLocale";
import { docKitTexts } from "./docKitTexts";
import { InlineCode } from "./InlineCode";
import { propLabel, type PropRow } from "./propRow";

export interface PropCardProps {
  row: PropRow;
}

export function PropCard({ row }: PropCardProps) {
  const t = docKitTexts[useDocLocale()].props;

  return (
    <Card elevation="none" density="dense">
      <Stack gap="sm" alignItems="start">
        <InlineCode>{propLabel(row)}</InlineCode>
        <Text variant="body-sm" tone="muted">
          {row.description}
        </Text>
        <DescriptionList
          items={[
            { label: t.type, value: <InlineCode>{row.type}</InlineCode> },
            {
              label: t.defaultValue,
              value: row.defaultValue ? <InlineCode>{row.defaultValue}</InlineCode> : undefined,
            },
          ]}
        />
      </Stack>
    </Card>
  );
}
