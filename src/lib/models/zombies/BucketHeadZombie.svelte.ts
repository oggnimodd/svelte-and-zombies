import Zombie, { type ZombieConfig } from "./Zombie.svelte";

export default class BucketHeadZombie extends Zombie {
  constructor(zombieConfig: Partial<ZombieConfig>) {
    super({
      name: "Bucket Head Zombie",
      health: 300,
      damage: 8,
      speed: 0.8,
      row: zombieConfig.row || 0,
      image: "bucket-head-zombie.png",
      ...zombieConfig,
    });
  }
}
