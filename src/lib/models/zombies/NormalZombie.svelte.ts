import Zombie, { type ZombieConfig } from "./Zombie.svelte";

export default class NormalZombie extends Zombie {
  constructor(zombieConfig: Partial<ZombieConfig>) {
    super({
      name: "Normal Zombie",
      health: 100,
      damage: 8,
      speed: 3,
      row: zombieConfig.row || 0,
      ...zombieConfig,
    });
  }
}
