import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Button, Stack } from "@canop/ui";
import { useDocLocale } from "../i18n/useDocLocale";
import { useLiveDemoGate } from "./useLiveDemoGate";

const labels = {
  fr: {
    show: "Activer la démo live",
    hide: "Désactiver la démo live",
    note: "Ce composant se positionne par rapport à la fenêtre : la démo ne se monte que lorsqu'elle est activée.",
  },
  en: {
    show: "Enable live demo",
    hide: "Disable live demo",
    note: "This component positions itself relative to the window: the demo only mounts while enabled.",
  },
};

export interface LiveDemoGateProps {
  children: ReactNode;
}

export function LiveDemoGate({ children }: LiveDemoGateProps) {
  const { active, toggle } = useLiveDemoGate();
  const t = labels[useDocLocale()];

  return (
    <Stack gap="sm" alignItems="start">
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: "0.9rem",
        }}
      >
        {t.note}
      </Typography>
      <Button variant="secondary" size="small" onClick={toggle}>
        {active ? t.hide : t.show}
      </Button>
      {active ? children : null}
    </Stack>
  );
}
