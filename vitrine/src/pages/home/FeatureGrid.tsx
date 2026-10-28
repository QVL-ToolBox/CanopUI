import { BentoGrid, BentoTile, Heading, Presence, Stack, Text } from "@canop/ui";
import { FeatureDemo } from "./FeatureDemo";
import { FeatureTile } from "./FeatureTile";
import { useFeatureGrid } from "./useFeatureGrid";

const STAGGER_SECONDS = 0.06;

export function FeatureGrid() {
  const { texts, demoTexts, features } = useFeatureGrid();

  return (
    <Stack as="section" gap="lg">
      <Stack gap="xs" alignItems="center">
        <Text variant="overline" weight="bold" tone="accent" align="center">
          {texts.overline}
        </Text>
        <Heading level={2} size={{ xs: 4, md: 3 }} align="center" gutterBottom={false}>
          {texts.title}
        </Heading>
        <Text tone="muted" align="center">
          {texts.intro}
        </Text>
      </Stack>
      <BentoGrid columns={{ sm: 2, md: 3 }} gap="md">
        <Presence stagger={STAGGER_SECONDS} appear>
          {features.map((feature) => (
            <BentoTile key={feature.id} span={feature.span}>
              <FeatureTile
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                href={feature.href}
                demo={
                  feature.demo ? <FeatureDemo kind={feature.demo} texts={demoTexts} /> : undefined
                }
              />
            </BentoTile>
          ))}
        </Presence>
      </BentoGrid>
    </Stack>
  );
}
