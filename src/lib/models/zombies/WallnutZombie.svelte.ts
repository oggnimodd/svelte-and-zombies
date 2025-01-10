import { CELL_WIDTH } from "$lib/constants/sizes";
import Zombie, { type ZombieConfig } from "./Zombie.svelte";

export default class WallnutZombie extends Zombie {
  constructor(zombieConfig: Partial<ZombieConfig>) {
    super({
      name: "Wallnut Zombie",
      health: 800,
      damage: 8,
      speed: 0.5,
      row: zombieConfig.row || 0,
      image: "wallnut-zombie.png",
      imageWidth: CELL_WIDTH * 1.2,
      description:
        "A zombie with a wallnut on its head, it has very high health.",
      ...zombieConfig,
    });
  }
}
