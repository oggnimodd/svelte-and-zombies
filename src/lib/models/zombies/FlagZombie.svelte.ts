import { CELL_WIDTH } from "$lib/constants/sizes";
import Zombie, { type ZombieConfig } from "./Zombie.svelte";

export default class FlagZombie extends Zombie {
  constructor(zombieConfig: Partial<ZombieConfig>) {
    super({
      name: "Flag Zombie",
      health: 200,
      damage: 8,
      speed: 0.7,
      row: zombieConfig.row || 0,
      image: "flag-zombie.png",
      imageWidth: CELL_WIDTH * 1.2,
      description:
        "A zombie carrying a flag, usually appearing at the start of a wave.",
      ...zombieConfig,
    });
  }
}
