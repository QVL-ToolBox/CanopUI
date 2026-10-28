import type { HomeFeatureDemo } from "./homeFeatures";
import type { HomeTexts } from "./homeTexts";
import { GlassDemo } from "./demos/GlassDemo";
import { NeonDemo } from "./demos/NeonDemo";
import { SquircleDemo } from "./demos/SquircleDemo";

export interface FeatureDemoProps {
  kind: HomeFeatureDemo;
  texts: HomeTexts["demos"];
}

export function FeatureDemo({ kind, texts }: FeatureDemoProps) {
  switch (kind) {
    case "squircle":
      return <SquircleDemo roundedLabel={texts.rounded} squircleLabel={texts.squircle} />;
    case "glass":
      return <GlassDemo label={texts.glass} />;
    case "neon":
      return <NeonDemo paid={texts.paid} pending={texts.pending} upload={texts.upload} />;
  }
}
