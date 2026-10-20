import { Toggle } from "@canop/ui";
import { useVitrineSeason } from "../../../season/VitrineSeasonContext";

export function SeasonSwitch({ label }: { label: string }) {
  const { forcedHalloween, setForcedHalloween } = useVitrineSeason();
  return <Toggle checked={forcedHalloween} onChange={setForcedHalloween} label={label} />;
}
