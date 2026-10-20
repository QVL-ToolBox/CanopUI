import { HalloweenBat } from "./HalloweenBat";
import { HalloweenBatSwarm } from "./HalloweenBatSwarm";
import { HalloweenGhost } from "./HalloweenGhost";
import type { HalloweenScene } from "./halloweenSceneTypes";
import { HalloweenStar } from "./HalloweenStar";

interface HalloweenBackdropProps {
  scene: HalloweenScene;
  animated: boolean;
}

export function HalloweenBackdrop({ scene, animated }: HalloweenBackdropProps) {
  return (
    <>
      {scene.stars.map((spec) => (
        <HalloweenStar key={spec.id} spec={spec} animated={animated} />
      ))}
      {scene.ghosts.far.map((spec) => (
        <HalloweenGhost key={spec.id} spec={spec} animated={animated} />
      ))}
      {scene.swarm ? <HalloweenBatSwarm spec={scene.swarm} animated={animated} /> : null}
      {scene.bats.map((spec) => (
        <HalloweenBat key={spec.id} spec={spec} animated={animated} />
      ))}
    </>
  );
}
