import { CELL_WIDTH } from "$lib/constants/sizes";
import Zombie, { type ZombieConfig } from "./Zombie.svelte";

export default class FootballZombie extends Zombie {
  constructor(zombieConfig: Partial<ZombieConfig>) {
    super({
      name: "Football Zombie",
      health: 500,
      damage: 15,
      speed: 1,
      row: zombieConfig.row || 0,
      image: "football-zombie.png",
      imageWidth: CELL_WIDTH * 1.2,
      ...zombieConfig,
    });
  }
}
