import Box from "@mui/material/Box";
import { fadeUpSx } from "../../kit/motion";
import { FeatureGrid } from "./FeatureGrid";
import { HomeHero } from "./HomeHero";
import { ReleaseTeaser } from "./ReleaseTeaser";

const HOME_WIDTH = "72rem";

export function HomePage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: "3rem", md: "5rem" },
        width: "100%",
        minWidth: 0,
        maxWidth: HOME_WIDTH,
        marginInline: "auto",
        paddingBottom: { xs: "1rem", md: "2rem" },
      }}
    >
      <HomeHero />
      <FeatureGrid />
      <Box sx={fadeUpSx(240)}>
        <ReleaseTeaser />
      </Box>
    </Box>
  );
}
