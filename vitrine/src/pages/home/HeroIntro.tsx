import Box from "@mui/material/Box";
import { Button, Heading, Icon, Stack, StatusChip, Text } from "@canop/ui";
import { fadeUpSx } from "../../kit/motion";
import { InstallCommand } from "./InstallCommand";
import { useHomeHero } from "./useHomeHero";

const ACTIONS_GRID = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, max-content)" },
  gap: "0.75rem",
} as const;

export function HeroIntro() {
  const { texts, start, explore } = useHomeHero();

  return (
    <Stack gap="lg" alignItems="start">
      <Box sx={fadeUpSx()}>
        <StatusChip tone="success" label={texts.versionChip} />
      </Box>
      <Stack gap="md">
        <Box sx={fadeUpSx(80)}>
          <Heading level={1} size={{ xs: 3, sm: 2, lg: 1 }} gutterBottom={false}>
            {texts.title}
          </Heading>
        </Box>
        <Box sx={fadeUpSx(160)}>
          <Text variant="lead" tone="muted">
            {texts.lead}
          </Text>
        </Box>
      </Stack>
      <Box sx={[ACTIONS_GRID, { width: { xs: "100%", sm: "auto" } }, fadeUpSx(240)]}>
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={start}
          endIcon={<Icon name="arrowRight" size="xs" />}
        >
          {texts.start}
        </Button>
        <Button variant="secondary" size="large" fullWidth onClick={explore}>
          {texts.explore}
        </Button>
      </Box>
      <Stack gap="xs">
        <Box sx={[{ maxWidth: "100%" }, fadeUpSx(320)]}>
          <InstallCommand />
        </Box>
        <Box sx={fadeUpSx(360)}>
          <Text variant="caption" tone="subtle">
            {texts.highlights}
          </Text>
        </Box>
      </Stack>
    </Stack>
  );
}
