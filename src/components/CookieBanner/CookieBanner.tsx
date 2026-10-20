import Box from "@mui/material/Box";
import Portal from "@mui/material/Portal";
import Stack from "@mui/material/Stack";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "../../i18n";
import { motionDurationSeconds, motionEasing, useReducedMotion } from "../../motion";
import { squircleSurface } from "../../squircle";
import { tokens } from "../../tokens";
import { Button } from "../Button";
import { Heading } from "../Heading";
import { Icon } from "../Icon";
import { Text } from "../Text";
import type { CanopCookieConsent } from "./cookieConsent";
import { useCookieConsent } from "./useCookieConsent";

const MotionBox = motion.create(Box);

export interface CanopCookieBannerProps {
  message: string;

  onDecision?: (consent: CanopCookieConsent) => void;

  storageKey?: string | null;
}

export function CookieBanner({ message, onDecision, storageKey }: CanopCookieBannerProps) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const { decided, accept, decline } = useCookieConsent(storageKey);

  const decide = (consent: CanopCookieConsent) => {
    if (consent === "accepted") accept();
    else decline();
    onDecision?.(consent);
  };

  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: motionDurationSeconds.base, ease: motionEasing.organic };
  const hidden = reducedMotion ? { opacity: 0 } : { opacity: 0, y: "1rem" };
  const shown = { opacity: 1, y: 0 };

  return (
    <Portal>
      <AnimatePresence>
        {!decided && (
          <MotionBox
            key="canop-cookie-banner"
            role="region"
            aria-label={t("canop.cookieBanner.label")}
            initial={hidden}
            animate={shown}
            exit={hidden}
            transition={transition}
            sx={{
              padding: { xs: "1.125rem", md: "1.25rem 1.5rem" },
              ...squircleSurface({
                radius: tokens.radius.lg,
                background: "var(--canop-palette-surface-overlay)",
                shadow: "var(--canop-drop-shadow-e4)",
              }),
              position: "fixed",
              left: 0,
              right: 0,
              bottom: { xs: "1rem", md: "1.5rem" },
              marginInline: "auto",
              width: "min(46rem, calc(100% - 2rem))",
              zIndex: (theme) => theme.zIndex.snackbar,
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 1.75, md: 3 }}
              sx={{
                alignItems: { md: "center" },
              }}
            >
              <Stack
                direction="row"
                spacing={3}
                sx={{
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Box
                  sx={[
                    {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      width: "3.25rem",
                      height: "3.25rem",
                    },
                    squircleSurface({
                      shape: "circle",
                      radius: "1.625rem",
                      background:
                        "color-mix(in srgb, var(--canop-palette-accent-light) 34%, transparent)",
                    }),
                  ]}
                >
                  <Icon name="shield" variant="solid" size="lg" color="accent" />
                </Box>
                <Stack spacing={0.25}>
                  <Heading level={2} size={5} gutterBottom={false}>
                    {t("canop.cookieBanner.title")}
                  </Heading>
                  <Text variant="body-sm" tone="muted">
                    {message}
                  </Text>
                </Stack>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  flexShrink: 0,
                }}
              >
                <Button variant="danger" size="small" onClick={() => decide("declined")}>
                  {t("canop.cookieBanner.decline")}
                </Button>
                <Button variant="primary" size="small" onClick={() => decide("accepted")}>
                  {t("canop.cookieBanner.accept")}
                </Button>
              </Stack>
            </Stack>
          </MotionBox>
        )}
      </AnimatePresence>
    </Portal>
  );
}
