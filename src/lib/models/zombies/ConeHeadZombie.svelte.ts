import Zombie, { type ZombieConfig } from "./Zombie.svelte";

export default class ConeHeadZombie extends Zombie {
  constructor(zombieConfig: Partial<ZombieConfig>) {
    super({
      name: "Cone Head Zombie",
      health: 400,
      damage: 8,
      speed: 0.5,
      row: zombieConfig.row || 0,
      image: "cone-head-zombie.png",
      description: "A zombie with a cone on its head, it has higher health.",
      ...zombieConfig,
    });
  }
}
