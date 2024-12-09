import { CELL_WIDTH } from "$lib/constants/sizes";
import Zombie, { type ZombieConfig } from "./Zombie.svelte";

export default class FlagZombie extends Zombie {
  constructor(zombieConfig: Partial<ZombieConfig>) {
    super({
      name: "Flag Zombie",
      health: 100,
      damage: 8,
      speed: 1.2,
      row: zombieConfig.row || 0,
      image: "flag-zombie.png",
      imageWidth: CELL_WIDTH * 1.2,
      ...zombieConfig,
    });
  }
}
