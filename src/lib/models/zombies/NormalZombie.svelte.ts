import Zombie, { type ZombieConfig } from "./Zombie.svelte";

export default class NormalZombie extends Zombie {
  constructor(zombieConfig: Partial<ZombieConfig>) {
    super({
      name: "Normal Zombie",
      health: 200,
      damage: 8,
      speed: 0.5,
      row: zombieConfig.row || 0,
      image: "normal-zombie.png",
      description: "A basic, slow-moving zombie.",
      ...zombieConfig,
    });
  }
}
