import { HalloweenCauldron } from "./HalloweenCauldron";
import { HalloweenFirefly } from "./HalloweenFirefly";
import { HalloweenFogBank } from "./HalloweenFogBank";
import { HalloweenGhost } from "./HalloweenGhost";
import { HalloweenGraveyard } from "./HalloweenGraveyard";
import { HalloweenLeaf } from "./HalloweenLeaf";
import { HalloweenPumpkin } from "./HalloweenPumpkin";
import type { HalloweenScene } from "./halloweenSceneTypes";

interface HalloweenForegroundProps {
  scene: HalloweenScene;
  animated: boolean;
}

export function HalloweenForeground({ scene, animated }: HalloweenForegroundProps) {
  return (
    <>
      <HalloweenFogBank depth="near" animated={animated} />
      {scene.cauldron ? <HalloweenCauldron animated={animated} /> : null}
      <HalloweenGraveyard ghost={scene.graveGhost} animated={animated} />
      {scene.pumpkins.map((spec) => (
        <HalloweenPumpkin key={spec.id} spec={spec} animated={animated} />
      ))}
      {scene.ghosts.near.map((spec) => (
        <HalloweenGhost key={spec.id} spec={spec} animated={animated} />
      ))}
      {scene.ghosts.ground.map((spec) => (
        <HalloweenGhost key={spec.id} spec={spec} animated={animated} />
      ))}
      {scene.leaves.map((spec) => (
        <HalloweenLeaf key={spec.id} spec={spec} animated={animated} />
      ))}
      {scene.fireflies.map((spec) => (
        <HalloweenFirefly key={spec.id} spec={spec} animated={animated} />
      ))}
    </>
  );
}
