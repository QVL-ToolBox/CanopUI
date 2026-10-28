import { Avatar, Card, Stack, Text } from "@canop/ui";
import type { AutoSkeletonTexts } from "./autoSkeletonTexts";

interface AccountsListProps {
  accounts: AutoSkeletonTexts["sample"]["accounts"];
}

export function AccountsList({ accounts }: AccountsListProps) {
  return (
    <Stack gap="sm">
      {accounts.map((account) => (
        <Card key={account.id} density="dense" elevation="sm">
          <Stack direction="row" gap="sm" alignItems="center">
            <Avatar name={account.name} />
            <Stack gap="xs">
              <Text variant="label">{account.name}</Text>
              <Text variant="body-sm" tone="muted">
                {account.detail}
              </Text>
            </Stack>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
