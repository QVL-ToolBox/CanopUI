import Box from "@mui/material/Box";
import { fadeUpSx } from "../../kit/motion";
import { BetaSignupCard } from "./BetaSignupCard";
import { HeroIntro } from "./HeroIntro";

export function HomeHero() {
  return (
    <Box
      component="section"
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          md: "minmax(0, 1fr) minmax(0, 24rem)",
          lg: "minmax(0, 1fr) minmax(0, 26rem)",
        },
        alignItems: "center",
        columnGap: { md: "3rem", lg: "4rem" },
        rowGap: "2.5rem",
        minWidth: 0,
        paddingBlock: { xs: "1rem", md: "3rem" },
      }}
    >
      <HeroIntro />
      <Box
        sx={[
          { width: "100%", maxWidth: { xs: "100%", sm: "30rem", md: "none" }, minWidth: 0 },
          fadeUpSx(200),
        ]}
      >
        <BetaSignupCard />
      </Box>
    </Box>
  );
}
