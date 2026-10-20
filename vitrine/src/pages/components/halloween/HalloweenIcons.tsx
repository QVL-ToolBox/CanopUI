import { Icon, Stack, type CanopIconName } from "@canop/ui";

const halloweenIconNames: CanopIconName[] = ["ghost", "pumpkin", "bat"];

export function HalloweenIcons() {
  return (
    <Stack direction="row" gap="lg" alignItems="center" wrap>
      {halloweenIconNames.map((name) => (
        <Stack key={name} direction="row" gap="sm" alignItems="center">
          <Icon name={name} size="xl" color="primary" title={name} />
          <Icon name={name} variant="solid" size="xl" color="secondary" title={`${name} solid`} />
        </Stack>
      ))}
    </Stack>
  );
}
