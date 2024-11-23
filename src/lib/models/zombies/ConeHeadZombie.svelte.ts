import Zombie, { type ZombieConfig } from "./Zombie.svelte";

export default class ConeHeadZombie extends Zombie {
  constructor(zombieConfig: Partial<ZombieConfig>) {
    super({
      name: "Cone Head Zombie",
      health: 200,
      damage: 8,
      speed: 0.8,
      row: zombieConfig.row || 0,
      image: "cone-head-zombie.png",
      ...zombieConfig,
    });
  }
}
